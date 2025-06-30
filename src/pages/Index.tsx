
import { useEffect } from 'react';
import DentalChatWidget from '@/components/DentalChatWidget';

const Index = () => {
  useEffect(() => {
    // Simulate the script loading scenario
    window.DENTAL_CHAT_CONFIG = {
      clinicId: 'demo-clinic-123'
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Dental Practice Website Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome to DGTL Dental
          </h2>
          <p className="text-gray-600 mb-4">
            Your trusted dental care provider in Boerne, TX. We offer comprehensive 
            dental services including cleanings, crowns, Invisalign, and dental implants.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Office Hours</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
                <li>Saturday: 9:00 AM - 1:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contact Info</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Phone: (830) 555-1234</li>
                <li>Address: 123 Main St, Boerne, TX 78006</li>
                <li>Email: info@dgtldental.com</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Chat Widget Demo
          </h3>
          <p className="text-gray-600 mb-4">
            The chat widget appears in the bottom-right corner. Click it to ask questions 
            about our services, hours, insurance, or schedule an appointment!
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Embed Code Example:</h4>
            <code className="text-sm text-gray-600 bg-white p-2 rounded border block">
              {`<script defer src="https://yourdomain.com/widget.js" data-clinic-id="demo-clinic-123"></script>`}
            </code>
          </div>
        </div>
      </div>
      
      {/* The chat widget */}
      <DentalChatWidget />
    </div>
  );
};

export default Index;
