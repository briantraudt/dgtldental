-- Deny all client-side SELECT on setup_requests.
-- Edge functions use service_role key and bypass RLS.
CREATE POLICY "No public read access"
  ON public.setup_requests
  FOR SELECT
  TO authenticated, anon
  USING (false);
