import { ArrowRight, Bot, Code, Activity } from 'lucide-react';
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
              Your Smartest Front Desk Hire<br />
              Available 24/7
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
      </section>

      {/* About Section - Mobile and Desktop */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              AI-Powered Patient Support for Your Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform how your practice handles patient questions with intelligent, 24/7&nbsp;assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: What Is It? */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  What Is It?
                </CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  An AI Assistant Trained for Dental Practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our AI-powered assistant answers patient questions instantly—day or night—about your services, insurance, hours, location, and more. 
                  It lives on your website, works 24/7, and is trained to respond just like your front desk would.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: How Does It Work? */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  How Does It Work?
                </CardTitle>
                <CardDescription className="text-green-600 font-medium">
                  Install in Minutes. No Tech Skills Needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Just copy and paste one line of code into your website. That's it. 
                  Or, choose our $100 full setup service and we'll handle it for you. 
                  Once live, your AI assistant will respond to common questions and free up your staff.
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Why It Matters to You */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Why It Matters to You
                </CardTitle>
                <CardDescription className="text-purple-600 font-medium">
                  Save Time, Book More Appointments, and Wow Patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Eliminate repetitive phone calls, reduce front desk interruptions, and never miss a patient question again. 
                  Your patients get immediate answers—even after hours—and your practice looks modern, accessible, and tech-savvy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
