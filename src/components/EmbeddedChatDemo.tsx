import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { getTemplatedResponse } from '@/utils/chatTemplateUtils';
import { DEMO_CLINIC_DATA } from '@/data/demoClinicData';
import ChatMessage from './ChatMessage';
import QuickQuestions from './QuickQuestions';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const EmbeddedChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smart scroll behavior to show conversation flow naturally
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
          if (isLoading && messages.length > 0) {
            // When loading, scroll to show the user's question and thinking indicator
            const messagesContainer = scrollElement.children[0];
            if (messagesContainer && messagesContainer.children.length > 0) {
              // Find the last user message and scroll to show it plus some context
              const lastUserMessageIndex = Array.from(messagesContainer.children).findIndex((child, index) => {
                return index === messagesContainer.children.length - 1; // Last message area before loading indicator
              });
              
              if (lastUserMessageIndex >= 0) {
                const lastMessageElement = messagesContainer.children[lastUserMessageIndex] as HTMLElement;
                lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          } else if (messages.length > 0 && !isLoading) {
            // When not loading, scroll to show the start of the latest assistant response
            const messagesContainer = scrollElement.children[0];
            if (messagesContainer && messagesContainer.children.length >= 2) {
              // Get the second to last message (user's question) to show context
              const userQuestionElement = messagesContainer.children[messagesContainer.children.length - 2] as HTMLElement;
              userQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 150);
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // First check for templated responses
      const templatedResponse = getTemplatedResponse(currentMessage);
      
      if (templatedResponse) {
        // Use templated response
        const assistantMessage: Message = {
          id: nanoid(),
          content: templatedResponse,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fall back to AI response for general dental questions
        const { data, error } = await supabase.functions.invoke('demo-chat', {
          body: { message: currentMessage }
        });

        if (error) throw error;

        const assistantMessage: Message = {
          id: nanoid(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: nanoid(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment or call us directly at (555) 123-CARE.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Widget */}
      <div className="bg-white rounded-2xl border border-gray-200 h-[500px] flex flex-col shadow-xl overflow-hidden">
        {/* Header - Updated to blue theme */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Smile Family Dental Assistant</h3>
              <p className="text-blue-100 text-sm">Available 24/7 to answer your questions</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.length === 0 && (
              <>
                <div className="flex justify-start mb-6">
                  <div className="bg-white rounded-2xl px-5 py-4 max-w-[85%] shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">Hi there! I'm the virtual assistant for Smile Family Dental.</p>
                        <p className="text-gray-600 text-sm mt-1">I can answer questions about our hours, services, insurance, or general dental care — 24/7.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <QuickQuestions onQuestionClick={setMessage} />
              </>
            )}
            
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
          message={message}
          isLoading={isLoading}
          onChange={setMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default EmbeddedChatDemo;
