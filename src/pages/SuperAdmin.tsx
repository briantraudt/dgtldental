
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import SuperAdminLogin from '@/components/SuperAdminLogin';
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';
import { LogOut } from 'lucide-react';
import SuperAdminStats from '@/components/superadmin/SuperAdminStats';
import SuperAdminTabs from '@/components/superadmin/SuperAdminTabs';

const SuperAdmin = () => {
  const { isAuthenticated, isLoading, login, logout } = useSuperAdminAuth();
  const [clinics, setClinics] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Ensure demo clinic exists
      await ensureDemoClinicExists();

      // Fetch all clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (clinicsError) throw clinicsError;
      setClinics(clinicsData || []);

      // Fetch recent chat messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (messagesError) throw messagesError;
      setChatMessages(messagesData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const ensureDemoClinicExists = async () => {
    try {
      // Check if demo clinic exists
      const { data: existingDemo } = await supabase
        .from('clinics')
        .select('id')
        .eq('clinic_id', 'demo-clinic-123')
        .single();

      if (!existingDemo) {
        // Create demo clinic
        const { error } = await supabase
          .from('clinics')
          .insert({
            clinic_id: 'demo-clinic-123',
            name: 'Demo Dental Practice',
            address: '123 Demo Street, Demo City, DC 12345',
            phone: '(555) 123-DEMO',
            email: 'demo@example.com',
            office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
            services_offered: ['General Dentistry', 'Cleanings', 'Fillings', 'Crowns', 'Root Canals', 'Teeth Whitening'],
            insurance_accepted: ['Most Major Insurance Plans', 'Delta Dental', 'Aetna', 'Cigna', 'MetLife'],
            emergency_instructions: 'For dental emergencies after hours, please call our main number and follow the prompts for emergency care.',
            subscription_status: 'demo'
          });

        if (error) {
          console.error('Error creating demo clinic:', error);
        } else {
          console.log('Demo clinic created successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring demo clinic exists:', error);
    }
  };

  const getStats = () => {
    const totalClinics = clinics.length;
    const activeClinics = clinics.filter(c => c.subscription_status === 'active').length;
    const totalMessages = chatMessages.length;
    const todayMessages = chatMessages.filter(m => 
      new Date(m.created_at).toDateString() === new Date().toDateString()
    ).length;

    return { totalClinics, activeClinics, totalMessages, todayMessages };
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <SuperAdminLogin onLogin={login} />;
  }

  const stats = getStats();

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading Super Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Test features in staging, then deploy to selected clients</p>
        </div>
        <Button onClick={logout} variant="outline" className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      <SuperAdminStats {...stats} />
      
      <SuperAdminTabs 
        clinics={clinics}
        chatMessages={chatMessages}
        onUpdate={fetchDashboardData}
      />
    </div>
  );
};

export default SuperAdmin;
