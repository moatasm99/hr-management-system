-- Create test account directly in Supabase
-- Run this in Supabase SQL Editor

-- Insert test company
INSERT INTO "Company" (name, "createdAt", "updatedAt")
VALUES ('Test Company', NOW(), NOW())
ON CONFLICT DO NOTHING
RETURNING id;

-- Insert test user
-- Email: admin@test.com
-- Password: test123
INSERT INTO "User" (email, password, name, role, "companyId", "createdAt", "updatedAt")
VALUES (
  'admin@test.com',
  '$2b$10$9kv.5Hcdg6vAEdjqEgfpre9cmJ2D1CMGWcjM8s7IbAVe2DRzlqIH.',
  'Test Admin',
  'HR',
  (SELECT id FROM "Company" WHERE name = 'Test Company' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
