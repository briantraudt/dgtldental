
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Settings, BarChart3, CreditCard, User, LogOut, ExternalLink } from 'lucide-react';
import ChatCustomization from '@/components/portal/ChatCustomization';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Portal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchUserClinic();
    }
  }, [user, authLoading, navigate]);

  const fetchUserClinic = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching clinic data:', error);
        if (error.code === 'PGRST116') {
          // No clinic found for this user
          toast({
            title: "No clinic found",
            description: "You don't have a clinic associated with your account yet.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load clinic information",
            variant: "destructive"
          });
        }
      } else {
        setClinic(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive"
      });
      return;
    }

    setIsManagingSubscription(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Error creating customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your portal...</div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Clinic Found</h1>
          <p className="text-gray-600 mb-6">You don't have a clinic associated with your account yet.</p>
          <Button onClick={() => navigate('/signup-flow')}>
            Set Up Your Clinic
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clinic.name}</h1>
            <p className="text-gray-600 mt-2">Manage your AI chat assistant</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant={clinic.subscription_status === 'active' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {clinic.subscription_status}
            </Badge>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Chat Status</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">This Month</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">0 Chats</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Plan</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">Premium</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="customize" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customize">Customize Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="customize">
          <ChatCustomization clinicId={clinic.clinic_id} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Chat Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500">Track your chat performance and user engagement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Practice Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Practice Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.website_url || 'Not set'}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.address}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Office Hours</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">{clinic.office_hours}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing & Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Subscription Management</h3>
                  <p className="text-blue-700 mb-4">
                    Manage your subscription, update payment methods, view invoices, and cancel your subscription through Stripe's secure customer portal.
                  </p>
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={isManagingSubscription}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isManagingSubscription ? (
                      "Opening portal..."
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-gray-600">AI-powered chat widget for your practice</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portal;
