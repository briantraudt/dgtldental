
import { Message } from '@/types/chatTypes';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      data-message
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-4 whitespace-pre-line shadow-sm break-words ${
          message.role === 'user'
            ? 'bg-brand-blue text-white'
            : 'bg-white text-gray-800 border border-gray-100'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
