import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatWidget from '@/components/ChatWidget';
import SuperAdminLogin from '@/components/SuperAdminLogin';
import { useChatDemo } from '@/hooks/useChatDemo';
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';
import { MessageSquare, Users, Activity, Settings, LogOut } from 'lucide-react';

const SuperAdmin = () => {
  const { isAuthenticated, isLoading, login, logout } = useSuperAdminAuth();
  const [clinics, setClinics] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedClinicId, setSelectedClinicId] = useState('demo-clinic-123');

  // Use the chat demo hook for testing
  const {
    messages,
    message,
    isLoading: chatLoading,
    scrollAreaRef,
    inputRef,
    setMessage,
    handleSendMessage,
    handleKeyPress
  } = useChatDemo();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (clinicsError) throw clinicsError;
      setClinics(clinicsData || []);

      // Fetch recent chat messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (messagesError) throw messagesError;
      setChatMessages(messagesData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const getStats = () => {
    const totalClinics = clinics.length;
    const activeClinics = clinics.filter(c => c.subscription_status === 'active').length;
    const totalMessages = chatMessages.length;
    const todayMessages = chatMessages.filter(m => 
      new Date(m.created_at).toDateString() === new Date().toDateString()
    ).length;

    return { totalClinics, activeClinics, totalMessages, todayMessages };
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <SuperAdminLogin onLogin={login} />;
  }

  const stats = getStats();

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading Super Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage all dental practice chatbots</p>
        </div>
        <Button onClick={logout} variant="outline" className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Clinics</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.totalClinics}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Active Subscriptions</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.activeClinics}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Total Messages</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Today's Messages</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.todayMessages}</div>
        </Card>
      </div>

      <Tabs defaultValue="test-chatbot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test-chatbot">Test Master Chatbot</TabsTrigger>
          <TabsTrigger value="clinics">All Clinics</TabsTrigger>
          <TabsTrigger value="messages">Recent Messages</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="test-chatbot" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Master Chatbot Testing</h3>
            <p className="text-gray-600 mb-6">
              Test the master chatbot behavior here. Changes to edge functions will be reflected immediately.
            </p>
            
            <div className="max-w-4xl">
              <ChatWidget
                messages={messages}
                message={message}
                isLoading={chatLoading}
                scrollAreaRef={scrollAreaRef}
                inputRef={inputRef}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                onQuestionClick={setMessage}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">All Dental Practices</h3>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {clinics.map((clinic) => (
                  <div key={clinic.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{clinic.name}</h4>
                      <Badge 
                        variant={clinic.subscription_status === 'active' ? 'default' : 'secondary'}
                      >
                        {clinic.subscription_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{clinic.address}</p>
                    <p className="text-sm text-gray-600 mb-2">Phone: {clinic.phone}</p>
                    <p className="text-sm text-gray-600 mb-2">Email: {clinic.email}</p>
                    <p className="text-xs text-gray-500">
                      Clinic ID: {clinic.clinic_id} | Created: {new Date(clinic.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Chat Messages</h3>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{msg.clinic_id}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-blue-600">User: </span>
                        <span className="text-sm">{msg.message_content}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600">AI: </span>
                        <span className="text-sm">{msg.response_content}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Master Chatbot Configuration</h4>
                <p className="text-sm text-blue-700 mb-3">
                  To modify the master chatbot behavior, edit these edge functions:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <code>supabase/functions/demo-chat/index.ts</code> - Demo chatbot logic</li>
                  <li>• <code>supabase/functions/chat-ai/index.ts</code> - Production chatbot logic</li>
                  <li>• <code>supabase/functions/get-clinic-config/index.ts</code> - Client configurations</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Deployment Status</h4>
                <p className="text-sm text-green-700">
                  ✅ All changes deploy automatically and instantly to all client chatbots
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Testing Locations</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Homepage demo widget</li>
                  <li>• <code>/embed-demo</code> page</li>
                  <li>• This testing interface above</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdmin;
