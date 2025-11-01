-- Migration: Make password_hash nullable in users table
-- Purpose: Allow users authenticated via Supabase Auth to have null password_hash
-- Created: 2025-11-01 12:20:16 UTC
-- Affected tables: users
-- Notes: Since we're using Supabase Auth, password hashes are managed by Supabase and not accessible to the application

-- Make password_hash nullable for users authenticated via Supabase Auth
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
