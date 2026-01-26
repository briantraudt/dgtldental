import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

const IntakeForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    practiceName: '',
    websiteUrl: '',
    contactName: '',
    email: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in production, this would send to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <section id="intake-form" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Thanks for Your Request!
              </h2>
              <p className="text-lg text-gray-600">
                We'll review your site and reach out shortly to get your dental assistant set up.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="intake-form" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Request Your Setup
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get your dental AI assistant ready within 24 hours.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-gray-100">
            <div className="space-y-6">
              <div>
                <Label htmlFor="practiceName" className="text-gray-700 font-medium">
                  Practice Name *
                </Label>
                <Input
                  id="practiceName"
                  name="practiceName"
                  type="text"
                  required
                  value={formData.practiceName}
                  onChange={handleChange}
                  placeholder="Bright Smile Dental"
                  className="mt-2 py-3"
                />
              </div>
              
              <div>
                <Label htmlFor="websiteUrl" className="text-gray-700 font-medium">
                  Website URL *
                </Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://www.yourdentalpractice.com"
                  className="mt-2 py-3"
                />
              </div>
              
              <div>
                <Label htmlFor="contactName" className="text-gray-700 font-medium">
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Dr. Jane Smith"
                  className="mt-2 py-3"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@yourdentalpractice.com"
                  className="mt-2 py-3"
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Anything you want us to know? (optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us about your practice, specific needs, or any questions..."
                  className="mt-2 min-h-[100px]"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;
