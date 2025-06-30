
import DGTLChatWidget from '@/components/DGTLChatWidget';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DemoSection from '@/components/DemoSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <DemoSection />
      <DGTLChatWidget />
    </div>
  );
};

export default Index;
