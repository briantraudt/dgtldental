
export interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceWebsite: string;
  password: string;
  howDidYouHear: string;
}

export interface PracticeDetails {
  practiceName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  practicePhone: string;
  officeEmail: string;
  officeHours: any;
  servicesOffered: string[];
  insuranceAccepted: string;
  emergencyPolicy: string;
  practiceDescription: string;
  needInstallHelp: boolean;
}

export const servicesOptions = [
  'General Cleanings',
  'Crowns & Bridges',
  'Dental Implants',
  'Invisalign',
  'Root Canals',
  'Extractions',
  'Cosmetic Dentistry',
  'Periodontal Treatment',
  'Pediatric Dentistry',
  'Emergency Dental Care'
];

export const insuranceOptions = [
  'Delta Dental',
  'Cigna Dental',
  'Aetna Dental',
  'UnitedHealthcare Dental',
  'MetLife Dental',
  'Guardian Dental',
  'Humana Dental',
  'Blue Cross Blue Shield',
  'Ameritas',
  'Principal Financial Group'
];

export const howDidYouHearOptions = [
  'Google Search',
  'Social Media',
  'Referral from Colleague',
  'Dental Conference',
  'Online Ad',
  'Other'
];
