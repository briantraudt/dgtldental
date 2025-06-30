
import { Bot, Code, Activity, DollarSign } from 'lucide-react';
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                An AI Assistant Built for Dental Practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Our smart AI assistant lives on your website and instantly answers patient questions—day or night—about services, insurance, hours, location, and more. It works 24/7, just like a perfect front desk hire that never clocks out.
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
                Get Your Custom Code Instantly — Go Live Today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                At the end of signup, you'll receive a line of code customized for your practice. Just paste it into your website—no tech experience needed. Want help? We'll handle the install for a one-time $100 fee. Once it's live, your assistant starts answering patient questions immediately—saving time and freeing up your staff, even after hours.
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
                Save Time. Book More Appointments. Impress Patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Stop wasting staff time on repetitive calls. Get instant answers for patients—even after hours—and give your practice a modern, responsive feel. Fewer interruptions. More bookings. Happier patients.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: What Does It Cost? */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-emerald-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                What Does It Cost?
              </CardTitle>
              <CardDescription className="text-emerald-600 font-medium">
                Straightforward Pricing. No Surprises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Just $10/month — no contracts, cancel anytime. Need help with setup? We offer a $100 one-time installation that handles it all for you. No hidden fees. Just value.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
