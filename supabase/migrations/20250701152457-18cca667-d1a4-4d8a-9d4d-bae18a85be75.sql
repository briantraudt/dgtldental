
-- Add columns to the clinics table to store customizable content
ALTER TABLE public.clinics 
ADD COLUMN IF NOT EXISTS custom_header_title TEXT DEFAULT 'Try Me: The 24/7 Assistant for Your Practice',
ADD COLUMN IF NOT EXISTS custom_header_subtitle TEXT DEFAULT 'Ask me anything about your dental practice—services, insurance, hours, or location. I''m available 24/7.',
ADD COLUMN IF NOT EXISTS custom_intro_message TEXT DEFAULT 'Hi there! I''m a demo AI assistant for dental practices.',
ADD COLUMN IF NOT EXISTS custom_intro_subtitle TEXT DEFAULT 'Ask me anything about your dental practice—services, insurance, hours, or location. I''m available 24/7.',
ADD COLUMN IF NOT EXISTS custom_common_questions TEXT[] DEFAULT ARRAY[
  'What dental insurance plans do you accept?',
  'Are you accepting new patients?',
  'How much is a cleaning?',
  'Where are you located?',
  'What are your office hours?'
];

-- Create a new table for custom Q&A pairs
CREATE TABLE IF NOT EXISTS public.custom_qa_pairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES public.clinics(clinic_id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the custom_qa_pairs table
ALTER TABLE public.custom_qa_pairs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom_qa_pairs
CREATE POLICY "Allow all operations on custom_qa_pairs" 
  ON public.custom_qa_pairs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
