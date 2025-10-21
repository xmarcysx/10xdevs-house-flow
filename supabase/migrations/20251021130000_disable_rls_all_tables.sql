-- Migration: Disable RLS for all tables
-- Purpose: Disable Row Level Security for all user data tables to allow unrestricted access for development
-- Created: 2025-10-21 13:00:00 UTC
-- Affected tables: users, categories, incomes, expenses, goals, goal_contributions
-- Notes: This migration disables RLS for all tables since the app uses hardcoded user IDs

-- =====================================================
-- DISABLE ROW LEVEL SECURITY FOR ALL TABLES
-- =====================================================

-- Disable RLS for users table
alter table public.users disable row level security;

-- Disable RLS for categories table
alter table public.categories disable row level security;

-- Disable RLS for incomes table
alter table public.incomes disable row level security;

-- Disable RLS for expenses table
alter table public.expenses disable row level security;

-- Disable RLS for goals table
alter table public.goals disable row level security;

-- Disable RLS for goal_contributions table
alter table public.goal_contributions disable row level security;
