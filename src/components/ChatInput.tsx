
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forwardRef } from 'react';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ message, isLoading, onChange, onSend, onKeyPress }, ref) => {
    return (
      <div className="p-3 md:p-6 border-t border-gray-100 bg-white">
        <div className="flex space-x-2 md:space-x-4">
          <Input
            ref={ref}
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask us anything"
            disabled={isLoading}
            className="flex-1 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl px-4 md:px-6 py-3 md:py-4 text-base md:text-lg text-gray-700 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-blue-300 h-12 md:h-14 placeholder:text-sm md:placeholder:text-base"
          />
          <Button
            onClick={onSend}
            disabled={isLoading || !message.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 h-12 w-12 md:h-14 md:w-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
