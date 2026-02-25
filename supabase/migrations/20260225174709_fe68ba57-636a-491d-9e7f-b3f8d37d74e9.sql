
-- Allow admins to delete from setup_requests
CREATE POLICY "Admins can delete setup requests"
ON public.setup_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete from chat_messages
CREATE POLICY "Admins can delete chat messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete from site_events
CREATE POLICY "Admins can delete events"
ON public.site_events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete from page_views
CREATE POLICY "Admins can delete page views"
ON public.page_views
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
