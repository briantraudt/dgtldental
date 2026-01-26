import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { playMessageFeedback } from './chat/audioFeedback';
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
    
    const progressConversation = async () => {
      switch (state) {
        case 'initial':
          hasInitialized.current = true;
          await addMessage({ 
            type: 'greeting', 
            content: (
              <TypewriterText 
                text="Hi, thanks for stopping by! We create AI-powered chatbots for dental practices to help you save time and money while providing a better patient experience."
              />
            )
          });
          setState('ask_dental');
          break;

        case 'ask_dental':
          await addMessage({ 
            type: 'question', 
            content: "Are you a dentist or do you work in a dental office?" 
          });
          break;

        case 'not_dental_end':
          await addMessage({ 
            type: 'explanation', 
            content: "Thanks for stopping by! This service is designed specifically for dental practices. Feel free to share with anyone you know in the dental field." 
          });
          break;

        case 'show_demo_intro':
          await addMessage({ 
            type: 'explanation', 
            content: "Let me show you how it works. Here's a quick demo of what your patients would experience:" 
          });
          setState('show_demo');
          break;

        case 'show_demo':
          // Demo component handles itself
          break;

        case 'show_value':
          await addMessage({ 
            type: 'explanation', 
            content: "Pretty cool, right? That's what your patients get — instant, helpful answers 24/7 while your front desk focuses on patients in the office." 
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
          setState('show_price');
          break;

        case 'show_price':
          await addMessage({ 
            type: 'explanation', 
            content: "$99/month. No setup fee. Cancel anytime." 
          });
          setState('ask_setup');
          break;

        case 'ask_setup':
          await addMessage({ 
            type: 'question', 
            content: "Want us to set this up for you?" 
          });
          break;

        case 'show_contact':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <>
                No problem! Reach out anytime at{' '}
                <a href="mailto:hello@dgtldental.com" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  hello@dgtldental.com
                </a>
              </>
            )
          });
          break;

        case 'ask_practice_name':
          await addMessage({ 
            type: 'question', 
            content: "What's the name of your practice?" 
          });
          break;

        case 'ask_website':
          await addMessage({ 
            type: 'question', 
            content: "What's your website URL?" 
          });
          break;

        case 'ask_email':
          await addMessage({ 
            type: 'question', 
            content: "What's the best email to reach you?" 
          });
          break;

        case 'complete':
          await addMessage({ 
            type: 'success', 
            content: "Thanks! We'll review your site and follow up within 24 hours." 
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
        return <DemoChat onComplete={handleDemoComplete} />;

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">DGTL Dental</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span>~2 min</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
        <div className="max-w-[600px] mx-auto">
          <div className="space-y-5">
            {messages.map(renderMessage)}
            
            {isTyping && <TypingIndicator />}
            
            {/* Interactive elements */}
            <div className="pt-1">
              {renderInteraction()}
            </div>
          </div>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 md:px-8 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[600px] mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>$99/mo · No setup fee · Cancel anytime</span>
          <a 
            href="mailto:hello@dgtldental.com" 
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            hello@dgtldental.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default GuidedChat;
