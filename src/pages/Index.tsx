import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProofSection from '@/components/landing/ProofSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ProcessSection from '@/components/landing/ProcessSection';
import SafetySection from '@/components/landing/SafetySection';
import PricingSection from '@/components/landing/PricingSection';
import IntakeForm from '@/components/landing/IntakeForm';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProofSection />
      <FeaturesSection />
      <ProcessSection />
      <SafetySection />
      <PricingSection />
      <IntakeForm />
      <Footer />
    </div>
  );
};

export default Index;
