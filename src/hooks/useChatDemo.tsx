import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { getTemplatedResponse } from '@/utils/chatTemplateUtils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Improved scroll behavior for both mobile and desktop
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
          const messageElements = scrollElement.querySelectorAll('[data-message]');
          
          if (messageElements.length >= 2) {
            // Get the user message (second to last) and assistant message (last)
            const userMessageElement = messageElements[messageElements.length - 2];
            const assistantMessageElement = messageElements[messageElements.length - 1];
            
            if (userMessageElement && assistantMessageElement) {
              const userRect = userMessageElement.getBoundingClientRect();
              const assistantRect = assistantMessageElement.getBoundingClientRect();
              const containerRect = scrollElement.getBoundingClientRect();
              
              // Calculate the total height needed to show both messages
              const userMessageTop = scrollElement.scrollTop + userRect.top - containerRect.top;
              const assistantMessageBottom = scrollElement.scrollTop + assistantRect.bottom - containerRect.top;
              
              // Determine if we need to scroll to show both messages
              const availableHeight = containerRect.height;
              const neededHeight = assistantMessageBottom - userMessageTop;
              
              if (neededHeight <= availableHeight) {
                // Both messages can fit, position user message at top with padding
                const topPadding = 16; // Consistent padding for all screen sizes
                const targetScrollTop = Math.max(0, userMessageTop - topPadding);
                
                scrollElement.scrollTo({ 
                  top: targetScrollTop, 
                  behavior: 'smooth' 
                });
              } else {
                // Messages don't fit, prioritize showing user question and start of assistant response
                const targetScrollTop = Math.max(0, userMessageTop - 16);
                
                scrollElement.scrollTo({ 
                  top: targetScrollTop, 
                  behavior: 'smooth' 
                });
              }
            }
          } else {
            // Fallback to normal scroll for single messages
            scrollElement.scrollTo({ 
              top: scrollElement.scrollHeight, 
              behavior: 'smooth' 
            });
          }
        }, 150); // Slightly longer delay to ensure DOM is updated
      }
    }
  }, [messages]);

  // Focus input after assistant responds (not after user messages to avoid interruption)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Only focus if the last message is from assistant
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 300); // Slightly longer delay to let scroll complete
        }
      }
    }
  }, [isLoading, messages]);

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
        // Build conversation history for OpenAI API
        const conversationHistory = [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Fall back to AI response for general dental questions with full context
        const { data, error } = await supabase.functions.invoke('demo-chat', {
          body: { 
            message: currentMessage,
            messages: conversationHistory // Send full conversation history
          }
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

  return {
    messages,
    message,
    isLoading,
    scrollAreaRef,
    inputRef,
    setMessage,
    handleSendMessage,
    handleKeyPress
  };
};
