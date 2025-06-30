
import { Bot, Code, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/80 py-20 relative">
      {/* Subtle top gradient for seamless transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Patient Support for Your Practice
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform how your practice handles patient questions with intelligent, 24/7 assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Card 1: What Is It? */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 group">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                What Is It?
              </CardTitle>
              <CardDescription className="text-blue-600 font-semibold text-lg">
                An AI Assistant Trained for Dental Practices
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Our AI-powered assistant answers patient questions instantly—day or night—about your services, insurance, hours, location, and more. 
                It lives on your website, works 24/7, and is trained to respond just like your front desk would.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: How Does It Work? */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 group">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                How Does It Work?
              </CardTitle>
              <CardDescription className="text-green-600 font-semibold text-lg">
                Install in Minutes. No Tech Skills Needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Just copy and paste one line of code into your website. That's it. 
                Or, choose our $100 full setup service and we'll handle it for you. 
                Once live, your AI assistant will respond to common questions and free up your staff.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Why It Matters to You */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 group">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                Why It Matters to You
              </CardTitle>
              <CardDescription className="text-purple-600 font-semibold text-lg">
                Save Time, Book More Appointments, and Wow Patients
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
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
