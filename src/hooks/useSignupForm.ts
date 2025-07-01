
import { useState } from 'react';
import { AccountInfo, PracticeDetails } from '@/types/signupTypes';

export const useSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceWebsite: '',
    password: '',
    howDidYouHear: ''
  });

  const [practiceDetails, setPracticeDetails] = useState<PracticeDetails>({
    practiceName: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    practicePhone: '',
    officeEmail: '',
    officeHours: {},
    servicesOffered: [],
    insuranceAccepted: '',
    emergencyPolicy: '',
    practiceDescription: '',
    needInstallHelp: false
  });

  const updateAccountInfo = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePracticeDetails = (field: keyof PracticeDetails, value: any) => {
    setPracticeDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    accountInfo,
    practiceDetails,
    updateAccountInfo,
    updatePracticeDetails,
    handleNext,
    handleBack
  };
};
