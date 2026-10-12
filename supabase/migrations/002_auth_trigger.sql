-- ==========================================
-- Auth Trigger: Auto-create users row
-- Run this SECOND in Supabase SQL Editor
-- ==========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_campus_id uuid;
BEGIN
  -- Get UMP campus ID
  SELECT id INTO default_campus_id FROM public.campuses WHERE nama = 'Universitas Muhammadiyah Purwokerto' LIMIT 1;
  
  -- Create user row with default campus
  INSERT INTO public.users (id, nama, campus_id, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nama', ''), default_campus_id, 'student');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
