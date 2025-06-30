import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, MessageCircle, Globe, Settings, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DentalChatWidget from '@/components/DentalChatWidget';
import EmbeddedChatDemo from '@/components/EmbeddedChatDemo';

const Marketing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                24/7 AI Chat for Your Dental Website
              </h1>
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
