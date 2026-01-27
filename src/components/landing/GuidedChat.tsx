import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { playMessageFeedback } from './chat/audioFeedback';
import toothIcon from '@/assets/tooth-icon.png';
import dgtlLogo from '@/assets/dgtl-logo.png';
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
import TypewriterText from './chat/TypewriterText';
import ChatInput from './chat/ChatInput';
import DemoChat from './chat/DemoChat';
import MobileMenu from './MobileMenu';
import DesktopNav from './DesktopNav';

type ConversationState = 
  | 'initial'
  | 'ask_dental'
  | 'not_dental_end'
  | 'show_demo_intro'
  | 'show_demo'
  | 'show_value'
  | 'show_process'
  | 'show_install'
  | 'show_price'
  | 'ask_setup'
  | 'show_contact'
  | 'show_excited'
  | 'ask_practice_name'
  | 'ask_website'
  | 'ask_email'
  | 'submitting'
  | 'complete';

interface Message {
  id: string;
  type: 'greeting' | 'question' | 'proof' | 'explanation' | 'process' | 'user' | 'success' | 'demo';
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
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({ practice: '', website: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const processedStates = useRef<Set<ConversationState>>(new Set());

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
      const delay = 500 + Math.random() * 300;
      
      setTimeout(() => {
        setIsTyping(false);
        const id = `msg-${Date.now()}-${Math.random()}`;
        setMessages(prev => [...prev, { ...message, id }]);
        playMessageFeedback(); // Subtle sound + haptic
        setTimeout(resolve, 150);
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
    // Prevent duplicate processing of the same state
    if (processedStates.current.has(state)) return;
    processedStates.current.add(state);
    
    const progressConversation = async () => {
      switch (state) {
        case 'initial':
          hasInitialized.current = true;
          await addMessage({ 
            type: 'greeting', 
            content: (
              <TypewriterText 
                text="Hi, thanks for stopping by!\nWe create AI-powered Virtual Front Desks for dental practices to help you save time and money while providing a better patient experience."
                onComplete={() => setState('ask_dental')}
              />
            )
          });
          break;

        case 'ask_dental':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Are you a dentist or do you work in a dental office?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'not_dental_end':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Thanks for stopping by! This service is designed specifically for dental practices. Feel free to share with anyone you know in the dental field."
              />
            )
          });
          break;

        case 'show_demo_intro':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Let me show you how it works. Here's a quick demo of what your patients would experience:"
                onComplete={() => setState('show_demo')}
              />
            )
          });
          break;

        case 'show_demo':
          await addMessage({
            type: 'demo',
            content: <DemoChat onComplete={handleDemoComplete} isCompleted={demoCompleted} />
          });
          break;

