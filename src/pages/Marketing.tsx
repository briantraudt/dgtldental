
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            24/7 AI Chat for Your Dental Website
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Instant answers for patients — powered by GPT, customized to your practice.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-3">Always-On Chat</h3>
              <p className="text-gray-600 leading-relaxed">GPT-powered answers, personalized to your clinic</p>
            </Card>
            
            <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <Globe className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-3">One-Line Install</h3>
              <p className="text-gray-600 leading-relaxed">Copy, paste, and go live in seconds</p>
            </Card>
            
            <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <Settings className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-3">Custom to You</h3>
              <p className="text-gray-600 leading-relaxed">Hours, insurance, services — it knows it all</p>
            </Card>
            
            <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <DollarSign className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-3">Only $10/Month</h3>
              <p className="text-gray-600 leading-relaxed">No contracts. No hassle.</p>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-xl rounded-lg shadow-lg mb-3"
            >
              Start Now for Just $10/Month
            </Button>
            <p className="text-sm text-gray-500">No setup. Cancel anytime.</p>
          </div>
        </div>

        {/* Live Demo Frame */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-10 mb-20">
          <h2 className="text-4xl font-bold text-center mb-4">🦷 Try the Live Chat Demo</h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Ask anything about dental care. Powered by GPT and preloaded with sample practice info.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <EmbeddedChatDemo />
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-10 mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6">Chat with Our AI Dental Assistant</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                This is a live demo powered by OpenAI's GPT model. Try asking about:
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Dental procedures and treatments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Oral health and hygiene tips</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Common dental problems</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Preventive care advice</span>
                </div>
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-800 leading-relaxed">
                  <strong>Note:</strong> This AI provides general information only. For specific medical advice, 
                  always consult with a qualified dentist.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-6 leading-relaxed">
                The chat widget appears in the bottom-right corner. Click the blue circle to start chatting!
              </p>
              <div className="bg-white p-6 rounded border border-gray-200">
                <h4 className="font-semibold mb-4">Embed Code Example:</h4>
                <code className="text-sm bg-gray-100 p-4 rounded block font-mono">
                  {`<script defer src="${window.location.origin}/widget.js" data-clinic-id="your-clinic-id"></script>`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-12">Why Dental Practices Love Our Chat Widget</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Reduce Phone Calls</h3>
              <p className="text-gray-600 leading-relaxed">Patients get instant answers to common questions without calling your office.</p>
            </Card>
            <Card className="p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Capture More Leads</h3>
              <p className="text-gray-600 leading-relaxed">24/7 availability means you never miss a potential patient inquiry.</p>
            </Card>
            <Card className="p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Professional & Smart</h3>
              <p className="text-gray-600 leading-relaxed">AI responses are accurate and maintain your practice's professional tone.</p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* The chat widget for demo */}
      <DentalChatWidget />
    </div>
  );
};

export default Marketing;
