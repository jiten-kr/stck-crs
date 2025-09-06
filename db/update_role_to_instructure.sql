UPDATE users
SET role = 'instructor',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
