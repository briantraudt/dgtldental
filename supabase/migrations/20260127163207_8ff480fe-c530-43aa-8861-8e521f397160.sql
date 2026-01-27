-- Drop the existing permissive policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create secure RLS policies for subscribers (user_id only, no email check)
CREATE POLICY "Users can view their own subscription"
ON public.subscribers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid());

-- INSERT restricted - only service role (edge functions/webhooks) should create subscriptions
-- No policy needed as service role bypasses RLS