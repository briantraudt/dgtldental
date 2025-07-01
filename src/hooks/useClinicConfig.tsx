
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClinicConfig } from '@/types/chatTypes';

export const useClinicConfig = (clinicId: string) => {
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicConfig = async () => {
      if (!clinicId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching config for clinic:', clinicId);

        // Use the new centralized config endpoint
        const { data, error } = await supabase.functions.invoke('get-clinic-config', {
          body: { clientId: clinicId }
        });

        if (error) {
          console.error('Error fetching clinic config:', error);
          setError(error.message);
          return;
        }

        if (data) {
          console.log('Received clinic config:', data);
          setClinicConfig({
            clinic_id: data.clinic_id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            office_hours: data.office_hours,
            services_offered: data.services_offered || [],
            insurance_accepted: data.insurance_accepted || [],
            emergency_instructions: data.emergency_instructions,
            widget_config: data.widget_config
          });
        }
      } catch (error) {
        console.error('Error fetching clinic config:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch clinic config');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicConfig();
  }, [clinicId]);

  return { clinicConfig, isLoading, error };
};
