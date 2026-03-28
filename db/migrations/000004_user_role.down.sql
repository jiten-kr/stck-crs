-- Drop index
DROP INDEX IF EXISTS idx_users_access_role;

-- Drop column
ALTER TABLE users DROP COLUMN IF EXISTS access_role;

-- Drop ENUM
DROP TYPE IF EXISTS access_role;