-- Remove user-specific tables and make data public
-- Keep only stocks table and make scans public

-- Drop user-specific tables
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.watchlist_items CASCADE;
DROP TABLE IF EXISTS public.watchlists CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.scans CASCADE;

-- Recreate scans table as public (no user_id required)
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  results JSONB,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scans
CREATE POLICY "Anyone can view scans" ON public.scans
FOR SELECT USING (true);

-- Allow anyone to create scans (for public scanner results)
CREATE POLICY "Anyone can create scans" ON public.scans
FOR INSERT WITH CHECK (true);

-- Update triggers
CREATE TRIGGER update_scans_updated_at
  BEFORE UPDATE ON public.scans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Remove the user signup trigger since we don't need profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();