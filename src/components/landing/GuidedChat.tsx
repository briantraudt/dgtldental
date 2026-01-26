import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  GreetingMessage,
  QuestionMessage,
  ProofMessage,
  ExplanationMessage,
  ProcessCard,
  UserMessage,
  SuccessMessage,
  TypingIndicator,
  QuickReplyButtons,
} from './chat/MessageTypes';
import ChatInput from './chat/ChatInput';

type ConversationState = 
  | 'initial'
  | 'ask_dental'
  | 'not_dental_end'
  | 'show_proof'
  | 'show_explanation'
  | 'show_process'
  | 'show_safe_language'
  | 'ask_setup'
  | 'show_email_info'
  | 'ask_practice_name'
  | 'ask_website'
  | 'ask_email'
  | 'submitting'
  | 'complete';

interface Message {
  id: string;
  type: 'greeting' | 'question' | 'proof' | 'explanation' | 'process' | 'user' | 'success';
  content: React.ReactNode;
}

interface FormData {
  practice: string;
  website: string;
  email: string;
}

const GuidedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>('initial');
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState<FormData>({ practice: '', website: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addMessage = useCallback((message: Omit<Message, 'id'>): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      const delay = 400 + Math.random() * 400;
      
      setTimeout(() => {
        setIsTyping(false);
        const id = `msg-${Date.now()}-${Math.random()}`;
        setMessages(prev => [...prev, { ...message, id }]);
        setTimeout(resolve, 100);
      }, delay);
    });
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const id = `msg-${Date.now()}-${Math.random()}`;
    setMessages(prev => [...prev, { id, type: 'user', content }]);
  }, []);

  // State machine progression
  useEffect(() => {
    if (hasInitialized.current && state === 'initial') return;
    
    const progressConversation = async () => {
      switch (state) {
        case 'initial':
          hasInitialized.current = true;
          await addMessage({ type: 'greeting', content: "Hi — I'll walk you through this quickly." });
          setState('ask_dental');
          break;

        case 'ask_dental':
          await addMessage({ type: 'question', content: "Do you work in the dental industry?" });
          break;

        case 'not_dental_end':
          await addMessage({ type: 'explanation', content: "This service is built specifically for dental practices. Thanks for stopping by!" });
          break;

        case 'show_proof':
          await addMessage({ 
            type: 'proof', 
            content: "50,000+ patient questions answered with AI" 
          });
          setState('show_explanation');
          break;

        case 'show_explanation':
          await addMessage({ 
            type: 'explanation', 
            content: "We install a custom assistant on your website that answers patient questions 24/7 — using safe, non-diagnostic language." 
          });
          setState('show_process');
          break;

        case 'show_process':
          await addMessage({ 
            type: 'process', 
            content: (
              <ProcessCard 
                steps={[
                  { number: 1, text: "Tell us about your practice" },
                  { number: 2, text: "We build your custom assistant" },
                  { number: 3, text: "Add one line of code to your site" },
                ]}
                footer="Live within 24 hours"
              />
            )
          });
          setState('show_safe_language');
          break;

        case 'show_safe_language':
          await addMessage({ 
            type: 'explanation', 
            content: "It never diagnoses or recommends treatment — just answers questions and directs patients to call." 
          });
          setState('ask_setup');
          break;

        case 'ask_setup':
          await addMessage({ type: 'question', content: "Want us to set this up for you?" });
          break;

        case 'show_email_info':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <>
                Email us at{' '}
                <a href="mailto:hello@dgtldental.com" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  hello@dgtldental.com
                </a>
                {' '}— we'll get back to you quickly.
              </>
            )
          });
          break;

        case 'ask_practice_name':
          await addMessage({ type: 'question', content: "Great — just a few quick questions. What's the name of your practice?" });
          break;

        case 'ask_website':
          await addMessage({ type: 'question', content: "And your website URL?" });
          break;

        case 'ask_email':
          await addMessage({ type: 'question', content: "Last one — best email to reach you?" });
          break;

        case 'complete':
          await addMessage({ 
            type: 'success', 
            content: "Perfect — we'll review your site and follow up within 24 hours." 
          });
          break;
      }
    };

    progressConversation();
  }, [state, addMessage]);

  // Handlers
  const handleDentalYes = (response: string) => {
    addUserMessage(response);
    setState('show_proof');
  };

  const handleDentalNo = () => {
    addUserMessage("No");
    setState('not_dental_end');
  };

  const handleSetupYes = () => {
    addUserMessage("Yes, let's do it");
    setState('ask_practice_name');
  };

  const handleQuestion = () => {
    addUserMessage("I have a question");
    setState('show_email_info');
  };

  const handleBackToSetup = () => {
    addUserMessage("Actually, let's set it up");
    setState('ask_practice_name');
  };

  const handlePracticeSubmit = (value: string) => {
    setFormData(prev => ({ ...prev, practice: value }));
    addUserMessage(value);
    setState('ask_website');
  };

  const handleWebsiteSubmit = (value: string) => {
    setFormData(prev => ({ ...prev, website: value }));
    addUserMessage(value);
    setState('ask_email');
  };

  const handleEmailSubmit = async (value: string) => {
    const finalData = { ...formData, email: value };
    addUserMessage(value);
    setState('submitting');
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('setup_requests' as any)
        .insert({
          practice_name: finalData.practice,
          website_url: finalData.website,
          contact_name: finalData.practice,
          email: finalData.email
        });

      if (error) throw error;
      setState('complete');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
      setState('ask_email');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine what interactive element to show
  const renderInteraction = () => {
    if (isTyping) return null;

    switch (state) {
      case 'ask_dental':
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes, I'm a dentist", onClick: () => handleDentalYes("Yes, I'm a dentist") },
              { label: "I work in dental", onClick: () => handleDentalYes("I work in dental") },
              { label: "No", onClick: handleDentalNo },
            ]}
          />
        );

      case 'ask_setup':
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes, let's do it", onClick: handleSetupYes },
              { label: "I have a question", onClick: handleQuestion },
            ]}
          />
        );

      case 'show_email_info':
        return (
          <QuickReplyButtons
            options={[
              { label: "Actually, let's set it up", onClick: handleBackToSetup },
            ]}
          />
        );

      case 'ask_practice_name':
        return <ChatInput placeholder="Enter your practice name..." onSubmit={handlePracticeSubmit} />;

      case 'ask_website':
        return <ChatInput placeholder="Enter your website URL..." onSubmit={handleWebsiteSubmit} type="url" />;

      case 'ask_email':
        return <ChatInput placeholder="Enter your email..." onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} type="email" />;

      default:
        return null;
    }
  };

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case 'greeting':
        return <GreetingMessage key={message.id}>{message.content}</GreetingMessage>;
      case 'question':
        return <QuestionMessage key={message.id}>{message.content}</QuestionMessage>;
      case 'proof':
        return <ProofMessage key={message.id}>{message.content}</ProofMessage>;
      case 'explanation':
        return <ExplanationMessage key={message.id}>{message.content}</ExplanationMessage>;
      case 'process':
        return <div key={message.id} className="animate-fade-in">{message.content}</div>;
      case 'user':
        return <UserMessage key={message.id}>{message.content}</UserMessage>;
      case 'success':
        return <SuccessMessage key={message.id}>{message.content}</SuccessMessage>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 md:pt-12 pb-4">
        <div className="max-w-[700px] mx-auto px-6">
          <a 
            href="/" 
            className="inline-block transition-transform hover:scale-105 active:scale-100"
            title="Go to homepage"
          >
            <img 
              src="/images/dgtl-logo.png" 
              alt="DGTL Dental" 
              className="h-14 md:h-20 w-auto"
            />
          </a>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 relative z-10">
        <div className="max-w-[700px] mx-auto px-6 py-8">
          <div className="space-y-6">
            {messages.map(renderMessage)}
            
            {isTyping && <TypingIndicator />}
            
            {/* Interactive elements */}
            <div className="pt-2">
              {renderInteraction()}
            </div>
          </div>
          
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            $99/mo · No setup fee · Cancel anytime
          </p>
          <p className="text-xs text-gray-300 mt-2">
            <a href="mailto:hello@dgtldental.com" className="hover:text-gray-500 transition-colors">
              hello@dgtldental.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuidedChat;
