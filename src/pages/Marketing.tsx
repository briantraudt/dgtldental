
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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Automated 24/7 Chat for Your Dental Website
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let patients ask questions anytime — about hours, insurance, services, and more.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">24/7 Smart Chat with GPT</h3>
              <p className="text-sm text-gray-600">AI-powered responses using your practice info</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Embed on Any Website</h3>
              <p className="text-sm text-gray-600">One line of code to add to your site</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Personalized to Your Practice</h3>
              <p className="text-sm text-gray-600">Knows your hours, services, and policies</p>
            </Card>
            
            <Card className="p-6 text-center">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Just $10/month</h3>
              <p className="text-sm text-gray-600">Cancel anytime, no setup fees</p>
            </Card>
          </div>

          <Button 
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg mb-12"
          >
            Get Started – Only $10/month
          </Button>
        </div>

        {/* Live Demo Frame */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">🦷 Try the Live AI Demo</h2>
          <p className="text-center text-gray-600 mb-8">
            Ask questions about dental care, procedures, or oral health. This AI is powered by OpenAI's GPT model.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <EmbeddedChatDemo />
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Chat with Our AI Dental Assistant</h3>
              <p className="text-gray-600 mb-4">
                This is a live demo powered by OpenAI's GPT model. The AI assistant can answer 
                questions about dental care, procedures, and general oral health. Try asking about:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Dental procedures and treatments
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Oral health and hygiene tips
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Common dental problems
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Preventive care advice
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This AI provides general information only. For specific medical advice, 
                  always consult with a qualified dentist.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                The chat widget appears in the bottom-right corner. Click the blue circle to start chatting!
              </p>
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2">Embed Code Example:</h4>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  {`<script defer src="${window.location.origin}/widget.js" data-clinic-id="your-clinic-id"></script>`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials / Benefits */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Why Dental Practices Love Our Chat Widget</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Reduce Phone Calls</h3>
              <p className="text-gray-600">Patients get instant answers to common questions without calling your office.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Capture More Leads</h3>
              <p className="text-gray-600">24/7 availability means you never miss a potential patient inquiry.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Professional & Smart</h3>
              <p className="text-gray-600">AI responses are accurate and maintain your practice's professional tone.</p>
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
