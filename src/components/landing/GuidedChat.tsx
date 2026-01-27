import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { playMessageFeedback, triggerHaptic } from './chat/audioFeedback';
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
  | 'returning_visitor_demo'
  | 'returning_visitor_declined'
  | 'returning_submitted_visitor'
  | 'returning_submitted_no_contact'
  | 'returning_submitted_confirm_contact'
  | 'returning_submitted_yes_contacted'
  | 'returning_ask_more_questions'
  | 'returning_show_question_form'
  | 'returning_question_submitted'
  | 'returning_no_more_questions'
  | 'returning_ask_new_contact'
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
  | 'ask_name'
  | 'ask_practice_name'
  | 'ask_contact_preference'
  | 'ask_phone'
  | 'ask_email'
  | 'submitting'
  | 'complete';

interface Message {
  id: string;
  type: 'greeting' | 'question' | 'proof' | 'explanation' | 'process' | 'user' | 'success' | 'demo';
  content: React.ReactNode;
}

interface FormData {
  name: string;
  practice: string;
  contactPreference: 'phone' | 'email' | '';
  phone: string;
  email: string;
}

const VISITED_KEY = 'dgtl_has_visited';
const VISITOR_NAME_KEY = 'dgtl_visitor_name';
const SUBMITTED_CONTACT_KEY = 'dgtl_has_submitted_contact';
const VISITOR_CONTACT_PREF_KEY = 'dgtl_visitor_contact_pref';
const VISITOR_CONTACT_VALUE_KEY = 'dgtl_visitor_contact_value';

