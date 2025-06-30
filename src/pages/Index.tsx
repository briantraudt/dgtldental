import { ArrowRight, Bot, Code, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import DGTLChatWidget from '@/components/DGTLChatWidget';
import EmbeddedChatDemo from '@/components/EmbeddedChatDemo';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with different backgrounds for mobile and desktop */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center"
        style={{
          backgroundImage: `url('/lovable-uploads/942be64c-570e-4ba1-9e24-e46fd5478324.png')`,
        }}
      >
        {/* Desktop background override */}
        <div 
          className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/4696588c-59c3-46d6-8d8b-c6e580f53b9f.png')`,
          }}
        ></div>
        
        {/* Elegant gradient overlay that transitions to next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900/40 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            {/* Mobile headline layout */}
            <div className="block md:hidden">
              <h1 className="text-4xl font-bold mb-2">
                The Assistant
              </h1>
              <h1 className="text-4xl font-bold mb-4">
                That Stays Late
              </h1>
              <p className="text-lg font-medium mb-6 opacity-90">
                (So You Don't Have To)
              </p>
            </div>
            
            {/* Desktop headline layout */}
            <h1 className="hidden md:block text-4xl md:text-6xl font-bold mb-6">
              The Assistant That Stays Late<br />
              (So You Don't Have To)
            </h1>
            
            <p className="text-lg md:text-2xl mb-8 opacity-90">
              When the lights go off, your front desk stays on — answering patient questions 24/7.
            </p>
            <Link to="/signup-flow">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
                Get Started Today <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Smooth transition element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-15"></div>
      </section>

      {/* About Section with improved gradient */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/80 py-16 relative">
        {/* Subtle top gradient for seamless transition */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              AI-Powered Patient Support for Your Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center">
              Transform how your practice handles patient questions with intelligent, 24/7 assistance.
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

      {/* Demo and CTA Section with elegant gradient transition */}
      <div className="relative bg-gradient-to-b from-indigo-100/80 via-blue-50/60 to-slate-100/40 py-16">
        {/* Seamless transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-100/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
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
          <section className="text-center bg-white/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-lg">
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
        
        {/* Bottom gradient for page completion */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent"></div>
      </div>

      {/* DGTL Dental Chat Widget */}
      <DGTLChatWidget />
    </div>
  );
};

export default Index;
