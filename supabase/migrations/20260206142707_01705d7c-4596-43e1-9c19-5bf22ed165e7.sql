-- Explicitly deny anon/public SELECT access to clinics table
-- The existing restrictive policy "Owners can view their clinic" already limits
-- authenticated users to their own rows. This adds a belt-and-suspenders
-- denial for the anon role.
CREATE POLICY "Deny anonymous read access"
  ON public.clinics
  FOR SELECT
  TO anon
  USING (false);
