
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
    <div className="p-6 border-t border-gray-100 bg-white">
      <div className="flex space-x-3">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask about our services, hours, location, or any dental questions..."
          disabled={isLoading}
          className="flex-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500"
        />
        <Button
          onClick={onSend}
          disabled={isLoading || !message.trim()}
          size="icon"
          className="bg-teal-600 hover:bg-teal-700 h-12 w-12 rounded-xl shadow-md transition-all duration-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
