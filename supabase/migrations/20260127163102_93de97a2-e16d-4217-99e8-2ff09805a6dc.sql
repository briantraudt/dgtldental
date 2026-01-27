-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on custom_qa_pairs" ON public.custom_qa_pairs;

-- Create proper RLS policies for custom_qa_pairs using the existing user_owns_clinic function
CREATE POLICY "Clinic owners can view their Q&A pairs"
ON public.custom_qa_pairs
FOR SELECT
USING (public.user_owns_clinic(clinic_id));

CREATE POLICY "Clinic owners can create Q&A pairs"
ON public.custom_qa_pairs
FOR INSERT
WITH CHECK (public.user_owns_clinic(clinic_id));

CREATE POLICY "Clinic owners can update their Q&A pairs"
ON public.custom_qa_pairs
FOR UPDATE
USING (public.user_owns_clinic(clinic_id));

CREATE POLICY "Clinic owners can delete their Q&A pairs"
ON public.custom_qa_pairs
FOR DELETE
USING (public.user_owns_clinic(clinic_id));