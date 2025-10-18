-- Migration: Disable RLS policies for all user data tables
-- Purpose: Remove Row Level Security policies to allow unrestricted access
-- Created: 2025-10-18 12:01:48 UTC
-- Affected tables: categories, incomes, expenses, goals, goal_contributions
-- Notes: This migration disables all RLS policies defined in the initial schema

-- =====================================================
-- DISABLE ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Drop RLS policies for categories table
drop policy "Users can only access their own categories" on public.categories;

-- Drop RLS policies for incomes table
drop policy "Users can only access their own incomes" on public.incomes;

-- Drop RLS policies for expenses table
drop policy "Users can only access their own expenses" on public.expenses;

-- Drop RLS policies for goals table
drop policy "Users can only access their own goals" on public.goals;

-- Drop RLS policies for goal_contributions table
drop policy "Users can only access their own goal contributions" on public.goal_contributions;
