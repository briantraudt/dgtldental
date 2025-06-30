
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
      <div className="flex space-x-4">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask about our services, hours, location, or any dental questions..."
          disabled={isLoading}
          className="flex-1 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl px-6 py-4 text-lg text-gray-700 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-blue-300"
        />
        <Button
          onClick={onSend}
          disabled={isLoading || !message.trim()}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 h-14 w-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
