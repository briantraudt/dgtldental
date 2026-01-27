-- Fix RLS for clinics table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on clinics" ON public.clinics;

-- Allow authenticated clinic owners to read their own clinic
CREATE POLICY "Owners can view their clinic"
ON public.clinics FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated clinic owners to update their own clinic
CREATE POLICY "Owners can update their clinic"
ON public.clinics FOR UPDATE
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own clinic
CREATE POLICY "Users can create their clinic"
ON public.clinics FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow service role full access (for edge functions)
-- Edge functions use service role which bypasses RLS, so no additional policy needed

-- Fix RLS for chat_messages table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON public.chat_messages;

-- Create a function to check if user owns the clinic for a message
CREATE OR REPLACE FUNCTION public.user_owns_clinic(_clinic_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinics
    WHERE clinic_id = _clinic_id
      AND user_id = auth.uid()
  )
$$;

-- Allow clinic owners to view their chat messages
CREATE POLICY "Clinic owners can view their messages"
ON public.chat_messages FOR SELECT
USING (public.user_owns_clinic(clinic_id));

-- Allow clinic owners to insert messages for their clinic
CREATE POLICY "Clinic owners can insert messages"
ON public.chat_messages FOR INSERT
WITH CHECK (public.user_owns_clinic(clinic_id));