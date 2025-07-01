
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ChatWidget from '@/components/ChatWidget';
import StagingPortal from '@/components/staging/StagingPortal';
import ClientSelector from '@/components/ClientSelector';
import ClinicsList from './ClinicsList';
import MessagesList from './MessagesList';
import SystemSettings from './SystemSettings';
import { useStagingChat } from '@/hooks/useStagingChat';

interface SuperAdminTabsProps {
  clinics: any[];
  chatMessages: any[];
  onUpdate: () => void;
}

const SuperAdminTabs = ({ clinics, chatMessages, onUpdate }: SuperAdminTabsProps) => {
  const {
    messages,
    message,
    isLoading: chatLoading,
    scrollAreaRef,
    inputRef,
    setMessage,
    handleSendMessage,
    handleKeyPress
  } = useStagingChat();

  return (
    <Tabs defaultValue="staging-test" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="staging-test">Staging Chat</TabsTrigger>
        <TabsTrigger value="staging-portal">Staging Portal</TabsTrigger>
        <TabsTrigger value="deploy-updates">Deploy Updates</TabsTrigger>
        <TabsTrigger value="clinics">All Clients</TabsTrigger>
        <TabsTrigger value="messages">Recent Messages</TabsTrigger>
        <TabsTrigger value="settings">System Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="staging-test" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Staging Chat Environment - Safe Testing</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">STAGING CHAT MODE</span>
            </div>
            <p className="text-blue-700 text-sm">
              Test your chatbot changes here. All changes and tests are isolated from your live clients.
            </p>
          </div>
          
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

      <TabsContent value="staging-portal" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Staging Portal Environment - Safe Testing</h3>
          <StagingPortal />
        </Card>
      </TabsContent>

      <TabsContent value="deploy-updates" className="space-y-6">
        <ClientSelector 
          clinics={clinics} 
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="clinics" className="space-y-6">
        <ClinicsList clinics={clinics} />
      </TabsContent>

      <TabsContent value="messages" className="space-y-6">
        <MessagesList chatMessages={chatMessages} />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};

export default SuperAdminTabs;
