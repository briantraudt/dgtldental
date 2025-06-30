import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Index = () => {
  const navigate = useNavigate();
  const [isDemoVisible, setIsDemoVisible] = useState(false);

  const toggleDemoVisibility = () => {
    setIsDemoVisible(!isDemoVisible);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">DGTL</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/embed-demo')}
              >
                Live Demo
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/signup-flow')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Supercharge Your Dental Practice with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automate patient communication, reduce phone calls, and improve satisfaction with our AI-powered chatbot.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            onClick={() => navigate('/signup-flow')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card>
            <CardHeader>
              <CardTitle>24/7 Patient Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Provide instant answers to common questions, even outside of office hours.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Reduce Phone Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Let AI handle routine inquiries, freeing up your staff for critical tasks.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Improve Patient Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Offer personalized, timely support that keeps patients happy and engaged.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Easy Website Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simply copy and paste a code snippet to add the chatbot to your site.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Practice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                The AI is trained on your specific services, hours, and policies.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card>
            <CardHeader>
              <CardTitle>Affordable Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get all the benefits of AI without breaking the bank. Starting at just $10/month.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Patient Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of dental practices using AI to improve patient satisfaction and reduce phone calls.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => navigate('/signup-flow')}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DGTL. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Demo Widget (Conditionally Rendered) */}
      {isDemoVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <iframe
            src="/embed-demo"
            title="AI Chatbot Demo"
            width="350"
            height="500"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
