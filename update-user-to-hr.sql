-- Update test user to HR role
UPDATE "User" 
SET role = 'HR' 
WHERE email = 'admin@test.com';

-- Verify the update
SELECT id, name, email, role FROM "User" WHERE email = 'admin@test.com';
