
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClinicConfig } from '@/types/chatTypes';
import { DEMO_CLINIC_CONFIG } from '@/utils/clinicConfig';

export const useClinicConfig = (clinicId: string) => {
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);

  useEffect(() => {
    const fetchClinicConfig = async () => {
      // If it's the demo clinic, use the demo config
      if (clinicId === 'demo-clinic-123') {
        setClinicConfig(DEMO_CLINIC_CONFIG);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('clinic_id', clinicId)
          .single();

        if (error) {
          console.error('Error fetching clinic config:', error);
          return;
        }

        if (data) {
          setClinicConfig({
            clinic_id: data.clinic_id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            office_hours: data.office_hours,
            services_offered: data.services_offered || [],
            insurance_accepted: data.insurance_accepted || [],
            emergency_instructions: data.emergency_instructions
          });
        }
      } catch (error) {
        console.error('Error fetching clinic config:', error);
      }
    };

    if (clinicId) {
      fetchClinicConfig();
    }
  }, [clinicId]);

  return clinicConfig;
};
