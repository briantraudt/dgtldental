
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chatTypes';
import { useClinicConfig } from './useClinicConfig';

export const useChatMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { clinicConfig, isLoading: isConfigLoading, error: configError } = useClinicConfig(clinicId);

  const sendMessage = useCallback(async (content: string) => {
    if (!clinicConfig) {
      throw new Error('Clinic configuration not loaded');
    }

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message to AI for clinic:', clinicConfig.clinic_id);
      
      // For demo clinic, use the demo chat endpoint, otherwise use the centralized chat-ai
      const endpoint = clinicConfig.clinic_id === 'demo-clinic-123' ? 'demo-chat' : 'chat-ai';
      
      // Prepare message history for context
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add current message to history
      messageHistory.push({
        role: 'user',
        content: content
      });

      // Call the edge function with full context
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: {
          message: content,
          messages: messageHistory,
          clinicId: clinicConfig.clinic_id
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

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clinicConfig, messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clinicConfig,
    isConfigLoading,
    configError
  };
};
