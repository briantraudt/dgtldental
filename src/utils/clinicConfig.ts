
import { ClinicConfig } from '@/types/chatTypes';

// Demo clinic configuration for marketing page
export const DEMO_CLINIC_CONFIG: ClinicConfig = {
  clinic_id: 'demo-clinic-123',
  name: 'Demo Dental Practice',
  address: '123 Demo Street, Demo City, DC 12345',
  phone: '(555) 123-DEMO',
  office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
  services_offered: [
    'General Dentistry',
    'Dental Cleanings',
    'Fillings',
    'Crowns',
    'Root Canals',
    'Teeth Whitening',
    'Dental Implants',
    'Orthodontics'
  ],
  insurance_accepted: [
    'Most Major Insurance Plans',
    'Delta Dental',
    'Aetna',
    'Cigna',
    'MetLife'
  ],
  emergency_instructions: 'For dental emergencies after hours, please call our main number and follow the prompts for emergency care.'
};
