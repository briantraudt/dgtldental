import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Mock clinic data for demo purposes
const DEMO_CLINIC_DATA = {
  name: "Smile Family Dental",
  address: "123 Main Street, Downtown City, TX 75201",
  phone: "(555) 123-CARE",
  email: "info@smilefamilydental.com",
  website: "www.smilefamilydental.com",
  officeHours: {
    monday: "8:00 AM - 6:00 PM",
    tuesday: "8:00 AM - 6:00 PM", 
    wednesday: "8:00 AM - 6:00 PM",
    thursday: "8:00 AM - 6:00 PM",
    friday: "8:00 AM - 5:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed"
  },
  services: [
    "General Dentistry",
    "Teeth Cleaning & Preventive Care",
    "Dental Fillings",
    "Crowns & Bridges",
    "Root Canal Therapy",
    "Dental Implants",
    "Teeth Whitening",
    "Invisalign",
    "Emergency Dental Care",
    "Pediatric Dentistry"
  ],
  insurance: [
    "Delta Dental",
    "Cigna",
    "Aetna",
    "MetLife",
    "Blue Cross Blue Shield",
    "United Healthcare",
    "Humana"
  ],
  emergencyInstructions: "For dental emergencies after hours, please call our main number at (555) 123-CARE and follow the prompts. For severe emergencies, visit your nearest emergency room."
};

const EmbeddedChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to show new messages, but not to the very bottom
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        // Delay scroll to ensure content is rendered
        setTimeout(() => {
          const lastMessage = scrollElement.lastElementChild?.lastElementChild;
          if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [messages]);

  // Check if message matches common templates
  const getTemplatedResponse = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Office hours
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
      return `Our office hours are:
      
Monday - Thursday: ${DEMO_CLINIC_DATA.officeHours.monday}
Friday: ${DEMO_CLINIC_DATA.officeHours.friday}
Saturday: ${DEMO_CLINIC_DATA.officeHours.saturday}
Sunday: ${DEMO_CLINIC_DATA.officeHours.sunday}

You can schedule an appointment by calling us at ${DEMO_CLINIC_DATA.phone} or through our website at ${DEMO_CLINIC_DATA.website}.`;
    }
    
    // Location/Address
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('directions')) {
      return `We're located at ${DEMO_CLINIC_DATA.address}. 

We're conveniently located in downtown with easy parking available. You can find detailed directions on our website at ${DEMO_CLINIC_DATA.website} or call us at ${DEMO_CLINIC_DATA.phone} if you need help finding us.`;
    }
    
    // Services
    if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('what do you do') || lowerMessage.includes('procedures')) {
      return `At ${DEMO_CLINIC_DATA.name}, we offer a comprehensive range of dental services including:

• ${DEMO_CLINIC_DATA.services.join('\n• ')}

We provide personalized care for patients of all ages. Would you like to know more about any specific treatment or schedule a consultation? Call us at ${DEMO_CLINIC_DATA.phone}.`;
    }
    
    // Insurance
    if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage') || lowerMessage.includes('accepted')) {
      return `We accept most major dental insurance plans, including:

• ${DEMO_CLINIC_DATA.insurance.join('\n• ')}
• Most PPO plans

We also offer flexible payment options and financing plans. Our team will help verify your benefits and maximize your insurance coverage. Please bring your insurance card to your appointment or call us at ${DEMO_CLINIC_DATA.phone} to verify coverage.`;
    }
    
    // Contact/Phone
    if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact') || lowerMessage.includes('number')) {
      return `You can reach ${DEMO_CLINIC_DATA.name} at:

📞 Phone: ${DEMO_CLINIC_DATA.phone}
📧 Email: ${DEMO_CLINIC_DATA.email}
🌐 Website: ${DEMO_CLINIC_DATA.website}
📍 Address: ${DEMO_CLINIC_DATA.address}

We're here to help with any questions or to schedule your appointment!`;
    }
    
    // Emergency
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('pain') || lowerMessage.includes('after hours')) {
      return `For dental emergencies:

During office hours: Call us immediately at ${DEMO_CLINIC_DATA.phone}
After hours: ${DEMO_CLINIC_DATA.emergencyInstructions}

Common dental emergencies we treat:
• Severe tooth pain
• Knocked-out teeth
• Broken or chipped teeth
• Lost fillings or crowns
• Dental abscesses

Don't wait - dental emergencies require prompt attention!`;
    }
    
    // Appointment scheduling
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('visit')) {
      return `I'd be happy to help you schedule an appointment at ${DEMO_CLINIC_DATA.name}!

You can schedule by:
📞 Calling us at ${DEMO_CLINIC_DATA.phone}
🌐 Online booking at ${DEMO_CLINIC_DATA.website}
📧 Emailing us at ${DEMO_CLINIC_DATA.email}

Our current availability:
• New patient appointments typically available within 1-2 weeks
• Urgent care appointments often same-day
• We offer early morning and Saturday appointments

What type of appointment are you looking for?`;
    }
    
    return null;
  };

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

  const quickQuestions = [
    "What are your office hours?",
    "Where are you located?",
    "What services do you offer?",
    "Do you accept my insurance?",
    "How do I schedule an appointment?"
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-[500px] flex flex-col shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 mr-3" />
          <div>
            <h3 className="font-semibold text-lg">Smile Family Dental Assistant</h3>
            <p className="text-blue-100">How can I help you today?</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-gray-600 mb-6">Welcome! Ask me about our practice:</p>
              <div className="space-y-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(question)}
                    className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 rounded-lg border border-blue-200 transition-colors"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-6 border-t">
        <div className="flex space-x-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about our services, hours, location..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedChatDemo;
