-- Add missing columns to setup_requests for complete prospect tracking
ALTER TABLE public.setup_requests 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS contact_preference TEXT CHECK (contact_preference IN ('phone', 'email'));

-- Make website_url nullable since we don't collect it in the guided chat
ALTER TABLE public.setup_requests 
ALTER COLUMN website_url DROP NOT NULL;