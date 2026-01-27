-- Drop the permissive SELECT policy that exposes lead data
DROP POLICY IF EXISTS "Authenticated users can view setup requests" ON public.setup_requests;

-- INSERT policy stays - allows public form submissions
-- SELECT is now restricted to service role only (Supabase dashboard, edge functions)