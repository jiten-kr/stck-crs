-- Create ENUM for access roles
CREATE TYPE access_role AS ENUM (
  'admin',
  'operations_manager',
  'order_auditor',
  'support_agent'
);

-- Add column WITHOUT default and allow NULL
ALTER TABLE users
ADD COLUMN access_role access_role;

-- Index for performance
CREATE INDEX idx_users_access_role ON users(access_role);