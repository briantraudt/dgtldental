
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessagesListProps {
  chatMessages: any[];
}

const MessagesList = ({ chatMessages }: MessagesListProps) => {
  return (
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
  );
};

export default MessagesList;
