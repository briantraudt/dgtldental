import { useEffect } from 'react';
import GuidedChat from '@/components/landing/GuidedChat';
import { trackPageView } from '@/lib/tracking';

const Index = () => {
  useEffect(() => {
    trackPageView('/');
  }, []);

  return <GuidedChat />;
};

export default Index;
