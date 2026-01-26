import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FormStep = 'practice' | 'website' | 'email' | 'done';

interface Message {
  type: 'bot' | 'user';
  content: React.ReactNode;
}

const TypingIndicator = () => (
  <div className="flex justify-start px-4 md:px-0">
    <div className="flex gap-1.5 py-4">
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }} />
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
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentButtons, formStep]);

  const addBotMessage = (content: React.ReactNode): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', content }]);
        setTimeout(resolve, 150);
      }, 500 + Math.random() * 300);
    });
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { type: 'user', content }]);
  };

  useEffect(() => {
    const startConversation = async () => {
      await addBotMessage("Hi — I'll walk you through this quickly.");
      await addBotMessage("Do you work in the dental industry?");
      setCurrentButtons([
        { label: "Yes, I'm a dentist", action: () => handleDentalResponse("Yes, I'm a dentist") },
        { label: "I work in dental", action: () => handleDentalResponse("I work in dental") },
        { label: "No", action: () => handleNotDental() }
      ]);
    };
    startConversation();
  }, []);

  const handleNotDental = async () => {
    setCurrentButtons([]);
    addUserMessage("No");
    await addBotMessage("This service is built for dental practices. Thanks for stopping by.");
    setConversationEnded(true);
  };

  const handleDentalResponse = async (response: string) => {
    setCurrentButtons([]);
    addUserMessage(response);
    
    await addBotMessage(
      <>We've helped dental practices answer over <span className="font-medium text-gray-900">50,000 patient questions</span> with AI.</>
    );
    await addBotMessage("We install a custom assistant on your site that answers questions 24/7 — using safe, non-diagnostic language.");
    await addBotMessage(
      <div className="space-y-4">
        <p className="font-medium text-gray-900">Here's how it works:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
            <span className="pt-0.5">Tell us about your practice</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
            <span className="pt-0.5">We build your custom assistant</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
            <span className="pt-0.5">Add one line of code to your site</span>
          </div>
        </div>
        <p className="text-gray-900 font-medium pt-1">Live within 24 hours.</p>
      </div>
    );
    await addBotMessage("It never diagnoses or recommends treatment — just answers questions and directs patients to call.");
    await addBotMessage("Want us to set this up for you?");
    
    setCurrentButtons([
      { label: "Yes, let's do it", action: () => handleYesSetup() },
      { label: "I have a question", action: () => handleQuestion() }
    ]);
  };

  const handleQuestion = async () => {
    setCurrentButtons([]);
    addUserMessage("I have a question");
    await addBotMessage(
      <>Email us at <a href="mailto:hello@dgtldental.com" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">hello@dgtldental.com</a> — we'll get back to you quickly.</>
    );
    setCurrentButtons([
      { label: "Actually, let's set it up", action: () => handleYesSetup() }
    ]);
  };

  const handleYesSetup = async () => {
    setCurrentButtons([]);
    addUserMessage("Yes, let's do it");
    await addBotMessage("Great — just a few quick questions. What's the name of your practice?");
    setFormStep('practice');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const value = inputValue.trim();
    setInputValue('');
    
    if (formStep === 'practice') {
      setFormData(prev => ({ ...prev, practice: value }));
      addUserMessage(value);
      setFormStep(null);
      await addBotMessage("And your website URL?");
      setFormStep('website');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (formStep === 'website') {
      setFormData(prev => ({ ...prev, website: value }));
      addUserMessage(value);
      setFormStep(null);
      await addBotMessage("Last one — best email to reach you?");
      setFormStep('email');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (formStep === 'email') {
      const finalFormData = { ...formData, email: value };
      addUserMessage(value);
      setFormStep(null);
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('setup_requests' as any)
          .insert({
            practice_name: finalFormData.practice,
            website_url: finalFormData.website,
            contact_name: finalFormData.practice,
            email: finalFormData.email
          });
        
        if (error) throw error;
        
        await addBotMessage(
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span>Perfect — we'll review your site and follow up within 24 hours.</span>
          </div>
        );
        setFormStep('done');
        setConversationEnded(true);
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
      case 'practice': return 'Enter your practice name...';
      case 'website': return 'Enter your website URL...';
      case 'email': return 'Enter your email...';
      default: return 'Message DGTL...';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const isInputEnabled = formStep && formStep !== 'done' && !isTyping && !isSubmitting;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl" />
      {/* Header */}
      <header className="border-b border-gray-100/80 bg-white/80 backdrop-blur-sm flex-shrink-0 relative z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-center">
          <img 
            src="/images/dgtl-logo.png" 
            alt="DGTL Dental" 
            className="h-8 w-auto"
          />
        </div>
      </header>

      {/* Chat Messages - Scrollable Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div 
                  className={`max-w-[85%] ${
                    msg.type === 'user' 
                      ? 'bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-br-md' 
                      : 'text-gray-700'
                  }`}
                >
                  <div className="text-[15px] leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            
            {/* Quick Reply Buttons */}
            {currentButtons.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {currentButtons.map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.action}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Sticky Bottom Input Area */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="relative">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-gray-300 focus-within:shadow-md transition-all">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getInputPlaceholder()}
                disabled={!isInputEnabled}
                rows={1}
                className="w-full px-4 pt-4 pb-12 text-[15px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ minHeight: '60px', maxHeight: '200px' }}
              />
              <div className="absolute bottom-3 right-3">
                <Button
                  onClick={() => handleFormSubmit()}
                  disabled={!isInputEnabled || !inputValue.trim()}
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:opacity-100 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-xs text-gray-400 mt-3">
            $99/mo · No setup fee · Cancel anytime · <a href="mailto:hello@dgtldental.com" className="hover:text-gray-600 transition-colors">hello@dgtldental.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidedChat;
