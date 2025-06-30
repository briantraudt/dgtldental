
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ClinicConfig {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  insurance: string[];
  emergencyInstructions: string;
}

// Mock clinic configurations
const CLINIC_CONFIGS: Record<string, ClinicConfig> = {
  'demo-clinic-123': {
    id: 'demo-clinic-123',
    name: 'DGTL Dental',
    address: '123 Main St, Boerne, TX 78006',
    phone: '(830) 555-1234',
    hours: 'Mon–Fri 8am–5pm, Sat 9am–1pm, Closed Sunday',
    services: ['cleanings', 'crowns', 'Invisalign', 'dental implants', 'fillings', 'root canals'],
    insurance: ['Delta Dental', 'MetLife', 'Cigna', 'Aetna'],
    emergencyInstructions: 'For dental emergencies, please call our office at (830) 555-1234. If after hours, leave a message and we will return your call as soon as possible.'
  },
  'clinic-456': {
    id: 'clinic-456',
    name: 'Sunshine Family Dentistry',
    address: '456 Oak Ave, San Antonio, TX 78201',
    phone: '(210) 555-9876',
    hours: 'Mon–Thu 7am–6pm, Fri 7am–3pm, Closed weekends',
    services: ['preventive care', 'cosmetic dentistry', 'orthodontics', 'oral surgery'],
    insurance: ['United Healthcare', 'BlueCross BlueShield', 'Humana'],
    emergencyInstructions: 'For emergencies, call (210) 555-9876. After hours emergencies will be directed to our on-call dentist.'
  }
};

export const useChatMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSystemPrompt = (clinicConfig: ClinicConfig): string => {
    return `You are a helpful dental assistant for ${clinicConfig.name} located at ${clinicConfig.address}. 

Our office hours are: ${clinicConfig.hours}
Phone: ${clinicConfig.phone}

Services we offer: ${clinicConfig.services.join(', ')}
Insurance we accept: ${clinicConfig.insurance.join(', ')}

Emergency instructions: ${clinicConfig.emergencyInstructions}

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
    const clinicConfig = CLINIC_CONFIGS[clinicId];
    if (!clinicConfig) {
      throw new Error('Clinic configuration not found');
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
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clinicId]);

  return {
    messages,
    isLoading,
    sendMessage
  };
};

// Simulate OpenAI API response (replace with actual API call)
const simulateOpenAIResponse = async (userMessage: string, clinicConfig: ClinicConfig): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerMessage = userMessage.toLowerCase();

  // Simple rule-based responses for demo
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
    return `Our office hours are ${clinicConfig.hours}. You can reach us at ${clinicConfig.phone} during these times.`;
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return `I'd be happy to help you schedule an appointment! Please call our office at ${clinicConfig.phone} and our staff will find a convenient time for you. Our hours are ${clinicConfig.hours}.`;
  }

  if (lowerMessage.includes('insurance')) {
    return `We accept the following insurance plans: ${clinicConfig.insurance.join(', ')}. Please call us at ${clinicConfig.phone} to verify your specific coverage and benefits.`;
  }

  if (lowerMessage.includes('services') || lowerMessage.includes('treatment')) {
    return `We offer a full range of dental services including: ${clinicConfig.services.join(', ')}. For more information about any specific treatment, please call us at ${clinicConfig.phone}.`;
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('pain') || lowerMessage.includes('urgent')) {
    return `${clinicConfig.emergencyInstructions} Please don't hesitate to call us at ${clinicConfig.phone} if you're experiencing dental pain or have an urgent concern.`;
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
    return `We're located at ${clinicConfig.address}. You can call us at ${clinicConfig.phone} if you need directions or have any questions.`;
  }

  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
    return `Treatment costs can vary depending on your specific needs and insurance coverage. We'd be happy to provide you with a detailed estimate after an examination. Please call us at ${clinicConfig.phone} to schedule a consultation.`;
  }

  // Default response
  return `Thank you for your question! I'm here to help with information about ${clinicConfig.name}. You can reach us at ${clinicConfig.phone} during our office hours (${clinicConfig.hours}) for more detailed assistance. Is there anything specific about our services, hours, or appointments I can help you with?`;
};

// Add nanoid dependency
