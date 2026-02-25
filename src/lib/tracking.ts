import { supabase } from '@/integrations/supabase/client';

// Generate a persistent visitor ID
function getVisitorId(): string {
  let id = localStorage.getItem('dgtl_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('dgtl_visitor_id', id);
  }
  return id;
}

// Generate a session ID (resets after 30 min inactivity)
function getSessionId(): string {
  const now = Date.now();
  const stored = sessionStorage.getItem('dgtl_session');
  if (stored) {
    const { id, lastActive } = JSON.parse(stored);
    if (now - lastActive < 30 * 60 * 1000) {
      sessionStorage.setItem('dgtl_session', JSON.stringify({ id, lastActive: now }));
      return id;
    }
  }
  const id = crypto.randomUUID();
  sessionStorage.setItem('dgtl_session', JSON.stringify({ id, lastActive: now }));
  return id;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
  };
}

export async function trackPageView(pagePath?: string) {
  try {
    const utm = getUtmParams();
    await (supabase as any).from('page_views').insert({
      page_path: pagePath || window.location.pathname,
      referrer: document.referrer || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
    });
  } catch (e) {
    // Silent fail - don't disrupt UX
  }
}

export async function trackEvent(eventType: string, eventData: Record<string, any> = {}) {
  try {
    const utm = getUtmParams();
    await (supabase as any).from('site_events').insert({
      event_type: eventType,
      event_data: eventData,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
    });
  } catch (e) {
    // Silent fail
  }
}
