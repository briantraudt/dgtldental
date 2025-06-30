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

  useEffect(() => {
    // Improved scroll behavior - scroll to show the user's message and start of response
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
          // Less aggressive scroll that keeps some context visible
          const scrollHeight = scrollElement.scrollHeight;
          const clientHeight = scrollElement.clientHeight;
          const maxScroll = scrollHeight - clientHeight;
          
          // Scroll to show recent messages but not hide the user's question
          const targetScroll = Math.max(0, maxScroll - 100);
          scrollElement.scrollTop = targetScroll;
        }, 100);
      }
    }
  }, [messages]);

  // Separate effect for when loading starts/stops to ensure smooth UX
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Final scroll adjustment after assistant response is complete
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          setTimeout(() => {
            const scrollHeight = scrollElement.scrollHeight;
            const clientHeight = scrollElement.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            
            // Show the beginning of the assistant's response
            const targetScroll = Math.max(0, maxScroll - 80);
            scrollElement.scrollTop = targetScroll;
          }, 150);
        }
      }
    }
  }, [isLoading, messages.length]);

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

  return {
    messages,
    message,
    isLoading,
    scrollAreaRef,
    setMessage,
    handleSendMessage,
    handleKeyPress
  };
};
