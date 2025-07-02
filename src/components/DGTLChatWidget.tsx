
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ContactForm from './ContactForm';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const DGTLChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message.trim().toLowerCase();
    setMessage('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      let response = '';
      
      if (currentMessage.includes('contact') || currentMessage.includes('email') || currentMessage.includes('phone')) {
        response = `You can reach DGTL Dental at:

📧 Email: info@dgtldental.com
📞 Phone: 512-774-5010

Would you like someone from our team to contact you? I can help you submit your contact information.`;
      } else if (currentMessage.includes('yes') && messages.some(msg => msg.content.includes('contact you'))) {
        response = `Great! I'll help you submit your contact information so someone from our team can reach out to you.`;
        // Show contact form after this message
        setTimeout(() => setShowContactForm(true), 1000);
      } else if (currentMessage.includes('service') || currentMessage.includes('what do you do')) {
        response = `DGTL Dental specializes in:

• AI-powered dental practice management
• Patient communication solutions
• Automated appointment scheduling
• 24/7 virtual dental assistants
• Practice growth analytics

We help dental practices streamline operations and improve patient experience. Would you like to learn more about any specific service?`;
      } else if (currentMessage.includes('price') || currentMessage.includes('cost')) {
        response = `Our pricing starts at just $10/month per practice with no contracts required. We offer:

• Basic Plan: $10/month - Essential AI chat features
• Pro Plan: $25/month - Advanced analytics and integrations
• Enterprise: Custom pricing for multi-location practices

Would you like to schedule a demo to see how we can help your practice?`;
      } else {
        response = `Thanks for reaching out! I'm here to help answer questions about DGTL Dental's AI solutions for dental practices. 

You can ask me about:
• Our services and pricing
• How our AI assistants work
• Integration with your current systems
• Scheduling a demo

What would you like to know more about?`;
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactFormSubmit = (data: ContactFormData) => {
    // Here you would typically send the data to your backend
    console.log('Contact form submitted:', data);
    
    toast({
      title: "Thank you!",
      description: "We've received your information and will contact you soon.",
    });

    // Add a confirmation message to the chat
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      content: `Perfect! I've received your contact information. Someone from our team will reach out to you within 24 hours at ${data.email} or ${data.phone}. Thank you for your interest in DGTL Dental!`,
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmationMessage]);
    setShowContactForm(false);
  };

  return (
    <>
      {/* Chat bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-blue hover:bg-brand-blue-hover shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 bg-white shadow-2xl border-0 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-brand-blue text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">DGTL Dental</h3>
              <p className="text-sm text-blue-100">How can I help you today?</p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages area or Contact Form */}
          {showContactForm ? (
            <div className="flex-1 p-4 flex items-center justify-center">
              <ContactForm
                onClose={() => setShowContactForm(false)}
                onSubmit={handleContactFormSubmit}
              />
            </div>
          ) : (
            <>
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Hi! I'm here to help with questions about DGTL Dental's AI solutions.</p>
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                          msg.role === 'user'
                            ? 'bg-brand-blue text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
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
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our AI solutions..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    size="icon"
                    className="bg-brand-blue hover:bg-brand-blue-hover"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default DGTLChatWidget;
