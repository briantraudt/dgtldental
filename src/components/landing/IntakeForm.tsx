import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

const IntakeForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    practiceName: '',
    websiteUrl: '',
    contactName: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <section id="intake-form" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thanks for Your Request!
            </h2>
            <p className="text-xl text-gray-600">
              We'll review your site and reach out shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="intake-form" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Add This to Your Website?
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              We'll review your site and handle everything.
            </p>
            {/* Pricing line */}
            <p className="text-lg text-gray-500">
              $99/month · No setup fee · Cancel anytime
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="practiceName" className="text-gray-700 font-medium text-lg">
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
                className="mt-2 py-4 text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="websiteUrl" className="text-gray-700 font-medium text-lg">
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
                className="mt-2 py-4 text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="contactName" className="text-gray-700 font-medium text-lg">
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
                className="mt-2 py-4 text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium text-lg">
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
                className="mt-2 py-4 text-lg"
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-7 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold mt-4"
            >
              {isSubmitting ? 'Submitting...' : 'Request Setup'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;