const GuidedChat = () => {
  // Check if returning visitor and get their stored data
  const isReturningVisitor = typeof window !== 'undefined' && localStorage.getItem(VISITED_KEY) === 'true';
  const hasSubmittedContact = typeof window !== 'undefined' && localStorage.getItem(SUBMITTED_CONTACT_KEY) === 'true';
  const storedVisitorName = typeof window !== 'undefined' ? localStorage.getItem(VISITOR_NAME_KEY) : null;
  const storedContactPref = typeof window !== 'undefined' ? localStorage.getItem(VISITOR_CONTACT_PREF_KEY) : null;
  const storedContactValue = typeof window !== 'undefined' ? localStorage.getItem(VISITOR_CONTACT_VALUE_KEY) : null;
  
  // Determine initial state based on visitor history
  // If we have their name stored, they've given us contact info - treat as submitted
  const getInitialState = (): ConversationState => {
    if (hasSubmittedContact || storedVisitorName) return 'returning_submitted_visitor';
    if (isReturningVisitor) return 'returning_visitor_demo';
    return 'initial';
  };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>(getInitialState());
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', practice: '', contactPreference: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [returningDemoCompleted, setReturningDemoCompleted] = useState(false);
  const [declinedDemoCompleted, setDeclinedDemoCompleted] = useState(false);
  const [showHeader, setShowHeader] = useState(isReturningVisitor || hasSubmittedContact);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const processedStates = useRef<Set<ConversationState>>(new Set());
  
  // Mark visitor on first visit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VISITED_KEY, 'true');
    }
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    });
  }, []);

  // Scroll when messages change, typing state changes, or interaction state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isTypingComplete, state, scrollToBottom]);

  // Keep the latest typed character visible during TypewriterText streaming
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUpdate = () => scrollToBottom('auto');
    window.addEventListener('dgtl:typewriter:update', handleUpdate);
    return () => window.removeEventListener('dgtl:typewriter:update', handleUpdate);
  }, [scrollToBottom]);

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
    if (hasInitialized.current && state === 'returning_visitor_demo') return;
    if (hasInitialized.current && state === 'returning_submitted_visitor') return;
    // Prevent duplicate processing of the same state
    if (processedStates.current.has(state)) return;
    processedStates.current.add(state);
    
    const progressConversation = async () => {
      switch (state) {
        case 'returning_visitor_demo':
          hasInitialized.current = true;
          const personalGreeting = storedVisitorName 
            ? `Good to see you again, ${storedVisitorName}! Ready to get a Virtual Front Desk for your practice?`
            : `Good to see you again! Ready to get a Virtual Front Desk for your practice?`;
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text={personalGreeting}
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'returning_visitor_declined':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="No problem at all! If you change your mind, you're always welcome to take our platform for a test drive below, or reach out at hello@dgtldental.com"
                onComplete={() => setIsTypingComplete(true)}
                renderText={(displayedText, isComplete) => {
                  if (isComplete && displayedText.includes('hello@dgtldental.com')) {
                    const parts = displayedText.split('hello@dgtldental.com');
                    return (
                      <>
                        {parts[0]}
                        <a href="mailto:hello@dgtldental.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                          hello@dgtldental.com
                        </a>
                        {parts[1]}
                      </>
                    );
                  }
                  return displayedText;
                }}
              />
            )
          });
          break;

        case 'returning_submitted_visitor':
          hasInitialized.current = true;
          const submittedGreeting = storedVisitorName 
            ? `Hi ${storedVisitorName} — great to see you again! Has anyone from our team reached out to you yet?`
            : `Hi — great to see you again! Has anyone from our team reached out to you yet?`;
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text={submittedGreeting}
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'returning_submitted_no_contact':
          setIsTypingComplete(false);
          const confirmMsg = storedContactValue 
            ? `We'll get back to you right away! We have ${storedContactValue} on file — is that still the best way to reach you, or is there a better contact?`
            : `We'll get back to you right away! What's the best way to reach you?`;
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text={confirmMsg}
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'returning_submitted_confirm_contact':
          const thankFirstName = storedVisitorName || '';
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text={thankFirstName ? `Perfect, thanks ${thankFirstName}! We'll be in touch very soon. 😊` : `Perfect, thanks! We'll be in touch very soon. 😊`}
              />
            )
          });
          break;

        case 'returning_submitted_yes_contacted':
          setIsTypingComplete(false);
          const contactedName = storedVisitorName || '';
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Ok, good deal. Do you have any other questions right now?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'returning_no_more_questions':
          const noQuestionsName = storedVisitorName || '';
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text={noQuestionsName ? `Great, ${noQuestionsName}! Thanks again for your interest — we're excited to work with you. 😊` : `Great! Thanks again for your interest — we're excited to work with you. 😊`}
              />
            )
          });
          break;

        case 'returning_show_question_form':
          // No message needed - the input placeholder is sufficient
          setIsTypingComplete(true);
          break;

        case 'returning_question_submitted':
          const questionName = storedVisitorName || '';
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text={questionName ? `Thanks ${questionName}! Someone from our team will get back to you soon. Have a great day! 😊` : `Thanks! Someone from our team will get back to you soon. Have a great day! 😊`}
              />
            )
          });
          break;

        case 'returning_ask_new_contact':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="No problem! What's the best email or phone to reach you?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

          hasInitialized.current = true;
          await addMessage({ 
            type: 'greeting', 
            content: (
              <TypewriterText 
                text={`Hi, thanks for stopping by!
We create AI-powered Virtual Front Desks for dental practices to help you save time and money while providing a better patient experience.`}
                onComplete={() => setTimeout(() => setState('ask_dental'), 2000)}
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
                onComplete={() => {
                  setIsTypingComplete(true);
                  setShowHeader(true);
                }}
              />
            )
          });
          break;

        case 'not_dental_end':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="No worries! This service is designed specifically for dental practices. Feel free to share with anyone you know in the dental field."
              />
            )
          });
          break;

        case 'show_demo_intro':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text={`Great — we're excited to show you this!
Here's a quick demo of what your patients would experience.
In the box below, ask any dental or office-related question.`}
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
                text={`Pretty cool, right? That's what your patients get — instant, helpful answers 24/7 while your front desk focuses on patients in the office.
It can answer any dental question, connect to your scheduling system for online booking, provide directions to your office, answer insurance questions — really anything you want to tell patients.`}
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
                text={`Standard installation takes minutes. We give you a tiny snippet of code your web person can add, or we can do it for you.
Our pricing is really simple. It costs $99/month for our basic service with no setup fee. Cancel anytime.`}
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
              <TypewriterText 
                text="No problem! Reach out anytime at hello@dgtldental.com"
                renderText={(displayedText, isComplete) => {
                  if (isComplete && displayedText.includes('hello@dgtldental.com')) {
                    const parts = displayedText.split('hello@dgtldental.com');
                    return (
                      <>
                        {parts[0]}
                        <a href="mailto:hello@dgtldental.com" className="text-primary hover:text-primary/80 underline underline-offset-2">
                          hello@dgtldental.com
                        </a>
                        {parts[1]}
                      </>
                    );
                  }
                  return displayedText;
                }}
              />
            )
          });
          break;

        case 'show_excited':
          await addMessage({ 
            type: 'explanation', 
            content: (
              <TypewriterText 
                text="Super — we're excited to work with you! Let's get your contact info so someone from our team can reach out right away."
                onComplete={() => setState('ask_name')}
              />
            )
          });
          break;

        case 'ask_name':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What is your name?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'ask_practice_name':
          setIsTypingComplete(false);
          const firstName = formData.name.split(' ')[0];
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text={`It's nice to meet you, ${firstName}! What's the name of your practice?`}
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'ask_contact_preference':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="Do you prefer we reach out by phone or email?"
                onComplete={() => setIsTypingComplete(true)}
              />
            )
          });
          break;

        case 'ask_phone':
          setIsTypingComplete(false);
          await addMessage({ 
            type: 'question', 
            content: (
              <TypewriterText 
                text="What's the best phone number to reach you?"
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
          const successFirstName = formData.name.split(' ')[0];
          await addMessage({ 
            type: 'success', 
            content: (
              <TypewriterText 
                text={`Thanks so much, ${successFirstName}! Someone from our team will contact you right away.
Have a great day! 😊`}
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
    triggerHaptic('light');
    addUserMessage("Yes");
    setState('show_demo_intro');
  };

  const handleDemoComplete = () => {
    setDemoCompleted(true);
    setState('show_value');
  };

  const handleReturningDemoComplete = () => {
    // Returning visitors who try the demo should follow the standard workflow
    setReturningDemoCompleted(true);
    processedStates.current.clear();
    setState('show_value');
  };

  const handleDeclinedDemoComplete = () => {
    // Declined visitors who try the demo should follow the standard workflow
    setDeclinedDemoCompleted(true);
    processedStates.current.clear();
    setState('show_value');
  };

  const handleReturningYes = () => {
    triggerHaptic('medium');
    addUserMessage("Yes, let's do it!");
    processedStates.current.clear();
    setState('show_excited');
  };

  const handleReturningNo = () => {
    triggerHaptic('light');
    addUserMessage("Not right now");
    setState('returning_visitor_declined');
  };

  // Handlers for submitted visitors
  const handleSubmittedYesContacted = () => {
    triggerHaptic('light');
    addUserMessage("Yes");
    setState('returning_submitted_yes_contacted');
  };

  const handleSubmittedNoContact = () => {
    triggerHaptic('light');
    addUserMessage("No");
    setState('returning_submitted_no_contact');
  };

  // Handlers for questions after being contacted
  const handleHasMoreQuestions = () => {
    triggerHaptic('light');
    addUserMessage("Yes, I have a question");
    setState('returning_show_question_form');
  };

  const handleNoMoreQuestions = () => {
    triggerHaptic('light');
    addUserMessage("No, I'm all set");
    setState('returning_no_more_questions');
  };

  const handleQuestionSubmit = (question: string) => {
    triggerHaptic('medium');
    addUserMessage(question);
    // Here you could also save the question to the database if needed
    setState('returning_question_submitted');
  };

  const handleConfirmContactYes = () => {
    triggerHaptic('medium');
    addUserMessage("Yes, that's correct");
    setState('returning_submitted_confirm_contact');
  };

  const handleConfirmContactUpdate = () => {
    triggerHaptic('light');
    addUserMessage("I have a better contact");
    setState('returning_ask_new_contact');
  };

  const handleContinueToWorkflow = () => {
    triggerHaptic('medium');
    addUserMessage("Yes, tell me more");
    processedStates.current.delete('show_value');
    setState('show_value');
  };

  const handleDentalNo = () => {
    triggerHaptic('light');
    addUserMessage("No");
    setState('not_dental_end');
  };

  const handleSetupYes = () => {
    triggerHaptic('medium');
    addUserMessage("Yes, let's do it");
    setState('show_excited');
  };

  const handleSetupNo = () => {
    triggerHaptic('light');
    addUserMessage("Not right now");
    setState('show_contact');
  };

  const handleBackToSetup = () => {
    triggerHaptic('medium');
    addUserMessage("Actually, let's set it up");
    setState('ask_name');
  };

  const handleOopsImADentist = () => {
    triggerHaptic('light');
    addUserMessage("Oops, I am a dentist!");
    setState('show_demo_intro');
  };

  const handleNameSubmit = (value: string) => {
    triggerHaptic('medium');
    setFormData(prev => ({ ...prev, name: value }));
    addUserMessage(value);
    // Store name for personalized returning visitor experience
    if (typeof window !== 'undefined') {
      localStorage.setItem(VISITOR_NAME_KEY, value.split(' ')[0]);
    }
    setState('ask_practice_name');
  };

  const handlePracticeSubmit = (value: string) => {
    triggerHaptic('medium');
    setFormData(prev => ({ ...prev, practice: value }));
    addUserMessage(value);
    setState('ask_contact_preference');
  };

  const handleContactPreferencePhone = () => {
    triggerHaptic('light');
    setFormData(prev => ({ ...prev, contactPreference: 'phone' }));
    addUserMessage("Phone");
    setState('ask_phone');
  };

  const handleContactPreferenceEmail = () => {
    triggerHaptic('light');
    setFormData(prev => ({ ...prev, contactPreference: 'email' }));
    addUserMessage("Email");
    setState('ask_email');
  };

  const handlePhoneSubmit = async (value: string) => {
    triggerHaptic('medium');
    const finalData = { ...formData, phone: value };
    addUserMessage(value);
    setState('submitting');
    setIsSubmitting(true);

    try {
      // Save to database with all fields
      const { error } = await supabase
        .from('setup_requests' as any)
        .insert({
          practice_name: finalData.practice,
          contact_name: finalData.name,
          email: '',
          phone: value,
          contact_preference: 'phone'
        });

      if (error) throw error;

      // Store contact info for returning visitor experience
      if (typeof window !== 'undefined') {
        localStorage.setItem(SUBMITTED_CONTACT_KEY, 'true');
        localStorage.setItem(VISITOR_CONTACT_PREF_KEY, 'phone');
        localStorage.setItem(VISITOR_CONTACT_VALUE_KEY, value);
      }

      setState('complete');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
      setState('ask_phone');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (value: string) => {
    triggerHaptic('medium');
    const finalData = { ...formData, email: value };
    addUserMessage(value);
    setState('submitting');
    setIsSubmitting(true);

    try {
      // Save to database with all fields
      const { error } = await supabase
        .from('setup_requests' as any)
        .insert({
          practice_name: finalData.practice,
          contact_name: finalData.name,
          email: value,
          phone: '',
          contact_preference: 'email'
        });

      if (error) throw error;

      // Store contact info for returning visitor experience
      if (typeof window !== 'undefined') {
        localStorage.setItem(SUBMITTED_CONTACT_KEY, 'true');
        localStorage.setItem(VISITOR_CONTACT_PREF_KEY, 'email');
        localStorage.setItem(VISITOR_CONTACT_VALUE_KEY, value);
      }

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
      case 'returning_visitor_demo':
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes, let's do it!", onClick: handleReturningYes, primary: true },
              { label: "Not right now", onClick: handleReturningNo },
            ]}
          />
        );

      case 'returning_visitor_declined':
        if (!isTypingComplete) return null;
        return (
          <div className="space-y-4 animate-fade-in">
            <DemoChat 
              onComplete={handleDeclinedDemoComplete} 
              isCompleted={declinedDemoCompleted} 
            />
          </div>
        );

      case 'returning_submitted_visitor':
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes", onClick: handleSubmittedYesContacted },
              { label: "No", onClick: handleSubmittedNoContact },
            ]}
          />
        );

      case 'returning_submitted_yes_contacted':
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Yes, I have a question", onClick: handleHasMoreQuestions },
              { label: "No, I'm all set", onClick: handleNoMoreQuestions },
            ]}
          />
        );

      case 'returning_show_question_form':
        if (!isTypingComplete) return null;
        return (
          <ChatInput 
            placeholder="Type your question..." 
            onSubmit={handleQuestionSubmit} 
          />
        );

      case 'returning_submitted_no_contact':
        if (!isTypingComplete) return null;
        // Show confirmation buttons if we have stored contact info
        if (storedContactValue) {
          return (
            <QuickReplyButtons
              options={[
                { label: "That's still correct", onClick: handleConfirmContactYes, primary: true },
                { label: "I have a better contact", onClick: handleConfirmContactUpdate },
              ]}
            />
          );
        }
        // Otherwise ask for contact via input (phone or email)
        return (
          <ChatInput 
            placeholder="Email or phone number..." 
            onSubmit={(value) => {
              addUserMessage(value);
              if (typeof window !== 'undefined') {
                // Determine if it's email or phone and store appropriately
                const isEmail = value.includes('@');
                localStorage.setItem(VISITOR_CONTACT_VALUE_KEY, value);
                localStorage.setItem(VISITOR_CONTACT_PREF_KEY, isEmail ? 'email' : 'phone');
              }
              setState('returning_submitted_confirm_contact');
            }} 
          />
        );

      case 'returning_ask_new_contact':
        if (!isTypingComplete) return null;
        return (
          <ChatInput 
            placeholder="Email or phone number..." 
            onSubmit={(value) => {
              addUserMessage(value);
              if (typeof window !== 'undefined') {
                const isEmail = value.includes('@');
                localStorage.setItem(VISITOR_CONTACT_VALUE_KEY, value);
                localStorage.setItem(VISITOR_CONTACT_PREF_KEY, isEmail ? 'email' : 'phone');
              }
              setState('returning_submitted_confirm_contact');
            }} 
          />
        );

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

      case 'show_demo_intro':
      case 'show_demo':
      case 'show_value':
      case 'show_process':
      case 'show_install':
      case 'show_price':
        return null; // No interaction during these states

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
              { label: "I've changed my mind — let's set it up", onClick: handleBackToSetup },
            ]}
          />
        );

      case 'ask_name':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Your name..." onSubmit={handleNameSubmit} />;

      case 'ask_practice_name':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Practice name..." onSubmit={handlePracticeSubmit} />;

      case 'ask_contact_preference':
        if (!isTypingComplete) return null;
        return (
          <QuickReplyButtons
            options={[
              { label: "Phone", onClick: handleContactPreferencePhone },
              { label: "Email", onClick: handleContactPreferenceEmail },
            ]}
          />
        );

      case 'ask_phone':
        if (!isTypingComplete) return null;
        return <ChatInput placeholder="Phone number..." onSubmit={handlePhoneSubmit} isSubmitting={isSubmitting} type="tel" />;

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
      {/* Header - sticky with safe area already applied to parent, hidden until showHeader is true */}
      <header className={`bg-background/95 backdrop-blur-md flex-shrink-0 sticky top-0 z-50 transition-opacity duration-[2000ms] ease-out ${showHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
        {/* Desktop: logo left, nav right */}
        <div className="hidden md:flex max-w-[700px] mx-auto items-center justify-between px-8 py-4 w-full">
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
      <main
        className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-8 py-6 relative flex flex-col"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          scrollPaddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 140px)',
        }}
      >
        <div className="max-w-[600px] mx-auto w-full my-auto">
          <div className="space-y-5">
            {messages.map(renderMessage)}
            
            {isTyping && <TypingIndicator />}
            
            {/* Interactive elements */}
            <div className="pt-1">
              {renderInteraction()}
            </div>
          </div>
          
          {/* Scroll anchor with generous padding for mobile */}
          <div ref={messagesEndRef} className="h-40 md:h-24" />
        </div>
      </main>
    </div>
  );
};

export default GuidedChat;
