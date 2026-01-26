-- Create a table for setup requests / leads
CREATE TABLE public.setup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  practice_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.setup_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit setup requests" 
ON public.setup_requests 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view (for admin purposes)
CREATE POLICY "Authenticated users can view setup requests" 
ON public.setup_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);