import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, User, Building, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import OfficeHoursSelector from '@/components/OfficeHoursSelector';

interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceWebsite: string;
  password: string;
  howDidYouHear: string;
}

interface PracticeDetails {
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

const servicesOptions = [
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

const insuranceOptions = [
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

const howDidYouHearOptions = [
  'Google Search',
  'Social Media',
  'Referral from Colleague',
  'Dental Conference',
  'Online Ad',
  'Other'
];

const SignupFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const toggleService = (service: string) => {
    setPracticeDetails(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service]
    }));
  };

  const toggleInsurance = (insurance: string) => {
    const currentInsurance = practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(Boolean);
    
    if (currentInsurance.includes(insurance)) {
      const updatedInsurance = currentInsurance.filter(i => i !== insurance);
      setPracticeDetails(prev => ({
        ...prev,
        insuranceAccepted: updatedInsurance.join(', ')
      }));
    } else {
      const updatedInsurance = [...currentInsurance, insurance];
      setPracticeDetails(prev => ({
        ...prev,
        insuranceAccepted: updatedInsurance.join(', ')
      }));
    }
  };

  const handleOtherInsuranceChange = (value: string) => {
    const currentInsurance = practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(Boolean);
    const predefinedInsurance = currentInsurance.filter(i => insuranceOptions.includes(i));
    
    if (value.trim()) {
      const updatedInsurance = [...predefinedInsurance, value.trim()];
      setPracticeDetails(prev => ({
        ...prev,
        insuranceAccepted: updatedInsurance.join(', ')
      }));
    } else {
      setPracticeDetails(prev => ({
        ...prev,
        insuranceAccepted: predefinedInsurance.join(', ')
      }));
    }
  };

  const formatOfficeHours = (officeHours: any): string => {
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

  const isStep1Valid = () => {
    return accountInfo.firstName && accountInfo.lastName && accountInfo.email && accountInfo.password;
  };

  const isStep2Valid = () => {
    const hasOfficeHours = Object.values(practiceDetails.officeHours).some((day: any) => day?.isOpen);
    return practiceDetails.practiceName && practiceDetails.streetAddress && 
           practiceDetails.city && practiceDetails.state && practiceDetails.zip &&
           practiceDetails.practicePhone && practiceDetails.officeEmail && 
           hasOfficeHours && practiceDetails.servicesOffered.length > 0 &&
           practiceDetails.insuranceAccepted && practiceDetails.emergencyPolicy;
  };

  const generateClinicId = (name: string): string => {
    const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-4);
    return `${cleaned.slice(0, 10)}-${timestamp}`;
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

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Generate unique clinic ID
      const clinicId = generateClinicId(practiceDetails.practiceName);
      
      // Format office hours for storage
      const formattedOfficeHours = formatOfficeHours(practiceDetails.officeHours);
      
      // Insert clinic data
      const { error: clinicError } = await supabase
        .from('clinics')
        .insert({
          clinic_id: clinicId,
          name: practiceDetails.practiceName,
          address: `${practiceDetails.streetAddress}, ${practiceDetails.city}, ${practiceDetails.state} ${practiceDetails.zip}`,
          phone: practiceDetails.practicePhone,
          email: practiceDetails.officeEmail,
          website_url: accountInfo.practiceWebsite,
          office_hours: formattedOfficeHours,
          services_offered: practiceDetails.servicesOffered,
          insurance_accepted: practiceDetails.insuranceAccepted.split(',').map(s => s.trim()),
          emergency_instructions: practiceDetails.emergencyPolicy,
          subscription_status: 'pending'
        });

      if (clinicError) throw clinicError;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          clinicId,
          clinicName: practiceDetails.practiceName,
          email: accountInfo.email,
          accountInfo,
          practiceDetails: {
            ...practiceDetails,
            officeHours: formattedOfficeHours
          },
          needInstallHelp: practiceDetails.needInstallHelp
        }
      });

      if (error) throw error;

      toast({
        title: "Practice registered successfully!",
        description: "Redirecting to secure payment..."
      });

      // Redirect to Stripe checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Error processing signup:', error);
      toast({
        title: "Signup failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    if (step === 1) return <User className="h-5 w-5" />;
    if (step === 2) return <Building className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  const getStepTitle = (step: number) => {
    if (step === 1) return "Account Information";
    if (step === 2) return "Practice Details";
    return "Payment & Setup";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Step {currentStep} of 3: {getStepTitle(currentStep)}
            </h1>
            <p className="text-gray-600 mt-2">
              {currentStep === 1 && "Let's start with your basic information"}
              {currentStep === 2 && "Tell us about your dental practice"}
              {currentStep === 3 && "Complete your subscription"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStepIcon(currentStep)}
              <span className="ml-2">{getStepTitle(currentStep)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={accountInfo.firstName}
                      onChange={(e) => updateAccountInfo('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={accountInfo.lastName}
                      onChange={(e) => updateAccountInfo('lastName', e.target.value)}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountInfo.email}
                    onChange={(e) => updateAccountInfo('email', e.target.value)}
                    placeholder="john@smithdental.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={accountInfo.phone}
                    onChange={(e) => updateAccountInfo('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="practiceWebsite">Practice Website</Label>
                  <Input
                    id="practiceWebsite"
                    value={accountInfo.practiceWebsite}
                    onChange={(e) => updateAccountInfo('practiceWebsite', e.target.value)}
                    placeholder="https://smithdental.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={accountInfo.password}
                    onChange={(e) => updateAccountInfo('password', e.target.value)}
                    placeholder="Create a secure password"
                  />
                </div>

                <div>
                  <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                  <Select value={accountInfo.howDidYouHear} onValueChange={(value) => updateAccountInfo('howDidYouHear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {howDidYouHearOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Practice Details */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label htmlFor="practiceName">Practice Name *</Label>
                  <Input
                    id="practiceName"
                    value={practiceDetails.practiceName}
                    onChange={(e) => updatePracticeDetails('practiceName', e.target.value)}
                    placeholder="Smith Family Dental"
                  />
                </div>

                <div>
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input
                    id="streetAddress"
                    value={practiceDetails.streetAddress}
                    onChange={(e) => updatePracticeDetails('streetAddress', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={practiceDetails.city}
                      onChange={(e) => updatePracticeDetails('city', e.target.value)}
                      placeholder="Austin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={practiceDetails.state}
                      onChange={(e) => updatePracticeDetails('state', e.target.value)}
                      placeholder="TX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip Code *</Label>
                    <Input
                      id="zip"
                      value={practiceDetails.zip}
                      onChange={(e) => updatePracticeDetails('zip', e.target.value)}
                      placeholder="78701"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="practicePhone">Practice Phone *</Label>
                    <Input
                      id="practicePhone"
                      value={practiceDetails.practicePhone}
                      onChange={(e) => updatePracticeDetails('practicePhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="officeEmail">Office Email *</Label>
                    <Input
                      id="officeEmail"
                      type="email"
                      value={practiceDetails.officeEmail}
                      onChange={(e) => updatePracticeDetails('officeEmail', e.target.value)}
                      placeholder="info@smithdental.com"
                    />
                  </div>
                </div>

                <OfficeHoursSelector
                  value={practiceDetails.officeHours}
                  onChange={(hours) => updatePracticeDetails('officeHours', hours)}
                />

                <div>
                  <Label>Services Offered * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {servicesOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={practiceDetails.servicesOffered.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label htmlFor={service} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Insurance Accepted * (Select all that apply)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {insuranceOptions.map((insurance) => {
                      const currentInsurance = practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(Boolean);
                      return (
                        <div key={insurance} className="flex items-center space-x-2">
                          <Checkbox
                            id={insurance}
                            checked={currentInsurance.includes(insurance)}
                            onCheckedChange={() => toggleInsurance(insurance)}
                          />
                          <Label htmlFor={insurance} className="text-sm">
                            {insurance}
                          </Label>
                        </div>
                      );
                    })}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="other-insurance"
                        checked={false}
                        disabled
                      />
                      <Label htmlFor="other-insurance" className="text-sm">
                        Other:
                      </Label>
                      <Input
                        placeholder="Enter other insurance carriers"
                        onChange={(e) => handleOtherInsuranceChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyPolicy">Emergency Policy / After-Hours Instructions *</Label>
                  <Textarea
                    id="emergencyPolicy"
                    value={practiceDetails.emergencyPolicy}
                    onChange={(e) => updatePracticeDetails('emergencyPolicy', e.target.value)}
                    placeholder="For dental emergencies after hours, call (555) 123-4567 and follow the prompts..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="practiceDescription">Short Practice Description</Label>
                  <Textarea
                    id="practiceDescription"
                    value={practiceDetails.practiceDescription}
                    onChange={(e) => updatePracticeDetails('practiceDescription', e.target.value)}
                    placeholder="A family-friendly dental practice serving the Austin community for over 20 years..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needInstallHelp"
                    checked={practiceDetails.needInstallHelp}
                    onCheckedChange={(checked) => updatePracticeDetails('needInstallHelp', checked)}
                  />
                  <Label htmlFor="needInstallHelp">
                    Do you need help installing the AI Assistant on your website? (+$100 one-time setup fee)
                  </Label>
                </div>
              </>
            )}

            {/* Step 3: Payment Summary */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-xl font-semibold mb-4">Subscription Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Subscription</span>
                      <span className="font-semibold">$10.00/month</span>
                    </div>
                    
                    {practiceDetails.needInstallHelp && (
                      <div className="flex justify-between">
                        <span>One-time Setup Fee</span>
                        <span className="font-semibold">$100.00</span>
                      </div>
                    )}
                    
                    <hr className="my-2" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Today</span>
                      <span>${practiceDetails.needInstallHelp ? '110.00' : '10.00'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ 24/7 AI-powered patient support</li>
                    <li>✓ Custom training on your practice information</li>
                    <li>✓ Unlimited patient conversations</li>
                    <li>✓ Easy website integration</li>
                    <li>✓ Mobile-responsive design</li>
                    {practiceDetails.needInstallHelp && (
                      <li>✓ Professional installation and setup</li>
                    )}
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Click below to complete your subscription with Stripe's secure checkout.
                    You can cancel anytime - no long-term contracts.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline"
                onClick={currentStep === 1 ? () => navigate('/') : handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Processing...' : 'Complete Payment'}
                  <CreditCard className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupFlow;
