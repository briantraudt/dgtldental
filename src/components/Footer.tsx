
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2024 Your Company. All rights reserved.
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/portal')}
            className="text-gray-500 hover:text-gray-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Portal
          </Button>
        </div>
        
        {/* Centered dental icon */}
        <div className="flex justify-center mt-6">
          <img 
            src="/lovable-uploads/e61c9ac3-9f9b-422b-84b1-43301d0a0096.png" 
            alt="Dental AI Assistant" 
            className="w-12 h-12 opacity-60"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
