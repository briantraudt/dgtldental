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
  | 'show_intro'
  | 'ask_dental'
  | 'not_dental_end'
  | 'show_authority'
  | 'show_value'
  | 'show_benefit'
  | 'show_ease_1'
  | 'show_ease_2'
  | 'show_process'
  | 'show_safety'
  | 'show_price'
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
          await addMessage({ type: 'greeting', content: "Hi — quick heads up before we start." });
          setState('show_intro');
          break;

        case 'show_intro':
          await addMessage({ 
            type: 'explanation', 
            content: "This is a short walkthrough of a service we install for dental practices. No sales call. No setup on your end." 
          });
          setState('ask_dental');
          break;

        case 'ask_dental':
          await addMessage({ type: 'question', content: "Are you involved in a dental practice?" });
          break;

        case 'not_dental_end':
          await addMessage({ 
            type: 'explanation', 
            content: "Got it. This service is built specifically for dental practices. Thanks for taking a look." 
          });
          break;

        case 'show_authority':
          await addMessage({ 
            type: 'proof', 
            content: "We've helped dental practices answer 50,000+ real patient questions using AI." 
          });
          setState('show_value');
          break;

        case 'show_value':
          await addMessage({ 
            type: 'explanation', 
            content: "We install a custom assistant on your website that answers common patient questions — 24/7 — using safe, non-diagnostic language." 
          });
          setState('show_benefit');
          break;

        case 'show_benefit':
          await addMessage({ 
            type: 'explanation', 
            content: "That means fewer interruptions for your front desk and fewer missed inquiries after hours." 
          });
          setState('show_ease_1');
          break;

        case 'show_ease_1':
          await addMessage({ 
            type: 'explanation', 
            content: "There's nothing for you or your team to learn." 
          });
          setState('show_ease_2');
          break;

        case 'show_ease_2':
          await addMessage({ 
            type: 'explanation', 
            content: "We build it. Your site adds one line of code. That's it." 
          });
          setState('show_process');
          break;

        case 'show_process':
          await addMessage({ 
            type: 'process', 
            content: (
              <ProcessCard 
                steps={[
                  { number: 1, text: "You tell us about your practice" },
                  { number: 2, text: "We build your assistant" },
                  { number: 3, text: "Your site adds one line of code" },
                ]}
                footer="Live within 24 hours"
              />
            )
          });
          setState('show_safety');
          break;

        case 'show_safety':
          await addMessage({ 
            type: 'explanation', 
            content: "It never diagnoses, never recommends treatment, and always directs patients to contact your office." 
          });
          setState('show_price');
          break;

        case 'show_price':
          await addMessage({ 
            type: 'explanation', 
            content: "It's $99 per month. No setup fee. Cancel anytime." 
          });
          setState('ask_setup');
          break;

        case 'ask_setup':
          await addMessage({ type: 'question', content: "Want us to set this up for your website?" });
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
          await addMessage({ type: 'question', content: "Great — what's the name of your practice?" });
          break;

        case 'ask_website':
          await addMessage({ type: 'question', content: "What's your website?" });
          break;

        case 'ask_email':
          await addMessage({ type: 'question', content: "Best email to reach you?" });
          break;

        case 'complete':
          await addMessage({ 
            type: 'success', 
            content: "Thanks. We'll review your site and follow up shortly." 
          });
          break;
      }
    };

    progressConversation();
  }, [state, addMessage]);

  // Handlers
  const handleDentalYes = (response: string) => {
    addUserMessage(response);
    setState('show_authority');
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
              { label: "Yes — dentist / owner", onClick: () => handleDentalYes("Yes — dentist / owner"), primary: true },
              { label: "Yes — I work in dental", onClick: () => handleDentalYes("Yes — I work in dental") },
              { label: "No", onClick: handleDentalNo },
            ]}
          />
        );

      case 'ask_setup':
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes — set it up", onClick: handleSetupYes, primary: true },
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
          <div className="space-y-5">
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

    </div>
  );
};

export default GuidedChat;
