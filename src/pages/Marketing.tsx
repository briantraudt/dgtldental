
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageCircle, Clock, Users, Zap, Check, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DentalChatWidget } from '@/components/DentalChatWidget';

const Marketing = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">DGTL Chat</h1>
          </div>
          <nav className="space-x-4">
            <Button variant="ghost" onClick={() => setShowDemo(!showDemo)}>
              {showDemo ? 'Hide Demo' : 'Try Demo'}
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Chat for Your Practice
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Provide 24/7 patient support with an intelligent chat widget that knows your practice inside and out. 
            Handle appointments, answer questions, and improve patient satisfaction automatically.
          </p>
          
          {/* Pricing Highlight */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">Simple Pricing</span>
            </div>
            <div className="text-4xl font-bold mb-2">$10/month</div>
            <p className="text-blue-100">Unlimited features • No setup fees • Cancel anytime</p>
          </div>
          
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/signup">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowDemo(true)}>
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything Your Practice Needs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Smart Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI that understands your practice details, services, and policies to provide accurate responses to patient questions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Never miss a patient inquiry. Your AI assistant works around the clock, even when your office is closed.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Better Patient Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant answers to common questions, appointment information, and emergency instructions improve patient satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-blue-600">$10</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Everything you need to get started</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited AI conversations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom practice information</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>24/7 patient support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Easy website integration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Emergency instructions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Insurance information</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/signup">
                    Get Started Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Patient Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join practices already using DGTL Chat to provide better patient support
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Demo Widget */}
      {showDemo && (
        <div className="fixed bottom-4 right-4 z-50">
          <DentalChatWidget clinicId="demo" />
        </div>
      )}
    </div>
  );
};

export default Marketing;
