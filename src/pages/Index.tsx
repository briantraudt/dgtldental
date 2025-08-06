
import DGTLChatWidget from '@/components/DGTLChatWidget';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DemoSection from '@/components/DemoSection';
import FAQSection from '@/components/FAQSection';
import QuestionSection from '@/components/QuestionSection';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <Navigation />
        <HeroSection />
      </div>
      <AboutSection />
      <DemoSection />
      <FAQSection />
      <QuestionSection />
      <Footer />
      <DGTLChatWidget />
    </div>
  );
};

export default Index;
