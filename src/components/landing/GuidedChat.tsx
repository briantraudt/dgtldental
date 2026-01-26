import { useState } from 'react';
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
  content: string;
}

const GuidedChat = () => {
  const [step, setStep] = useState<Step>('greeting');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    practiceName: '',
    websiteUrl: '',
    contactName: '',
    email: ''
  });

  const addMessage = (type: 'bot' | 'user', content: string) => {
    setMessages(prev => [...prev, { type, content }]);
  };

  const handleUserChoice = (choice: string, nextStep: Step) => {
    addMessage('user', choice);
    setTimeout(() => {
      setStep(nextStep);
    }, 300);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('setup_requests')
        .insert({
          practice_name: formData.practiceName,
          website_url: formData.websiteUrl,
          contact_name: formData.contactName,
          email: formData.email
        });
      
      if (error) throw error;
      
      setStep('success');
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

  const renderStep = () => {
    switch (step) {
      case 'greeting':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Hi — welcome. Quick question so I can point you in the right direction.
            </p>
            <Button 
              onClick={() => setStep('qualification')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Continue
            </Button>
          </div>
        );

      case 'qualification':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Do you work in the dental industry?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => handleUserChoice('Dentist / Practice Owner', 'credibility')}
                variant="outline"
                className="text-lg py-6 px-6 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300"
              >
                Dentist / Practice Owner
              </Button>
              <Button 
                onClick={() => handleUserChoice('I work in dental', 'credibility')}
                variant="outline"
                className="text-lg py-6 px-6 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300"
              >
                I work in dental
              </Button>
              <Button 
                onClick={() => handleUserChoice('No', 'not-dental')}
                variant="outline"
                className="text-lg py-6 px-6 rounded-xl border-2 hover:bg-gray-50"
              >
                No
              </Button>
            </div>
          </div>
        );

      case 'not-dental':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Thanks for stopping by. Our service is designed specifically for dental practices. 
              If you know a dentist who might benefit, feel free to share this page with them.
            </p>
          </div>
        );

      case 'credibility':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Great. We've answered over <span className="font-semibold text-blue-600">50,000 real dental questions</span> using a dental-trained AI assistant.
            </p>
            <Button 
              onClick={() => setStep('service')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Continue
            </Button>
          </div>
        );

      case 'service':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              We build and install a custom dental assistant on your website that answers patient questions 24/7 using safe, dental-specific language.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              There's no software to learn and no setup required on your end.
            </p>
            <Button 
              onClick={() => setStep('process')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Continue
            </Button>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6">
              Here's how it works:
            </p>
            <div className="space-y-4 text-lg md:text-xl text-gray-700">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">1</span>
                <span>You tell us about your practice</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">2</span>
                <span>We build your assistant</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">3</span>
                <span>Your web team adds one line of code</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 pt-4">
              You're live within 24 hours.
            </p>
            <Button 
              onClick={() => setStep('safety')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Continue
            </Button>
          </div>
        );

      case 'safety':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              The assistant never diagnoses, never gives treatment decisions, and always encourages patients to contact your office.
            </p>
            <Button 
              onClick={() => setStep('soft-close')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Continue
            </Button>
          </div>
        );

      case 'soft-close':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Would you like us to set this up for your website?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => handleUserChoice("Yes, let's do it", 'form')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
              >
                Yes, let's do it
              </Button>
              <Button 
                onClick={() => handleUserChoice('I have a question', 'question')}
                variant="outline"
                className="text-lg py-6 px-6 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300"
              >
                I have a question
              </Button>
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              No problem. Email us at <a href="mailto:hello@dgtldental.com" className="text-blue-600 underline">hello@dgtldental.com</a> and we'll get back to you shortly.
            </p>
            <p className="text-lg text-gray-600">
              Or if you're ready to get started:
            </p>
            <Button 
              onClick={() => setStep('form')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8 rounded-xl"
            >
              Request Setup
            </Button>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-2">
              Perfect. Tell us a bit about your practice.
            </p>
            <p className="text-base text-gray-500 mb-6">
              $99/month · No setup fee · Cancel anytime
            </p>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <Label htmlFor="practiceName" className="text-gray-700 font-medium text-base">
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
                  className="mt-2 py-5 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="websiteUrl" className="text-gray-700 font-medium text-base">
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
                  className="mt-2 py-5 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="contactName" className="text-gray-700 font-medium text-base">
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
                  className="mt-2 py-5 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium text-base">
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
                  className="mt-2 py-5 text-lg"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-7 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold mt-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              Thanks — we'll review your site and follow up shortly.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/86e29185-fd00-4d84-965c-1c4760689215.png" 
              alt="DGTL Dental" 
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-gray-900">DGTL Dental</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Previous messages */}
          {messages.length > 0 && (
            <div className="mb-8 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`text-lg ${msg.type === 'user' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                >
                  {msg.type === 'user' && <span className="text-gray-400 mr-2">You:</span>}
                  {msg.content}
                </div>
              ))}
            </div>
          )}
          
          {/* Current step */}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default GuidedChat;
