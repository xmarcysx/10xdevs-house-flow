-- Seed data for development
-- Create default user for testing

INSERT INTO public.users (id, email, password_hash, first_name, last_name)
VALUES ('712e5ba4-b381-4690-bd82-36c22d970dc2', 'default@example.com', 'dummy_hash', 'Default', 'User')
ON CONFLICT (id) DO NOTHING;
