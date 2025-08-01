
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, Mail } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              © 2024 DGTL Dental. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>hello@dgtldental.com</span>
            </div>
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
      </div>
    </footer>
  );
};

export default Footer;
