
-- Create a table for storing clinic information
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id TEXT UNIQUE NOT NULL, -- Custom clinic identifier like "hillcountry-001"
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  office_hours TEXT NOT NULL,
  services_offered TEXT[] NOT NULL DEFAULT '{}',
  insurance_accepted TEXT[] NOT NULL DEFAULT '{}',
  emergency_instructions TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a table for tracking chat messages (for future analytics)
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES public.clinics(clinic_id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  response_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for clinics table (for now, make it accessible for development)
CREATE POLICY "Allow all operations on clinics" ON public.clinics
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for chat_messages table
CREATE POLICY "Allow all operations on chat_messages" ON public.chat_messages
FOR ALL
USING (true)
WITH CHECK (true);

-- Create an index on clinic_id for faster lookups
CREATE INDEX idx_clinics_clinic_id ON public.clinics(clinic_id);
CREATE INDEX idx_chat_messages_clinic_id ON public.chat_messages(clinic_id);

-- Insert demo clinic data
INSERT INTO public.clinics (
  clinic_id, name, address, phone, email, website_url, office_hours, 
  services_offered, insurance_accepted, emergency_instructions, subscription_status
) VALUES (
  'demo-clinic-123',
  'DGTL Dental',
  '123 Main St, Boerne, TX 78006',
  '(830) 555-1234',
  'info@dgtldental.com',
  'https://dgtldental.com',
  'Mon–Fri 8am–5pm, Sat 9am–1pm, Closed Sunday',
  ARRAY['cleanings', 'crowns', 'Invisalign', 'dental implants', 'fillings', 'root canals'],
  ARRAY['Delta Dental', 'MetLife', 'Cigna', 'Aetna'],
  'For dental emergencies, please call our office at (830) 555-1234. If after hours, leave a message and we will return your call as soon as possible.',
  'active'
);
