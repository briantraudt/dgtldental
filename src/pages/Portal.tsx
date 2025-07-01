import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Copy, ExternalLink, BarChart3, Settings, Loader2, Eye, MessageSquare, Clock, RefreshCw, LogOut } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface ClinicData {
  clinic_id: string;
  name: string;
  email: string;
  subscription_status: string;
  created_at: string;
}

interface ChatStats {
  totalMessages: number;
  todayMessages: number;
  weekMessages: number;
  averageResponseTime: string;
}

const Portal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);
  const [embedCode, setEmbedCode] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalMessages: 0,
    todayMessages: 0,
    weekMessages: 0,
    averageResponseTime: 'N/A'
  });

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          loadUserClinicData(session.user.email!);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        loadUserClinicData(session.user.email!);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserClinicData = async (userEmail: string) => {
    try {
      // Find clinic by email
      const { data: clinic, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error || !clinic) {
        console.error('Clinic not found for user:', error);
        toast({
          title: "No clinic found",
          description: "No clinic data found for your account. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      setClinicData(clinic);
      const code = `<script defer src="${window.location.origin}/widget.js" data-clinic-id="${clinic.clinic_id}"></script>`;
      setEmbedCode(code);

      // Load chat statistics
      await loadChatStats(clinic.clinic_id);
      
      toast({
        title: "Welcome back!",
        description: `Portal loaded for ${clinic.name}`
      });
    } catch (error) {
      console.error('Error loading clinic data:', error);
      toast({
        title: "Error",
        description: "Could not load your clinic data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadChatStats = async (clinicId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('created_at')
        .eq('clinic_id', clinicId);

      if (error) throw error;

      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayCount = messages?.filter(msg => 
        new Date(msg.created_at) >= todayStart
      ).length || 0;

      const weekCount = messages?.filter(msg => 
        new Date(msg.created_at) >= weekStart
      ).length || 0;

      setChatStats({
        totalMessages: messages?.length || 0,
        todayMessages: todayCount,
        weekMessages: weekCount,
        averageResponseTime: '< 2 seconds'
      });
    } catch (error) {
      console.error('Error loading chat stats:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setClinicData(null);
      setEmbedCode('');
      setChatStats({
        totalMessages: 0,
        todayMessages: 0,
        weekMessages: 0,
        averageResponseTime: 'N/A'
      });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const copyToClipboard = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = embedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } finally {
      setIsCopying(false);
    }
  };

  const refreshStats = () => {
    if (clinicData?.clinic_id) {
      loadChatStats(clinicData.clinic_id);
      toast({
        title: "Stats refreshed",
        description: "Latest analytics data has been loaded"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DGTL Chat Portal</h1>
          <p className="text-xl text-gray-600">Manage your AI chat widget and view analytics</p>
        </div>

        {!user ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign In to Your Portal</CardTitle>
              <p className="text-gray-600">Use the email and password from your signup</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isAuthLoading} className="w-full">
                  {isAuthLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header with clinic info and logout */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    {clinicData ? (
                      <>
                        <h2 className="text-2xl font-bold text-blue-900 mb-1">{clinicData.name}</h2>
                        <p className="text-blue-700 mb-2">Clinic ID: <code className="bg-blue-100 px-2 py-1 rounded text-sm">{clinicData.clinic_id}</code></p>
                        <div className="flex items-center">
                          <CheckCircle className={`h-4 w-4 mr-2 ${clinicData.subscription_status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                          <span className="text-sm capitalize">
                            Subscription: {clinicData.subscription_status || 'Pending'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-blue-900">
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                        Loading clinic data...
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {clinicData && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Member since</p>
                        <p className="text-sm font-medium">
                          {new Date(clinicData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {clinicData && (
              <Tabs defaultValue="embed" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="embed">Embed Code</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="embed" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Widget Embed Code</CardTitle>
                      <p className="text-gray-600">Copy and paste this code into your website's HTML</p>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 relative group">
                        <code className="text-sm break-all font-mono leading-relaxed block pr-12">
                          {embedCode}
                        </code>
                        <Button
                          onClick={copyToClipboard}
                          disabled={isCopying}
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          variant="secondary"
                        >
                          {isCopying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button onClick={copyToClipboard} disabled={isCopying}>
                          {isCopying ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Copying...
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => window.open('/?clinic=' + clinicData.clinic_id, '_blank')}
                          variant="outline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview Widget
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Chat Analytics
                        </CardTitle>
                        <p className="text-gray-600">Monitor your widget's performance</p>
                      </div>
                      <Button onClick={refreshStats} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-900">{chatStats.totalMessages}</p>
                          <p className="text-sm text-blue-700">Total Messages</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-900">{chatStats.todayMessages}</p>
                          <p className="text-sm text-green-700">Today</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-900">{chatStats.weekMessages}</p>
                          <p className="text-sm text-purple-700">This Week</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-orange-900">{chatStats.averageResponseTime}</p>
                          <p className="text-sm text-orange-700">Avg Response</p>
                        </div>
                      </div>
                      
                      {chatStats.totalMessages === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No chat interactions yet</p>
                          <p className="text-sm">Install your widget to start seeing analytics</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Widget Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Practice Information</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Name:</strong> {clinicData.name}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Email:</strong> {clinicData.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Status:</strong> <span className="capitalize">{clinicData.subscription_status}</span>
                          </p>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button variant="outline">
                            Update Practice Info
                          </Button>
                          <Button variant="outline">
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            <div className="text-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
