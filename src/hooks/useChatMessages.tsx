
import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ClinicConfig {
  clinic_id: string;
  name: string;
  address: string;
  phone: string;
  office_hours: string;
  services_offered: string[];
  insurance_accepted: string[];
  emergency_instructions: string;
}

export const useChatMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);

  // Fetch clinic configuration from database
  useEffect(() => {
    const fetchClinicConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('clinic_id', clinicId)
          .single();

        if (error) {
          console.error('Error fetching clinic config:', error);
          return;
        }

        if (data) {
          setClinicConfig({
            clinic_id: data.clinic_id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            office_hours: data.office_hours,
            services_offered: data.services_offered || [],
            insurance_accepted: data.insurance_accepted || [],
            emergency_instructions: data.emergency_instructions
          });
        }
      } catch (error) {
        console.error('Error fetching clinic config:', error);
      }
    };

    if (clinicId) {
      fetchClinicConfig();
    }
  }, [clinicId]);

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
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: content,
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
  }, [clinicConfig]);

  return {
    messages,
    isLoading,
    sendMessage,
    clinicConfig
  };
};
