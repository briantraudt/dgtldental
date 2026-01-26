import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Step = 
  | 'greeting'
  | 'qualification'
  | 'not-dental'
  | 'credibility'
  | 'service'
  | 'process'
  | 'safety'
  | 'soft-close'
  | 'question'
  | 'form'
  | 'success';

interface Message {
  type: 'bot' | 'user';
  content: React.ReactNode;
}

const GuidedChat = () => {
  const [step, setStep] = useState<Step>('greeting');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentStep, setShowCurrentStep] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    practiceName: '',
    websiteUrl: '',
    contactName: '',
    email: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  // Initialize with greeting
  useEffect(() => {
    setMessages([{
      type: 'bot',
      content: "Hi — welcome. Quick question so I can point you in the right direction."
    }]);
  }, []);

  const addBotMessage = (content: React.ReactNode) => {
    setMessages(prev => [...prev, { type: 'bot', content }]);
  };

  const handleUserChoice = (choice: string, nextStep: Step) => {
    setShowCurrentStep(false);
    setMessages(prev => [...prev, { type: 'user', content: choice }]);
    
    setTimeout(() => {
      // Add the next bot message based on step
      const botMessages: Record<string, React.ReactNode> = {
        'credibility': (
          <>Great. We've answered over <span className="font-semibold text-blue-600">50,000 real dental questions</span> using a dental-trained AI assistant.</>
        ),
        'service': "We build and install a custom dental assistant on your website that answers patient questions 24/7 using safe, dental-specific language.",
        'process': "Here's how it works:",
        'safety': "The assistant never diagnoses, never gives treatment decisions, and always encourages patients to contact your office.",
        'soft-close': "Would you like us to set this up for your website?",
        'question': (
          <>No problem. Email us at <a href="mailto:hello@dgtldental.com" className="text-blue-600 underline">hello@dgtldental.com</a> and we'll get back to you shortly.</>
        ),
        'form': "Perfect. Tell us a bit about your practice.",
        'not-dental': "Thanks for stopping by. Our service is designed specifically for dental practices. If you know a dentist who might benefit, feel free to share this page with them."
      };
      
      if (botMessages[nextStep]) {
        addBotMessage(botMessages[nextStep]);
      }
      
      setStep(nextStep);
      setShowCurrentStep(true);
    }, 300);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('setup_requests' as any)
        .insert({
          practice_name: formData.practiceName,
          website_url: formData.websiteUrl,
          contact_name: formData.contactName,
          email: formData.email
        });
      
      if (error) throw error;
      
      setShowCurrentStep(false);
      addBotMessage("Thanks — we'll review your site and follow up shortly.");
      setStep('success');
      setShowCurrentStep(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderCurrentStepActions = () => {
    if (!showCurrentStep) return null;

    switch (step) {
      case 'greeting':
        return (
          <div className="animate-fade-in">
            <Button 
              onClick={() => handleUserChoice('Continue', 'qualification')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'qualification':
        return (
          <div className="animate-fade-in space-y-2">
            <p className="text-gray-600 text-sm mb-3">Do you work in the dental industry?</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleUserChoice('Dentist / Practice Owner', 'credibility')}
                variant="outline"
                className="rounded-full border-gray-300 hover:bg-gray-100"
              >
                Dentist / Practice Owner
              </Button>
              <Button 
                onClick={() => handleUserChoice('I work in dental', 'credibility')}
                variant="outline"
                className="rounded-full border-gray-300 hover:bg-gray-100"
              >
                I work in dental
              </Button>
              <Button 
                onClick={() => handleUserChoice('No', 'not-dental')}
                variant="outline"
                className="rounded-full border-gray-300 hover:bg-gray-100"
              >
                No
              </Button>
            </div>
          </div>
        );

      case 'not-dental':
        return null;

      case 'credibility':
        return (
          <div className="animate-fade-in">
            <Button 
              onClick={() => handleUserChoice('Continue', 'service')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'service':
        return (
          <div className="animate-fade-in">
            <p className="text-gray-500 text-sm mb-3">There's no software to learn and no setup required on your end.</p>
            <Button 
              onClick={() => handleUserChoice('Continue', 'process')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'process':
        return (
          <div className="animate-fade-in space-y-4">
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span>You tell us about your practice</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span>We build your assistant</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span>Your web team adds one line of code</span>
              </div>
            </div>
            <p className="font-semibold text-gray-900">You're live within 24 hours.</p>
            <Button 
              onClick={() => handleUserChoice('Continue', 'safety')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'safety':
        return (
          <div className="animate-fade-in">
            <Button 
              onClick={() => handleUserChoice('Continue', 'soft-close')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'soft-close':
        return (
          <div className="animate-fade-in flex flex-wrap gap-2">
            <Button 
              onClick={() => handleUserChoice("Yes, let's do it", 'form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Yes, let's do it
            </Button>
            <Button 
              onClick={() => handleUserChoice('I have a question', 'question')}
              variant="outline"
              className="rounded-full border-gray-300 hover:bg-gray-100"
            >
              I have a question
            </Button>
          </div>
        );

      case 'question':
        return (
          <div className="animate-fade-in">
            <p className="text-gray-500 text-sm mb-3">Or if you're ready to get started:</p>
            <Button 
              onClick={() => handleUserChoice('Request Setup', 'form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Request Setup
            </Button>
          </div>
        );

      case 'form':
        return (
          <div className="animate-fade-in w-full max-w-md">
            <p className="text-gray-500 text-sm mb-4">$99/month · No setup fee · Cancel anytime</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="practiceName" className="text-gray-700 text-sm">
                  Practice Name
                </Label>
                <Input
                  id="practiceName"
                  name="practiceName"
                  type="text"
                  required
                  value={formData.practiceName}
                  onChange={handleChange}
                  placeholder="Bright Smile Dental"
                  className="mt-1 rounded-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="websiteUrl" className="text-gray-700 text-sm">
                  Website URL
                </Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://www.yourdentalpractice.com"
                  className="mt-1 rounded-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="contactName" className="text-gray-700 text-sm">
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Dr. Jane Smith"
                  className="mt-1 rounded-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@yourdentalpractice.com"
                  className="mt-1 rounded-lg"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </div>
        );

      case 'success':
        return (
          <div className="animate-fade-in flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Request submitted</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <img 
            src="/images/dgtl-logo.png" 
            alt="DGTL Dental" 
            className="h-12 md:h-14 w-auto"
          />
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl animate-fade-in ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-base leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current Step Actions */}
          <div className="mt-6 pl-0">
            {renderCurrentStepActions()}
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default GuidedChat;
