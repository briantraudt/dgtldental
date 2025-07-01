
export const generateClinicId = (name: string): string => {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const timestamp = Date.now().toString().slice(-4);
  return `${cleaned.slice(0, 10)}-${timestamp}`;
};

export const formatOfficeHours = (officeHours: any): string => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const openDays = days
    .map((day, index) => {
      const dayData = officeHours[day];
      if (dayData?.isOpen && dayData.startTime && dayData.endTime) {
        return `${dayNames[index]} ${dayData.startTime}-${dayData.endTime}`;
      }
      return null;
    })
    .filter(Boolean);
  
  return openDays.length > 0 ? openDays.join(', ') : 'Hours not specified';
};

export const isStep1Valid = (accountInfo: any): boolean => {
  return accountInfo.firstName && accountInfo.lastName && accountInfo.email && accountInfo.password;
};

export const isStep2Valid = (practiceDetails: any): boolean => {
  const hasOfficeHours = Object.values(practiceDetails.officeHours).some((day: any) => day?.isOpen);
  return practiceDetails.practiceName && practiceDetails.streetAddress && 
         practiceDetails.city && practiceDetails.state && practiceDetails.zip &&
         practiceDetails.practicePhone && practiceDetails.officeEmail && 
         hasOfficeHours && practiceDetails.servicesOffered.length > 0 &&
         practiceDetails.insuranceAccepted && practiceDetails.emergencyPolicy;
};
