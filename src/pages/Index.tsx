
import DGTLChatWidget from '@/components/DGTLChatWidget';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DemoSection from '@/components/DemoSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <DemoSection />
      <Footer />
      <DGTLChatWidget />
    </div>
  );
};

export default Index;
