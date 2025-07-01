
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import ChatGreeting from './ChatGreeting';
import QuickQuestions from './QuickQuestions';
import ChatInput from './ChatInput';
import { Message } from '@/types/chatTypes';

interface ChatWidgetProps {
  messages: Message[];
  message: string;
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onQuestionClick: (question: string) => void;
}

const ChatWidget = ({
  messages,
  message,
  isLoading,
  scrollAreaRef,
  inputRef,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  onQuestionClick
}: ChatWidgetProps) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 h-[450px] md:h-[500px] flex flex-col shadow-xl overflow-hidden">
      {/* Header - Updated with demo-focused messaging and mobile optimization */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg md:text-xl leading-tight">Try Me: The 24/7 Assistant for Your Practice</h3>
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed mt-1">Ask me anything about your dental practice—services, insurance, hours, or location. I'm available 24/7.</p>
          </div>
        </div>
      </div>

      {/* Messages area - Updated padding for better text spacing */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 md:p-4 bg-gray-50">
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 && (
            <>
              <ChatGreeting />
              <QuickQuestions onQuestionClick={onQuestionClick} />
            </>
          )}
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 md:px-5 py-3 md:py-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <ChatInput
        ref={inputRef}
        message={message}
        isLoading={isLoading}
        onChange={onMessageChange}
        onSend={onSendMessage}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default ChatWidget;
