
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

// Demo clinic configuration for marketing page
const DEMO_CLINIC_CONFIG: ClinicConfig = {
  clinic_id: 'demo-clinic-123',
  name: 'Demo Dental Practice',
  address: '123 Demo Street, Demo City, DC 12345',
  phone: '(555) 123-DEMO',
  office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
  services_offered: [
    'General Dentistry',
    'Dental Cleanings',
    'Fillings',
    'Crowns',
    'Root Canals',
    'Teeth Whitening',
    'Dental Implants',
    'Orthodontics'
  ],
  insurance_accepted: [
    'Most Major Insurance Plans',
    'Delta Dental',
    'Aetna',
    'Cigna',
    'MetLife'
  ],
  emergency_instructions: 'For dental emergencies after hours, please call our main number and follow the prompts for emergency care.'
};

export const useChatMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);

  // Fetch clinic configuration from database or use demo config
  useEffect(() => {
    const fetchClinicConfig = async () => {
      // If it's the demo clinic, use the demo config
      if (clinicId === 'demo-clinic-123') {
        setClinicConfig(DEMO_CLINIC_CONFIG);
        return;
      }

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
      // For demo clinic, use the demo chat endpoint
      const endpoint = clinicConfig.clinic_id === 'demo-clinic-123' ? 'demo-chat' : 'chat-ai';
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke(endpoint, {
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
