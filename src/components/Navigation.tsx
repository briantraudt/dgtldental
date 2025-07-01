
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-6 right-6 z-30">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/portal')}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <Settings className="h-4 w-4 mr-2" />
        Portal
      </Button>
    </div>
  );
};

export default Navigation;
