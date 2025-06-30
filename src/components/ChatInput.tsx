
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({ message, isLoading, onChange, onSend, onKeyPress }: ChatInputProps) => {
  return (
    <div className="p-6 border-t">
      <div className="flex space-x-3">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask about our services, hours, location..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={isLoading || !message.trim()}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
