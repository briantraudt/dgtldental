import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProofSection from '@/components/landing/ProofSection';
import ProcessSection from '@/components/landing/ProcessSection';
import IntakeForm from '@/components/landing/IntakeForm';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProofSection />
      <ProcessSection />
      <IntakeForm />
      <Footer />
    </div>
  );
};

export default Index;
