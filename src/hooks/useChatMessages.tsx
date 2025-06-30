
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

  const getSystemPrompt = (clinicConfig: ClinicConfig): string => {
    return `You are a helpful dental assistant for ${clinicConfig.name} located at ${clinicConfig.address}. 

Our office hours are: ${clinicConfig.office_hours}
Phone: ${clinicConfig.phone}

Services we offer: ${clinicConfig.services_offered.join(', ')}
Insurance we accept: ${clinicConfig.insurance_accepted.join(', ')}

Emergency instructions: ${clinicConfig.emergency_instructions}

Guidelines for responses:
- Be friendly, professional, and helpful
- Do not provide medical diagnoses or treatment advice
- For urgent dental issues, advise patients to call our office
- Help with appointment scheduling by directing them to call our office
- Answer questions about services, hours, insurance, and general dental care
- Keep responses concise but informative
- If asked about pricing, explain that costs vary and they should call for a consultation

Always end responses about emergencies or urgent issues by reminding patients to call our office phone number.`;
  };

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
      // Simulate API call to OpenAI (replace with actual API call)
      const response = await simulateOpenAIResponse(content, clinicConfig);
      
      const assistantMessage: Message = {
        id: nanoid(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Store chat message in database for analytics
      await supabase
        .from('chat_messages')
        .insert({
          clinic_id: clinicId,
          message_content: content,
          response_content: response
        });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clinicId, clinicConfig]);

  return {
    messages,
    isLoading,
    sendMessage,
    clinicConfig
  };
};

// Simulate OpenAI API response (replace with actual API call)
const simulateOpenAIResponse = async (userMessage: string, clinicConfig: ClinicConfig): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerMessage = userMessage.toLowerCase();

  // Simple rule-based responses for demo
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
    return `Our office hours are ${clinicConfig.office_hours}. You can reach us at ${clinicConfig.phone} during these times.`;
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return `I'd be happy to help you schedule an appointment! Please call our office at ${clinicConfig.phone} and our staff will find a convenient time for you. Our hours are ${clinicConfig.office_hours}.`;
  }

  if (lowerMessage.includes('insurance')) {
    return `We accept the following insurance plans: ${clinicConfig.insurance_accepted.join(', ')}. Please call us at ${clinicConfig.phone} to verify your specific coverage and benefits.`;
  }

  if (lowerMessage.includes('services') || lowerMessage.includes('treatment')) {
    return `We offer a full range of dental services including: ${clinicConfig.services_offered.join(', ')}. For more information about any specific treatment, please call us at ${clinicConfig.phone}.`;
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('pain') || lowerMessage.includes('urgent')) {
    return `${clinicConfig.emergency_instructions} Please don't hesitate to call us at ${clinicConfig.phone} if you're experiencing dental pain or have an urgent concern.`;
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
    return `We're located at ${clinicConfig.address}. You can call us at ${clinicConfig.phone} if you need directions or have any questions.`;
  }

  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
    return `Treatment costs can vary depending on your specific needs and insurance coverage. We'd be happy to provide you with a detailed estimate after an examination. Please call us at ${clinicConfig.phone} to schedule a consultation.`;
  }

  // Default response
  return `Thank you for your question! I'm here to help with information about ${clinicConfig.name}. You can reach us at ${clinicConfig.phone} during our office hours (${clinicConfig.office_hours}) for more detailed assistance. Is there anything specific about our services, hours, or appointments I can help you with?`;
};
