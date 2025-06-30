
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, MessageCircle, Globe, Settings, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DentalChatWidget from '@/components/DentalChatWidget';
import EmbeddedChatDemo from '@/components/EmbeddedChatDemo';

const Marketing = () => {
  const navigate = useNavigate();

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2668&q=80')`
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Never Miss a Patient Question Again
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                Let patients get instant answers — about hours, insurance, and more — day or night. Powered by GPT.
              </p>
              
              <Button 
                onClick={scrollToDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free Demo
              </Button>
            </div>

            {/* Floating Chat Example */}
            <div className="absolute bottom-20 right-8 hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-fade-in">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-800">"What are your office hours?"</p>
                    </div>
                    <div className="bg-blue-600 rounded-lg p-3 text-white">
                      <p className="text-sm">"We're open Mon-Fri 8am-6pm, Saturday 9am-2pm. Would you like to schedule an appointment?"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo-section" className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                24/7 AI Chat for Your Dental Website
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Instant answers for patients — powered by GPT, customized to your practice.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <MessageCircle className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Always-On Chat</h3>
                <p className="text-sm text-gray-600">GPT-powered answers, personalized to your clinic</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <Globe className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">One-Line Install</h3>
                <p className="text-sm text-gray-600">Copy, paste, and go live in seconds</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <Settings className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Custom to You</h3>
                <p className="text-sm text-gray-600">Hours, insurance, services — it knows it all</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <DollarSign className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Only $10/Month</h3>
                <p className="text-sm text-gray-600">No contracts. No hassle.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg w-full sm:w-auto"
              >
                Start Now for Just $10/Month
              </Button>
              <p className="text-sm text-gray-500">No setup. Cancel anytime.</p>
            </div>
          </div>

          {/* Right side - Chat Demo */}
          <div className="lg:pl-8">
            <EmbeddedChatDemo />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Chat with Our AI Dental Assistant</h3>
              <p className="text-gray-600 leading-relaxed">
                This is a live demo powered by OpenAI's GPT model. Try asking about:
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Dental procedures and treatments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Oral health and hygiene tips</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Common dental problems</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Preventive care advice</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h4 className="font-semibold mb-4">Embed Code Example:</h4>
              <code className="text-sm bg-gray-100 p-4 rounded block font-mono break-all">
                {`<script defer src="${window.location.origin}/widget.js" data-clinic-id="your-clinic-id"></script>`}
              </code>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This AI provides general information only. For specific medical advice, 
                  always consult with a qualified dentist.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Why Dental Practices Love Our Chat Widget</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Reduce Phone Calls</h3>
              <p className="text-gray-600">Patients get instant answers to common questions without calling your office.</p>
            </Card>
            <Card className="p-8 border-0 shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Capture More Leads</h3>
              <p className="text-gray-600">24/7 availability means you never miss a potential patient inquiry.</p>
            </Card>
            <Card className="p-8 border-0 shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Professional & Smart</h3>
              <p className="text-gray-600">AI responses are accurate and maintain your practice's professional tone.</p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Chat widget for demo */}
      <DentalChatWidget />
    </div>
  );
};

export default Marketing;