        case 'show_value':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Pretty cool, right? That's what your patients get — instant, helpful answers 24/7 while your front desk focuses on patients in the office."
                onComplete={() => setState('show_process')}
              />
            )
          });
          break;

        case 'show_process':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="It can answer any dental question, connect to your scheduling system for online booking, provide directions to your office, answer insurance questions — really anything you want to tell patients."
                onComplete={() => setState('show_install')}
              />
            )
          });
          break;

        case 'show_install':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Installation takes minutes. We give you a tiny snippet of code your web person can add, or we can do it for you."
                onComplete={() => setState('show_price')}
              />
            )
          });
          break;

        case 'show_price':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Our pricing is really simple. It costs $99/month. No setup fee and it's completely customized for your office. Cancel anytime."
                onComplete={() => setState('ask_setup')}
              />
            )
          });
          break;

        case 'ask_setup':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Would you like something like this for your office?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'show_contact':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <>
                <TypewriterText 
                  text="No problem! Reach out anytime at "
                />
                <a href="mailto:hello@dgtldental.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                  hello@dgtldental.com
                </a>
              </>
            )
          });
          break;

        case 'show_excited':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Super — we're excited to work with you! Let's get your contact info so someone from our team can reach out right away."
                onComplete={() => setState('ask_practice_name')}
              />
            )
          });
          break;

        case 'ask_practice_name':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's the name of your practice?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'ask_website':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's your website URL?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'ask_email':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's the best email to reach you?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'complete':
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text="Thanks so much! Someone from our team will contact you right away. Have a great day!"
              />
            )
          });
          break;
      }
    };

    progressConversation();
  }, [state, addMessage]);

  // Handlers
  const handleDentalYes = () => {
    addUserMessage("Yes");
    setState('show_demo_intro');
  };

  const handleDemoComplete = () => {
    setDemoCompleted(true);
    setState('show_value');
  };

  const handleDentalNo = () => {
    addUserMessage("No");
    setState('not_dental_end');
  };

  const handleSetupYes = () => {
    addUserMessage("Yes, let's do it");
    setState('show_excited');
  };

  const handleSetupNo = () => {
    addUserMessage("Not right now");
    setState('show_contact');
  };

  const handleBackToSetup = () => {
    addUserMessage("Actually, let's set it up");
    setState('ask_practice_name');
  };

  const handleOopsImADentist = () => {
    addUserMessage("Oops, I am a dentist!");
    setState('show_demo_intro');
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
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes", onClick: handleDentalYes, primary: true },
              { label: "No", onClick: handleDentalNo },
            ]}
          />
        );

      case 'show_demo':
        return null; // Demo is rendered separately to persist

      case 'not_dental_end':
        return (
          <div className="flex justify-center pt-4 animate-fade-in">
            <button
              onClick={handleOopsImADentist}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              Oops, I am a dentist
            </button>
          </div>
        );

      case 'ask_setup':
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes, let's do it", onClick: handleSetupYes, primary: true },
              { label: "Not right now", onClick: handleSetupNo },
            ]}
          />
        );

      case 'show_contact':
        return (
          <QuickReplyButtons
            options={[
              { label: "Actually, let's set it up", onClick: handleBackToSetup, primary: true },
            ]}
          />
        );

      case 'ask_practice_name':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Practice name..." onSubmit={handlePracticeSubmit} />;

      case 'ask_website':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Website URL..." onSubmit={handleWebsiteSubmit} type="url" />;

      case 'ask_email':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Email address..." onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} type="email" />;

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
      case 'demo':
        return <div key={message.id} className="animate-fade-in">{message.content}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Header - sticky with safe area already applied to parent */}
      <header className="bg-background/95 backdrop-blur-md flex-shrink-0 sticky top-0 z-50">
        {/* Mobile: centered icon with hamburger */}
        <div className="md:hidden flex items-center justify-between px-5 py-3 min-h-[56px]">
          <div className="w-10 flex-shrink-0" /> {/* Spacer for balance */}
          <button 
            onClick={() => window.location.reload()} 
            className="hover:opacity-80 transition-opacity active:scale-95 flex-shrink-0"
          >
            <img src={toothIcon} alt="DGTL" className="h-8 w-8 object-contain" />
          </button>
          <div className="w-10 flex-shrink-0 flex justify-end">
            <MobileMenu />
          </div>
        </div>
        {/* Desktop: logo left, nav right - aligned with chat width */}
        <div className="hidden md:flex max-w-[700px] mx-auto items-center justify-between px-8 py-4">
          <button 
            onClick={() => window.location.reload()} 
            className="hover:opacity-80 transition-opacity"
          >
            <img src={dgtlLogo} alt="DGTL" className="h-8 object-contain" />
          </button>
          <DesktopNav />
        </div>
      </header>

      {/* Chat Area - scrollable content */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-8 py-6 flex flex-col justify-center relative">
        <div className="max-w-[600px] mx-auto w-full">
          <div className="space-y-5">
            {messages.map(renderMessage)}
            
            {isTyping && <TypingIndicator />}
            
            {/* Interactive elements */}
            <div className="pt-1">
              {renderInteraction()}
            </div>
          </div>
          
          <div ref={messagesEndRef} className="h-8" />
        </div>
        
        {/* Bottom fade gradient to indicate scrollable content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </main>

    </div>
  );
};

export default GuidedChat;
