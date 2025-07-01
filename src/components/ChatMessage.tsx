
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
        className={`max-w-[85%] rounded-2xl px-5 py-4 whitespace-pre-line shadow-sm ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-100'
        }`}
      >
        {message.role === 'assistant' && (
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 pt-1">{message.content}</div>
          </div>
        )}
        {message.role === 'user' && message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
