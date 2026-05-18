-- Admin profile only: run this after creating the Auth user in Supabase Authentication.

INSERT INTO admin_profiles (user_id, display_name, role)
SELECT id, 'Girnar Admin', 'admin'
FROM auth.users
WHERE lower(email) = lower('GirnarTirthYatraGroup@Gmail.com')
ON CONFLICT DO NOTHING;

SELECT 'admin_profiles' AS table_name, count(*) AS row_count FROM admin_profiles;