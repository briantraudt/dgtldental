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

type ConversationState = 
  | 'initial'
  | 'ask_dental'
  | 'not_dental_end'
  | 'show_demo_intro'
  | 'show_demo'
  | 'show_value'
  | 'show_process'
  | 'show_price'
  | 'ask_setup'
  | 'show_contact'
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
  const [showDemo, setShowDemo] = useState(false);
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
                text="Hi, thanks for stopping by! We create AI-powered chatbots for dental practices to help you save time and money while providing a better patient experience."
                onComplete={() => setState('ask_dental')}
              />
            )
          });
          break;

        case 'ask_dental':
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Are you a dentist or do you work in a dental office?"
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
          setShowDemo(true);
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
          setState('show_price');
          break;

        case 'show_price':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="$99/month. No setup fee. Cancel anytime."
                onComplete={() => setState('ask_setup')}
              />
            )
          });
          break;

        case 'ask_setup':
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Want us to set this up for you?"
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

        case 'ask_practice_name':
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's the name of your practice?"
              />
            )
          });
          break;

        case 'ask_website':
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's your website URL?"
              />
            )
          });
          break;

        case 'ask_email':
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's the best email to reach you?"
              />
            )
          });
          break;

        case 'complete':
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text="Thanks! We'll review your site and follow up within 24 hours."
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
    setState('ask_practice_name');
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
        return <ChatInput placeholder="Practice name..." onSubmit={handlePracticeSubmit} />;

      case 'ask_website':
        return <ChatInput placeholder="Website URL..." onSubmit={handleWebsiteSubmit} type="url" />;

      case 'ask_email':
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        {/* Mobile: centered icon with hamburger */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          <div className="w-10" /> {/* Spacer for balance */}
          <button 
            onClick={() => window.location.reload()} 
            className="hover:opacity-80 transition-opacity"
          >
            <img src={toothIcon} alt="DGTL" className="h-8 w-8 object-contain" />
          </button>
          <MobileMenu />
        </div>
        {/* Desktop: logo left, AI Assistant right */}
        <div className="hidden md:flex max-w-[1024px] mx-auto items-center justify-between px-8 py-4">
          <button 
            onClick={() => window.location.reload()} 
            className="hover:opacity-80 transition-opacity"
          >
            <img src={dgtlLogo} alt="DGTL" className="h-8 object-contain" />
          </button>
          <span className="text-sm text-muted-foreground">AI Assistant</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6 flex flex-col justify-end">
        <div className="max-w-[600px] mx-auto w-full">
          <div className="space-y-5">
            {messages.map(renderMessage)}
            
            {isTyping && <TypingIndicator />}
            
            {/* Demo chat - persists after completion */}
            {showDemo && (
              <div className="pt-1">
                <DemoChat onComplete={handleDemoComplete} isCompleted={demoCompleted} />
              </div>
            )}
            
            {/* Interactive elements */}
            <div className="pt-1">
              {renderInteraction()}
            </div>
          </div>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

    </div>
  );
};

export default GuidedChat;
