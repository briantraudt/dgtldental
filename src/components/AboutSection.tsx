
import { Bot, Code, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  return (
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
  );
};

export default AboutSection;
