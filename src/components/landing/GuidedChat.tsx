import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FormStep = 'practice' | 'website' | 'email' | 'done';

interface Message {
  type: 'bot' | 'user';
  content: React.ReactNode;
  showAvatar?: boolean;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-3 py-4">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
      <img src="/lovable-uploads/86e29185-fd00-4d84-965c-1c4760689215.png" alt="" className="w-5 h-5" />
    </div>
    <div className="flex gap-1.5 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
    </div>
  </div>
);

const GuidedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentButtons, setCurrentButtons] = useState<{ label: string; action: () => void }[]>([]);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [formStep, setFormStep] = useState<FormStep | null>(null);
  const [formData, setFormData] = useState({ practice: '', website: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentButtons, formStep]);

  const addBotMessage = (content: React.ReactNode, showAvatar = true): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', content, showAvatar }]);
        setTimeout(resolve, 100);
      }, 400 + Math.random() * 200);
    });
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { type: 'user', content }]);
  };

  // Start conversation on mount
  useEffect(() => {
    const startConversation = async () => {
      await addBotMessage("Hi — welcome. I'll walk you through this quickly.");
      await addBotMessage("First, so I don't waste your time — do you work in the dental industry?", false);
      setCurrentButtons([
        { label: "Dentist / Practice Owner", action: () => handleDentalResponse("Dentist / Practice Owner") },
        { label: "I work in dental", action: () => handleDentalResponse("I work in dental") },
        { label: "No", action: () => handleNotDental() }
      ]);
    };
    startConversation();
  }, []);

  const handleNotDental = async () => {
    setCurrentButtons([]);
    addUserMessage("No");
    await addBotMessage("This service is built specifically for dental practices. Thanks for stopping by.");
    setConversationEnded(true);
  };

  const handleDentalResponse = async (response: string) => {
    setCurrentButtons([]);
    addUserMessage(response);
    
    await addBotMessage(<>Great. We've answered over <span className="font-semibold text-blue-600">50,000 real dental questions</span> using a dental-trained AI assistant.</>);
    await addBotMessage("We install a custom assistant on your website that answers patient questions 24/7 using safe, non-diagnostic language.", false);
    await addBotMessage("There's no software to learn and no setup on your end.", false);
    
    await addBotMessage(
      <div className="space-y-3">
        <p>Here's how it works:</p>
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <span>You tell us about your practice</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <span>We build your assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <span>Your web team adds one line of code</span>
          </div>
        </div>
        <p className="font-semibold pt-2">You're live within 24 hours.</p>
      </div>,
      false
    );
    
    await addBotMessage("It never diagnoses, never gives treatment decisions, and always encourages patients to contact your office.", false);
    await addBotMessage("Would you like us to set this up for your website?", false);
    
    setCurrentButtons([
      { label: "Yes, let's do it", action: () => handleYesSetup() },
      { label: "I have a question", action: () => handleQuestion() }
    ]);
  };

  const handleQuestion = async () => {
    setCurrentButtons([]);
    addUserMessage("I have a question");
    await addBotMessage(
      <>No problem. Email us at <a href="mailto:hello@dgtldental.com" className="text-blue-600 underline">hello@dgtldental.com</a> and we'll get back to you shortly.</>
    );
    await addBotMessage("Or if you're ready to get started:", false);
    setCurrentButtons([
      { label: "Yes, let's do it", action: () => handleYesSetup() }
    ]);
  };

  const handleYesSetup = async () => {
    setCurrentButtons([]);
    addUserMessage("Yes, let's do it");
    await addBotMessage("Great! What's the name of your practice?");
    setFormStep('practice');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 'practice' && formData.practice) {
      addUserMessage(formData.practice);
      setFormStep(null);
      await addBotMessage("What's your website?");
      setFormStep('website');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (formStep === 'website' && formData.website) {
      addUserMessage(formData.website);
      setFormStep(null);
      await addBotMessage("Best email to reach you?");
      setFormStep('email');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (formStep === 'email' && formData.email) {
      addUserMessage(formData.email);
      setFormStep(null);
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('setup_requests' as any)
          .insert({
            practice_name: formData.practice,
            website_url: formData.website,
            contact_name: formData.practice,
            email: formData.email
          });
        
        if (error) throw error;
        
        await addBotMessage(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Thanks — we'll review your site and follow up shortly.</span>
          </div>
        );
        setFormStep('done');
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong. Please try again.');
        setFormStep('email');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputPlaceholder = () => {
    switch (formStep) {
      case 'practice': return 'e.g., Bright Smile Dental';
      case 'website': return 'e.g., https://yourpractice.com';
      case 'email': return 'e.g., dr.smith@yourpractice.com';
      default: return '';
    }
  };

  const getInputValue = () => {
    switch (formStep) {
      case 'practice': return formData.practice;
      case 'website': return formData.website;
      case 'email': return formData.email;
      default: return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [formStep as string]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="/images/dgtl-logo.png" 
            alt="DGTL Dental" 
            className="h-10 md:h-12 w-auto"
          />
          <Button 
            onClick={() => {
              document.getElementById('chat-area')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm"
          >
            Request Setup
          </Button>
        </div>
      </header>

      {/* Chat Container */}
      <div id="chat-area" className="flex-1 overflow-y-auto py-8 md:py-12">
        <div className="max-w-[720px] mx-auto px-4">
          {/* Assistant Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <img src="/lovable-uploads/86e29185-fd00-4d84-965c-1c4760689215.png" alt="" className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">DGTL Assistant</h2>
              <p className="text-sm text-gray-500">Your dental practice AI guide</p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-1">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {msg.type === 'bot' && (
                  <div className="flex items-start gap-3 max-w-[85%]">
                    {msg.showAvatar ? (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <img src="/lovable-uploads/86e29185-fd00-4d84-965c-1c4760689215.png" alt="" className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-9 flex-shrink-0" />
                    )}
                    <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
                      <p className="text-[15px] leading-relaxed text-gray-800">{msg.content}</p>
                    </div>
                  </div>
                )}
                {msg.type === 'user' && (
                  <div className="px-4 py-3 bg-blue-600 text-white rounded-2xl rounded-tr-md shadow-sm max-w-[85%]">
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            {/* Quick Reply Buttons */}
            {currentButtons.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-4 pl-12 animate-fade-in">
                {currentButtons.map((btn, index) => (
                  <Button
                    key={index}
                    onClick={btn.action}
                    variant="outline"
                    className="rounded-full border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-sm py-2 px-4"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Form Input */}
            {formStep && formStep !== 'done' && !isTyping && (
              <form onSubmit={handleFormSubmit} className="pt-4 pl-12 animate-fade-in">
                <div className="flex gap-2 max-w-md">
                  <Input
                    ref={inputRef}
                    type={formStep === 'email' ? 'email' : formStep === 'website' ? 'url' : 'text'}
                    value={getInputValue()}
                    onChange={handleInputChange}
                    placeholder={getInputPlaceholder()}
                    required
                    className="flex-1 rounded-full border-gray-300 px-4 py-2 text-[15px] focus:border-blue-500 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !getInputValue()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5"
                  >
                    {isSubmitting ? '...' : 'Send'}
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </div>

      {/* Pricing Footer */}
      {formStep === null && !conversationEnded && currentButtons.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 text-center">
          <p className="text-sm text-gray-500">$99/month · No setup fee · Cancel anytime</p>
        </div>
      )}
    </div>
  );
};

export default GuidedChat;
