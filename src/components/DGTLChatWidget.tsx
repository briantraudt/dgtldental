import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const DGTLChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const getDGTLResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('what') && (lowerMessage.includes('dgtl') || lowerMessage.includes('do'))) {
      return "DGTL Dental creates AI-powered chat widgets specifically for dental practices. Our solution helps dentists attract more patients, streamline communication, and enhance their online presence through intelligent, 24/7 patient engagement.";
    }
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('function'))) {
      return "Our AI chat widget integrates seamlessly into your dental practice website. It provides instant responses to patient inquiries about appointments, services, insurance, and office hours. The widget is customized with your practice information and can handle multiple conversations simultaneously, ensuring no patient inquiry goes unanswered.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "We offer flexible pricing plans tailored to different practice sizes. Our packages include widget customization, HIPAA-compliant hosting, analytics dashboard, and ongoing support. Contact us for a personalized quote based on your practice needs.";
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('benefit')) {
      return "Key features include: 24/7 automated responses, HIPAA compliance, customizable branding, appointment scheduling integration, insurance verification assistance, emergency protocols, and detailed analytics. Benefits include increased patient engagement, reduced phone calls, improved patient satisfaction, and more efficient practice operations.";
    }
    
    if (lowerMessage.includes('setup') || lowerMessage.includes('install') || lowerMessage.includes('implement')) {
      return "Setup is incredibly simple! We provide a single line of code that you add to your website. Our team handles all the configuration, customization with your practice details, and testing. Most practices are up and running within 24-48 hours.";
    }
    
    if (lowerMessage.includes('hipaa') || lowerMessage.includes('secure') || lowerMessage.includes('privacy')) {
      return "Yes, our platform is fully HIPAA compliant with end-to-end encryption, secure data storage, and strict privacy protocols. We understand the importance of patient data protection and have built our system with healthcare compliance as a top priority.";
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('try') || lowerMessage.includes('test')) {
      return "You can see our chat widget in action right here on this page! We also offer personalized demos where we can show you how it would look and function on your specific website. Would you like to schedule a demo or get started with a free trial?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('support')) {
      return "You can reach our team at hello@dgtldental.com or schedule a consultation through our website. We're here to answer any questions and help you transform your dental practice's patient communication!";
    }
    
    return "I'm here to help you learn about DGTL Dental's AI chat widget for dental practices! Ask me about our features, pricing, setup process, or how our solution can help grow your practice. What would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = getDGTLResponse(currentMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 bg-white shadow-2xl border-0 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">DGTL Dental</h3>
              <p className="text-sm text-blue-100">Ask about our AI chat solution</p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
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
                placeholder="Ask about DGTL Dental..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DGTLChatWidget;
