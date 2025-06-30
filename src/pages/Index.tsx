
import { useState } from 'react';
import { ArrowRight, MessageCircle, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import DentalChatWidget from '@/components/DentalChatWidget';
import EmbeddedChatDemo from '@/components/EmbeddedChatDemo';

const Index = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/6b06b8d1-0437-4771-8911-a3058c126fd6.png')`
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Revolutionize Your Dental Practice with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Attract more patients, streamline communication, and enhance your online presence with our AI-powered chat widget.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
            Get Started Today <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          {/* Features Section */}
          <section className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-yellow-500" /> Instant Patient Engagement</CardTitle>
                <CardDescription>Provide immediate answers to patient inquiries 24/7.</CardDescription>
              </CardHeader>
              <CardContent>
                Reduce wait times and improve patient satisfaction with AI-driven responses.
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5 text-green-500" /> Secure & HIPAA Compliant</CardTitle>
                <CardDescription>Protect patient data with our secure and compliant platform.</CardDescription>
              </CardHeader>
              <CardContent>
                Ensure the privacy and security of patient information with end-to-end encryption.
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-purple-500" /> Analytics & Insights</CardTitle>
                <CardDescription>Track key metrics and gain valuable insights into patient interactions.</CardDescription>
              </CardHeader>
              <CardContent>
                Optimize your communication strategy with data-driven analytics and reporting.
              </CardContent>
            </Card>
          </section>

          {/* Demo Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              See the AI Chat Widget in Action
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Experience the power of AI-driven patient communication with our interactive demo.
            </p>

            <div className="flex justify-center">
              <Button onClick={() => setIsDemoOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                Launch Demo <MessageCircle className="ml-2" />
              </Button>
            </div>

            {isDemoOpen && (
              <div className="mt-8">
                <EmbeddedChatDemo />
              </div>
            )}
          </section>

          {/* Call to Action Section */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Ready to Transform Your Dental Practice?
            </h2>
            <p className="text-gray-600 mb-8">
              Join hundreds of dental practices already using our AI chat widget to improve patient engagement and streamline operations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </section>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <DentalChatWidget />
    </div>
  );
};

export default Index;
