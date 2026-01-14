-- =====================================================
-- CREATE FIRST ADMIN USER
-- =====================================================
--
-- This script helps you create the first admin user for the MMS system.
--
-- IMPORTANT: You must first create the user in Supabase Authentication!
--
-- Steps:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" and create a new user
-- 4. Copy the User UID from the new user
-- 5. Replace 'YOUR_USER_UID_HERE' below with the actual UID
-- 6. Replace the other placeholder values
-- 7. Run this SQL in the Supabase SQL Editor
--
-- =====================================================

-- Create admin user profile
INSERT INTO user_profiles (
  id,
  full_name,
  email,
  role,
  is_active
)
VALUES (
  'YOUR_USER_UID_HERE',  -- Replace with the actual auth.users UID
  'Admin Full Name',      -- Replace with actual name
  'admin@example.com',    -- Replace with actual email (must match auth user)
  'admin',
  true
);

-- Verify the user was created successfully
SELECT * FROM user_profiles WHERE role = 'admin';

-- =====================================================
-- ALTERNATIVE: Create Multiple Admin Users
-- =====================================================
--
-- If you need to create multiple admin users at once:
--
-- 1. Create all users in Supabase Authentication first
-- 2. Get their UIDs
-- 3. Use the following template for each user:

/*
INSERT INTO user_profiles (id, full_name, email, role, is_active)
VALUES
  ('uid-1', 'First Admin', 'admin1@example.com', 'admin', true),
  ('uid-2', 'Second Admin', 'admin2@example.com', 'admin', true);
*/

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
--
-- If you get an error about RLS policies:
-- 1. Make sure you're running this as a superuser in Supabase SQL Editor
-- 2. The SQL Editor bypasses RLS policies
--
-- If the user can't login:
-- 1. Verify the user exists in auth.users table
-- 2. Check that the email matches exactly
-- 3. Ensure is_active is true
-- 4. Verify the auth user has confirmed their email
--
-- To check if user exists in auth.users (requires superuser):
-- SELECT id, email, created_at FROM auth.users WHERE email = 'admin@example.com';
--
-- =====================================================
