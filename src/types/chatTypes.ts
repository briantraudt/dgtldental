
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface WidgetConfig {
  primaryColor?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  greeting?: string;
}

export interface ClinicConfig {
  clinic_id: string;
  name: string;
  address: string;
  phone: string;
  office_hours: string;
  services_offered: string[];
  insurance_accepted: string[];
  emergency_instructions: string;
  widget_config?: WidgetConfig;
}
