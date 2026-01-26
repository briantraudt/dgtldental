import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FormStep = 'practice' | 'website' | 'email' | 'done';

interface Message {
  type: 'bot' | 'user';
  content: React.ReactNode;
}

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex gap-1.5 px-5 py-4">
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    await addBotMessage("Great — just a few quick questions.");
    await addBotMessage("What's the name of your practice?");
    setFormStep('practice');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 'practice' && formData.practice) {
      addUserMessage(formData.practice);
      setFormStep(null);
      await addBotMessage("And your website URL?");
      setFormStep('website');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (formStep === 'website' && formData.website) {
      addUserMessage(formData.website);
      setFormStep(null);
      await addBotMessage("Last one — best email to reach you?");
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
      case 'practice': return 'Bright Smile Dental';
      case 'website': return 'https://yourpractice.com';
      case 'email': return 'dr.smith@practice.com';
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img 
            src="/images/dgtl-logo.png" 
            alt="DGTL Dental" 
            className="h-8 md:h-9 w-auto"
          />
          <Button 
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 h-10 rounded-full text-sm font-medium transition-all hover:shadow-lg"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
          {/* Welcome Badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              AI Assistant
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
              Let's get you set up
            </h1>
            <p className="text-gray-500 text-lg">
              A quick conversation to understand your practice
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div 
                  className={`max-w-[90%] md:max-w-[80%] ${
                    msg.type === 'user' 
                      ? 'bg-gray-900 text-white px-5 py-3 rounded-2xl rounded-br-lg' 
                      : 'bg-gray-50 text-gray-700 px-5 py-4 rounded-2xl rounded-bl-lg border border-gray-100'
                  }`}
                >
                  <div className="text-[15px] leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            
            {/* Quick Reply Buttons */}
            {currentButtons.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
                {currentButtons.map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.action}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-sm"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
            
            {/* Form Input */}
            {formStep && formStep !== 'done' && !isTyping && (
              <form onSubmit={handleFormSubmit} className="pt-2 animate-fade-in">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    type={formStep === 'email' ? 'email' : formStep === 'website' ? 'url' : 'text'}
                    value={getInputValue()}
                    onChange={handleInputChange}
                    placeholder={getInputPlaceholder()}
                    required
                    className="flex-1 h-12 rounded-xl border-gray-200 px-4 text-[15px] focus:border-gray-400 focus:ring-0 placeholder:text-gray-400"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !getInputValue()}
                    className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div ref={messagesEndRef} className="h-12" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <img 
                src="/images/dgtl-logo.png" 
                alt="DGTL Dental" 
                className="h-7 w-auto mb-3 opacity-80"
              />
              <p className="text-sm text-gray-500">
                AI-powered patient communication for dental practices.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-gray-900">$99/mo</span>
                <span>·</span>
                <span>No setup fee</span>
                <span>·</span>
                <span>Cancel anytime</span>
              </div>
              <a 
                href="mailto:hello@dgtldental.com" 
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                hello@dgtldental.com
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-gray-400">
              © 2024 DGTL Dental. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuidedChat;
