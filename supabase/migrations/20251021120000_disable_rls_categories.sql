-- Migration: Disable RLS for categories table
-- Purpose: Disable Row Level Security for categories table to allow unrestricted access
-- Created: 2025-10-21 12:00:00 UTC
-- Affected tables: categories
-- Notes: This migration disables RLS for categories table since the app uses hardcoded user IDs

-- =====================================================
-- DISABLE ROW LEVEL SECURITY FOR CATEGORIES
-- =====================================================

-- Disable RLS for categories table
alter table public.categories disable row level security;
