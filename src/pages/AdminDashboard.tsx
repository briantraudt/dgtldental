import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Users, MessageSquare, Eye, TrendingUp, LogOut, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';

interface PageView {
  id: string;
  created_at: string;
  page_path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  user_agent: string | null;
  session_id: string | null;
  visitor_id: string | null;
}

interface SiteEvent {
  id: string;
  created_at: string;
  event_type: string;
  event_data: any;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  visitor_id: string | null;
}

interface SetupRequest {
  id: string;
  created_at: string;
  practice_name: string;
  website_url: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  contact_preference: string | null;
  notes: string | null;
  status: string;
}

interface ChatMessage {
  id: string;
  created_at: string;
  clinic_id: string;
  message_content: string;
  response_content: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [siteEvents, setSiteEvents] = useState<SiteEvent[]>([]);
  const [setupRequests, setSetupRequests] = useState<SetupRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    checkAuth();
    fetchAllData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }
    const { data: roles } = await (supabase as any)
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin');
    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    const [pvRes, evRes, srRes, cmRes] = await Promise.all([
      (supabase as any).from('page_views').select('*').order('created_at', { ascending: false }).limit(500),
      (supabase as any).from('site_events').select('*').order('created_at', { ascending: false }).limit(500),
      (supabase as any).from('setup_requests').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('chat_messages').select('*').order('created_at', { ascending: false }).limit(200),
    ]);
    setPageViews(pvRes.data || []);
    setSiteEvents(evRes.data || []);
    setSetupRequests(srRes.data || []);
    setChatMessages(cmRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // Computed stats
  const uniqueVisitors = new Set(pageViews.map(pv => pv.visitor_id).filter(Boolean)).size;
  const uniqueSessions = new Set(pageViews.map(pv => pv.session_id).filter(Boolean)).size;
  const totalLeads = setupRequests.length;
  const totalChats = chatMessages.length;

  // Referrer breakdown
  const referrerCounts = pageViews.reduce((acc, pv) => {
    const ref = pv.referrer
      ? (() => { try { return new URL(pv.referrer).hostname; } catch { return pv.referrer; } })()
      : 'Direct';
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // UTM source breakdown
  const utmCounts = pageViews.reduce((acc, pv) => {
    if (pv.utm_source) {
      acc[pv.utm_source] = (acc[pv.utm_source] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topUtmSources = Object.entries(utmCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Event type breakdown
  const eventCounts = siteEvents.reduce((acc, ev) => {
    acc[ev.event_type] = (acc[ev.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEvents = Object.entries(eventCounts)
    .sort(([, a], [, b]) => b - a);

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'MMM d, yyyy h:mm a'); } catch { return d; }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted overflow-auto">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">DGTL Admin</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchAllData}>
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-2xl font-bold">{pageViews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unique Visitors</p>
                  <p className="text-2xl font-bold">{uniqueVisitors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leads</p>
                  <p className="text-2xl font-bold">{totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chat Messages</p>
                  <p className="text-2xl font-bold">{totalChats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Setup Requests / Leads ({setupRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {setupRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No leads yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Practice</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Preference</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {setupRequests.map((sr) => (
                        <TableRow key={sr.id}>
                          <TableCell className="whitespace-nowrap text-xs">{formatDate(sr.created_at)}</TableCell>
                          <TableCell className="font-medium">{sr.contact_name}</TableCell>
                          <TableCell>{sr.practice_name}</TableCell>
                          <TableCell>
                            <a href={`mailto:${sr.email}`} className="text-primary hover:underline">
                              {sr.email}
                            </a>
                          </TableCell>
                          <TableCell>{sr.phone || '—'}</TableCell>
                          <TableCell>{sr.contact_preference || '—'}</TableCell>
                          <TableCell>
                            {sr.website_url ? (
                              <a href={sr.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                Visit <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-xs">{sr.notes || '—'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sr.status === 'pending' ? 'bg-warning/20 text-warning' : 'bg-primary/10 text-primary'}`}>
                              {sr.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {topEvents.map(([type, count]) => (
                <Card key={type}>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">{type}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Visitor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteEvents.slice(0, 100).map((ev) => (
                      <TableRow key={ev.id}>
                        <TableCell className="whitespace-nowrap text-xs">{formatDate(ev.created_at)}</TableCell>
                        <TableCell className="font-medium">{ev.event_type}</TableCell>
                        <TableCell className="max-w-[300px] truncate text-xs font-mono">
                          {JSON.stringify(ev.event_data)}
                        </TableCell>
                        <TableCell className="text-xs">{ev.page_path}</TableCell>
                        <TableCell className="text-xs font-mono">{ev.visitor_id?.slice(0, 8) || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{uniqueSessions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Views / Session</p>
                  <p className="text-2xl font-bold">
                    {uniqueSessions > 0 ? (pageViews.length / uniqueSessions).toFixed(1) : '0'}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>UTM Source</TableHead>
                      <TableHead>Visitor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageViews.slice(0, 100).map((pv) => (
                      <TableRow key={pv.id}>
                        <TableCell className="whitespace-nowrap text-xs">{formatDate(pv.created_at)}</TableCell>
                        <TableCell>{pv.page_path}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{pv.referrer || 'Direct'}</TableCell>
                        <TableCell>{pv.utm_source || '—'}</TableCell>
                        <TableCell className="text-xs font-mono">{pv.visitor_id?.slice(0, 8) || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Referral Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {topReferrers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No referral data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topReferrers.map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{source}</span>
                          </div>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>UTM Campaign Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {topUtmSources.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No UTM data yet. Use ?utm_source=linkedin in your links.</p>
                  ) : (
                    <div className="space-y-3">
                      {topUtmSources.map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{source}</span>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle>Chat Messages ({chatMessages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {chatMessages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No chat messages yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Clinic</TableHead>
                        <TableHead>User Message</TableHead>
                        <TableHead>AI Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatMessages.map((cm) => (
                        <TableRow key={cm.id}>
                          <TableCell className="whitespace-nowrap text-xs">{formatDate(cm.created_at)}</TableCell>
                          <TableCell className="text-xs font-mono">{cm.clinic_id}</TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-sm truncate">{cm.message_content}</p>
                          </TableCell>
                          <TableCell className="max-w-[400px]">
                            <p className="text-sm truncate text-muted-foreground">{cm.response_content}</p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* GA Link */}
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Google Analytics</p>
              <p className="text-sm text-muted-foreground">For detailed traffic analytics, visit your GA dashboard</p>
            </div>
            <Button variant="outline" asChild>
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                Open GA <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
