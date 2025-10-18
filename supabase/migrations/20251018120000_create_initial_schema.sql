-- Migration: Create initial database schema for HouseFlow
-- Purpose: Initialize all tables, indexes, triggers, and RLS policies for the financial management application
-- Created: 2025-10-18 12:00:00 UTC
-- Affected tables: users, categories, incomes, expenses, goals, goal_contributions
-- Notes: This is the initial schema migration establishing the core database structure

-- =====================================================
-- TABLE CREATION
-- =====================================================

-- Create users table (managed by Supabase Auth)
-- This table will store user profile information beyond auth data
create table public.users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    first_name varchar(50),
    last_name varchar(50),
    created_at timestamptz not null default now()
);

-- Create categories table
-- Stores expense categories for each user
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    name varchar(100) not null,
    is_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, name)
);

-- Create incomes table
-- Tracks all income entries for users
create table public.incomes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    amount numeric(10,2) not null check(amount > 0),
    date date not null,
    description text,
    source varchar(100),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create expenses table
-- Tracks all expense entries for users, linked to categories
create table public.expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    amount numeric(10,2) not null check(amount > 0),
    date date not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create goals table
-- Stores savings goals with cached current amounts
create table public.goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    name varchar(255) not null,
    target_amount numeric(10,2) not null check(target_amount > 0),
    current_amount numeric(10,2) not null default 0 check(current_amount >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create goal_contributions table
-- Tracks individual contributions towards savings goals
create table public.goal_contributions (
    id uuid primary key default gen_random_uuid(),
    goal_id uuid not null references public.goals(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    amount numeric(10,2) not null check(amount > 0),
    date date not null,
    description text,
    created_at timestamptz not null default now()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Single column indexes for foreign keys and common queries
create index categories_user_id_idx on public.categories(user_id);
create index incomes_user_id_idx on public.incomes(user_id);
create index expenses_user_id_idx on public.expenses(user_id);
create index goals_user_id_idx on public.goals(user_id);
create index goal_contributions_user_id_idx on public.goal_contributions(user_id);
create index goal_contributions_goal_id_idx on public.goal_contributions(goal_id);
create index expenses_category_id_idx on public.expenses(category_id);

-- Composite indexes for optimized date-based queries
create index incomes_user_id_date_idx on public.incomes(user_id, date desc);
create index expenses_user_id_date_idx on public.expenses(user_id, date desc);
create index categories_user_id_name_idx on public.categories(user_id, name);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all user data tables
alter table public.categories enable row level security;
alter table public.incomes enable row level security;
alter table public.expenses enable row level security;
alter table public.goals enable row level security;
alter table public.goal_contributions enable row level security;

-- Categories RLS policies
-- Users can only access their own categories
create policy "Users can only access their own categories" on public.categories
for all using (user_id = auth.uid());

-- Incomes RLS policies
-- Users can only access their own incomes
create policy "Users can only access their own incomes" on public.incomes
for all using (user_id = auth.uid());

-- Expenses RLS policies
-- Users can only access their own expenses
create policy "Users can only access their own expenses" on public.expenses
for all using (user_id = auth.uid());

-- Goals RLS policies
-- Users can only access their own goals
create policy "Users can only access their own goals" on public.goals
for all using (user_id = auth.uid());

-- Goal contributions RLS policies
-- Users can only access their own goal contributions
create policy "Users can only access their own goal contributions" on public.goal_contributions
for all using (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update goal current_amount when contributions change
-- This maintains cached values for performance optimization
create or replace function public.update_goal_current_amount()
returns trigger as $$
begin
    if tg_op = 'INSERT' then
        update public.goals set current_amount = current_amount + new.amount where id = new.goal_id;
        return new;
    elsif tg_op = 'UPDATE' then
        update public.goals set current_amount = current_amount - old.amount + new.amount where id = new.goal_id;
        return new;
    elsif tg_op = 'DELETE' then
        update public.goals set current_amount = current_amount - old.amount where id = old.goal_id;
        return old;
    end if;
end;
$$ language plpgsql;

-- Trigger to automatically update goal current_amount on contribution changes
create trigger goal_contributions_update_current_amount
after insert or update or delete on public.goal_contributions
for each row execute function public.update_goal_current_amount();

-- Function to update updated_at timestamp columns
-- Applied to tables that track modification times
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Triggers for updated_at columns
create trigger update_categories_updated_at before update on public.categories
for each row execute function public.update_updated_at_column();

create trigger update_incomes_updated_at before update on public.incomes
for each row execute function public.update_updated_at_column();

create trigger update_expenses_updated_at before update on public.expenses
for each row execute function public.update_updated_at_column();

create trigger update_goals_updated_at before update on public.goals
for each row execute function public.update_updated_at_column();

-- Function to create default categories for new users
-- Provides a standard set of expense categories automatically
create or replace function public.create_default_categories()
returns trigger as $$
begin
    insert into public.categories (user_id, name, is_default) values
    (new.id, 'dom', true),
    (new.id, 'apteka', true),
    (new.id, 'lekarz', true),
    (new.id, 'środki czystości', true),
    (new.id, 'abonament', true),
    (new.id, 'przyjemności', true),
    (new.id, 'rozrywka', true),
    (new.id, 'ubrania', true),
    (new.id, 'żywność', true),
    (new.id, 'dzieci', true),
    (new.id, 'inne', true);
    return new;
end;
$$ language plpgsql;

-- Trigger to create default categories when a new user is inserted
create trigger create_default_categories_on_user_insert
after insert on public.users
for each row execute function public.create_default_categories();
