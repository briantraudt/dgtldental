
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Settings, BarChart3, CreditCard } from 'lucide-react';
import ChatCustomization from '@/components/portal/ChatCustomization';
import { useToast } from '@/hooks/use-toast';

const StagingPortal = () => {
  const [clinic, setClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use demo clinic for staging
  const clinicId = 'demo-clinic-123';

  useEffect(() => {
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('clinic_id', clinicId)
        .single();

      if (error) throw error;
      setClinic(data);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
      toast({
        title: "Error",
        description: "Failed to load clinic information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4">Loading staging portal...</div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">Clinic Not Found</div>
        <p className="text-gray-600">Unable to load demo clinic for staging.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-blue-900">STAGING PORTAL</span>
        </div>
        <p className="text-blue-700 text-sm">
          This is your staging environment for testing portal changes. All modifications here are safe and won't affect live clients.
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clinic.name}</h1>
            <p className="text-gray-600 mt-2">Staging Portal - Test Your Changes</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            staging
          </Badge>
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
            <div className="mt-2 text-2xl font-bold text-gray-900">Staging</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Test Environment</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Plan</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">Demo</div>
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
          <ChatCustomization clinicId={clinicId} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500">This is where analytics will be displayed in the client portal.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Practice Settings (Demo)</span>
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
                <span>Billing Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Billing Portal Preview</h3>
                <p className="text-gray-500">This is where billing information will be displayed in the client portal.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StagingPortal;
