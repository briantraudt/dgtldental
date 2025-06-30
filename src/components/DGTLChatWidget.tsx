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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Auto-focus input after AI response
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      // Small delay to ensure the input is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLoading, messages]);

  const getDGTLResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Helper function to determine if a question is medical vs practice-related
    const isMedicalQuestion = (msg: string): boolean => {
      const medicalKeywords = [
        'pain', 'hurt', 'ache', 'tooth', 'teeth', 'gum', 'bleeding', 'swollen', 'infection',
        'cavity', 'filling', 'crown', 'root canal', 'extraction', 'implant', 'whitening',
        'braces', 'orthodontic', 'cleaning', 'checkup', 'x-ray', 'procedure', 'treatment',
        'diagnosis', 'symptoms', 'medical', 'health', 'dental health', 'oral health'
      ];
      return medicalKeywords.some(keyword => msg.includes(keyword));
    };

    const addDisclaimer = isMedicalQuestion(lowerMessage);
    const disclaimer = addDisclaimer ? "\n\nPlease remember that this is for informational purposes only and not a substitute for professional dental advice. For specific concerns, consult with a qualified dentist." : "";
    
    // Q1: What does this chatbot actually do?
    if (lowerMessage.includes('what') && (lowerMessage.includes('chatbot') || lowerMessage.includes('do') || lowerMessage.includes('this'))) {
      return "This AI assistant answers common questions patients have about your practice, such as hours, location, insurance, and procedures — 24/7. It can also respond to general dental health questions.";
    }
    
    // Q2: Is it trained for dental practices?
    if (lowerMessage.includes('trained') || (lowerMessage.includes('dental') && lowerMessage.includes('practice'))) {
      return "Yes, the assistant is specifically designed to handle dental-related inquiries and knows how to guide patients appropriately.";
    }
    
    // Q3: Can it answer patient questions after hours?
    if (lowerMessage.includes('after hours') || lowerMessage.includes('24/7') || lowerMessage.includes('closed')) {
      return "Absolutely — it's available 24/7, even when your office is closed.";
    }
    
    // Q4: What kind of dental questions can it answer?
    if (lowerMessage.includes('dental questions') || lowerMessage.includes('what questions')) {
      return "Everything from practice logistics to oral health questions like \"What causes toothaches?\" or \"How often should I get cleanings?\"" + disclaimer;
    }
    
    // Q5: How do I install it on my website?
    if (lowerMessage.includes('install') || lowerMessage.includes('setup') || lowerMessage.includes('website')) {
      return "Just paste one line of code into your site's <head> or at the bottom of the <body>. We'll provide it after signup.";
    }
    
    // Q6: What if I don't manage my website?
    if (lowerMessage.includes('don\'t manage') || lowerMessage.includes('web admin')) {
      return "We offer setup help for a flat fee of $100. You or your web admin just need to grant access.";
    }
    
    // Q7: Does it know my practice hours and contact info?
    if (lowerMessage.includes('practice hours') || lowerMessage.includes('contact info') || lowerMessage.includes('my info')) {
      return "Yes — during signup, you'll enter your hours, services, insurance, and emergency policy. The assistant uses that to answer accurately.";
    }
    
    // Q8: Can it book appointments for me?
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return "Not yet — but it can recommend patients call or visit your scheduling page when appropriate.";
    }
    
    // Q9: Can I customize the responses?
    if (lowerMessage.includes('customize') || lowerMessage.includes('personalize')) {
      return "Yes. The AI adapts to your provided info. In the future, we'll support more manual customization too.";
    }
    
    // Q10: Does it handle HIPAA compliance?
    if (lowerMessage.includes('hipaa') || lowerMessage.includes('compliance') || lowerMessage.includes('secure')) {
      return "We do not collect patient data or offer diagnostics. All interactions are secure, and no sensitive data is stored.";
    }
    
    // Q11: Will it say things I don't want it to?
    if (lowerMessage.includes('don\'t want') || lowerMessage.includes('wrong things')) {
      return "The AI is instructed to avoid diagnoses and will defer sensitive or urgent questions to your staff. You control the key info it uses.";
    }
    
    // Q12: How accurate are its dental answers?
    if (lowerMessage.includes('accurate') || lowerMessage.includes('reliable')) {
      return "Very accurate. The AI uses dental-specific guidance and phrasing. For anything unclear or sensitive, it always recommends contacting the office." + disclaimer;
    }
    
    // Q13: How much does it cost?
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('much')) {
      return "Just $10/month, with no contracts. Cancel anytime.";
    }
    
    // Q14: What's the setup fee?
    if (lowerMessage.includes('setup fee') || lowerMessage.includes('installation fee')) {
      return "Free if you do it yourself. If you want us to handle installation, it's a one-time $100 flat fee.";
    }
    
    // Q15: Can I try it before paying?
    if (lowerMessage.includes('try') || lowerMessage.includes('demo') || lowerMessage.includes('test')) {
      return "Yes — there's a live demo right here on the site. Try asking common questions to see how it works.";
    }
    
    // Q16: Will it replace my front desk team?
    if (lowerMessage.includes('replace') || lowerMessage.includes('front desk')) {
      return "No — it supports your team by answering repetitive questions, especially after hours, and freeing up staff time.";
    }
    
    // Q17: Is it hard to manage once installed?
    if (lowerMessage.includes('hard to manage') || lowerMessage.includes('maintenance')) {
      return "Not at all. No ongoing maintenance required. Your info is saved and used intelligently.";
    }
    
    // Q18: Can I see what patients are asking?
    if (lowerMessage.includes('analytics') || lowerMessage.includes('see what') || lowerMessage.includes('reports')) {
      return "We're working on adding analytics. For now, the focus is on real-time support, not logging user data.";
    }
    
    // Q19: Can I use it on a WordPress or Wix site?
    if (lowerMessage.includes('wordpress') || lowerMessage.includes('wix') || lowerMessage.includes('platform')) {
      return "Yes — it works on any website where you can embed a script.";
    }
    
    // Q20: How fast does it respond?
    if (lowerMessage.includes('fast') || lowerMessage.includes('speed') || lowerMessage.includes('quick')) {
      return "Responses are nearly instant, even outside office hours.";
    }
    
    // Q21: Can it speak Spanish?
    if (lowerMessage.includes('spanish') || lowerMessage.includes('language') || lowerMessage.includes('multilingual')) {
      return "Not yet, but multilingual support is on our roadmap.";
    }
    
    // Q22: Is there a contract or long-term commitment?
    if (lowerMessage.includes('contract') || lowerMessage.includes('commitment') || lowerMessage.includes('term')) {
      return "No — it's month-to-month. Cancel anytime.";
    }
    
    // Q23: How do I update my hours or services?
    if (lowerMessage.includes('update') || lowerMessage.includes('change') || lowerMessage.includes('modify')) {
      return "After signup, you'll receive a link to update your clinic info at any time.";
    }
    
    // Q24: Is this a live person or a bot?
    if (lowerMessage.includes('live person') || lowerMessage.includes('bot') || lowerMessage.includes('human')) {
      return "It's an AI assistant — always available, always professional. Patients will see it as a helpful extension of your team.";
    }
    
    // Q25: How do I get started?
    if (lowerMessage.includes('get started') || lowerMessage.includes('sign up') || lowerMessage.includes('begin')) {
      return "Click \"Sign Up Now,\" enter your practice info, and either paste the code into your website or ask us to install it. It only takes a few minutes!";
    }

    // Office hours (practice question - no disclaimer)
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
      return "Our office hours are Monday through Friday 8:00 AM to 6:00 PM, Saturday 9:00 AM to 2:00 PM, and we're closed on Sundays. You can schedule an appointment by calling us at (555) 123-CARE or through our website at www.smilefamilydental.com.";
    }
    
    // Default response
    return "I'm here to help you learn about DGTL's AI assistant for dental practices. Ask me about pricing, setup, features, or how it can help your practice!";
  };

  const suggestedQuestions = [
    "What does this chatbot actually do?",
    "How much does it cost?",
    "How do I install it on my website?",
    "Can it answer patient questions after hours?",
    "Does it handle HIPAA compliance?"
  ];

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

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    // Focus input after setting the suggested question
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
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
              <p className="text-sm text-blue-100">AI Assistant for Dental Practices</p>
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
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center text-gray-600 text-sm">
                    <p className="font-medium">Try asking about:</p>
                  </div>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded-lg border transition-colors"
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
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about DGTL..."
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
