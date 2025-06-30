
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import DGTLChatWidget from '@/components/DGTLChatWidget';
import EmbeddedChatDemo from '@/components/EmbeddedChatDemo';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with dental office background */}
      <section 
        className="relative h-screen bg-cover md:bg-center bg-top bg-no-repeat flex flex-col justify-center"
        style={{
          backgroundImage: `url('/lovable-uploads/83a87e5a-b1bc-4a47-b89c-e217eae32a7f.png')`,
          backgroundSize: 'cover'
        }}
      >
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-blue-900/20"></div>
        
        {/* Hero Content */}
        <div className="relative flex-1 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Smartest Front Desk Hire<br />Available 24/7
            </h1>
            <p className="text-lg md:text-2xl mb-8 opacity-90">
              Answer patient questions instantly, even after hours. No contracts. Just $10/month.
            </p>
            <Link to="/signup-flow">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
                Get Started Today <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Boxes at Bottom - Hidden on Mobile */}
        <div className="relative container mx-auto px-4 pb-8 hidden md:block">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" /> 
                  24/7 Patient Support
                </CardTitle>
                <CardDescription className="text-sm">
                  Provide instant answers to patient questions — even after hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>Reduce calls, save staff time, and increase patient satisfaction</strong> with round-the-clock AI help.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-green-500" /> 
                  Secure & Private
                </CardTitle>
                <CardDescription className="text-sm">
                  Designed to protect your patients' privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>All chats are handled confidentially.</strong> No sensitive data is stored or shared.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-purple-500" /> 
                  Quick & Easy Setup
                </CardTitle>
                <CardDescription className="text-sm">
                  Go live in minutes — or let us handle it for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>Copy one line of code into your site,</strong> or choose our $100 full setup service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile Feature Cards - Visible only on mobile, moved below hero */}
      <div className="md:hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" /> 
                  24/7 Patient Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>Reduce calls, save staff time, and increase patient satisfaction</strong> with round-the-clock AI help.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Shield className="mr-2 h-4 w-4 text-green-500" /> 
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>All chats are handled confidentially.</strong> No sensitive data is stored or shared.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Zap className="mr-2 h-4 w-4 text-purple-500" /> 
                  Quick & Easy Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">
                  <strong>Copy one line of code into your site,</strong> or choose our $100 full setup service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          {/* Demo Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              See How Your AI Dental Assistant Works
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Experience the power of a 24/7 AI assistant trained to answer dental-specific questions for your patients — instantly and accurately.
            </p>

            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <EmbeddedChatDemo />
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Ready to Put Your Website to Work for You?
            </h2>
            <p className="text-gray-600 mb-8">
              Join practices using our AI chat assistant to answer questions, reduce phone calls, and stay available 24/7 — even after hours.
            </p>
            <Link to="/signup-flow">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </section>
        </div>
      </div>

      {/* DGTL Dental Chat Widget */}
      <DGTLChatWidget />
    </div>
  );
};

export default Index;
