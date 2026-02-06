
-- Explicitly deny anonymous SELECT access to subscribers
CREATE POLICY "Deny anonymous read access to subscribers"
ON public.subscribers
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Explicitly deny anonymous INSERT access to subscribers
CREATE POLICY "Deny anonymous insert access to subscribers"
ON public.subscribers
AS RESTRICTIVE
FOR INSERT
TO anon
WITH CHECK (false);

-- Explicitly deny anonymous UPDATE access to subscribers
CREATE POLICY "Deny anonymous update access to subscribers"
ON public.subscribers
AS RESTRICTIVE
FOR UPDATE
TO anon
USING (false);

-- Explicitly deny anonymous DELETE access to subscribers
CREATE POLICY "Deny anonymous delete access to subscribers"
ON public.subscribers
AS RESTRICTIVE
FOR DELETE
TO anon
USING (false);
