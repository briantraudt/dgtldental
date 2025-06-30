import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, User, Building, CreditCard, Bot, Code, Star } from 'lucide-react';
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
  const [otherService, setOtherService] = useState('');
  
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

  const handleOtherServiceChange = (value: string) => {
    setOtherService(value);
    
    // Remove any existing "other" services first
    const existingServices = practiceDetails.servicesOffered.filter(s => !s.startsWith('Other: '));
    
    if (value.trim()) {
      setPracticeDetails(prev => ({
        ...prev,
        servicesOffered: [...existingServices, `Other: ${value.trim()}`]
      }));
    } else {
      setPracticeDetails(prev => ({
        ...prev,
        servicesOffered: existingServices
      }));
    }
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

      if (clinicError) {
        console.error('Clinic insertion error:', clinicError);
        throw clinicError;
      }

      console.log('Clinic data inserted successfully');

      // Create Stripe checkout session with proper data structure
      const checkoutData = {
        clinicId,
        accountInfo,
        practiceDetails: {
          ...practiceDetails,
          practiceName: practiceDetails.practiceName,
          officeHours: formattedOfficeHours
        },
        needInstallHelp: practiceDetails.needInstallHelp
      };

      console.log('Sending checkout data:', checkoutData);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: checkoutData
      });

      if (error) {
        console.error('Checkout creation error:', error);
        throw error;
      }

      console.log('Checkout session created:', data);

      toast({
        title: "Practice registered successfully!",
        description: "Redirecting to secure payment..."
      });

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error processing signup:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
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

  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup-section');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Enhanced How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Start in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Launch your 24/7 dental assistant in minutes—no tech skills or long setup required.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6 pb-4 px-4 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="absolute top-4 left-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Up</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Enter your details to personalize your AI assistant. No contract, no setup headaches.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50/50 to-white/90 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6 pb-4 px-4 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <div className="absolute top-4 left-4 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Code className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Install Widget</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Just copy/paste one line of code—or we'll do it for you.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-white/90 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6 pb-4 px-4 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <div className="absolute top-4 left-4 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Bot className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Go Live</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Start handling patient questions, appointments, and FAQs automatically—24/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Signup Form Section - Single Column Layout */}
        <div id="signup-section" className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Step {currentStep} of 3: {getStepTitle(currentStep)}
            </h1>
            {/* Enhanced subheadline */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
                  Get started in minutes. No tech skills needed, no long-term contracts.
                </p>
              </div>
            )}
            {currentStep === 2 && (
              <p className="text-gray-600 mt-2">
                Tell us about your dental practice
              </p>
            )}
            {currentStep === 3 && (
              <p className="text-gray-600 mt-2">
                Complete your subscription
              </p>
            )}
          </div>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                {/* Friendly branding element */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span>{getStepTitle(currentStep)}</span>
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
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={accountInfo.lastName}
                        onChange={(e) => updateAccountInfo('lastName', e.target.value)}
                        placeholder="Smith"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={accountInfo.phone}
                      onChange={(e) => updateAccountInfo('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="practiceWebsite">Practice Website</Label>
                    <Input
                      id="practiceWebsite"
                      value={accountInfo.practiceWebsite}
                      onChange={(e) => updateAccountInfo('practiceWebsite', e.target.value)}
                      placeholder="https://smithdental.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll use this to personalize your AI assistant.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={accountInfo.password}
                      onChange={(e) => updateAccountInfo('password', e.target.value)}
                      placeholder="Create a secure password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters. Use a strong password for account security.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                    <Select value={accountInfo.howDidYouHear} onValueChange={(value) => updateAccountInfo('howDidYouHear', value)}>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
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

                  {/* Trust-building testimonial */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          "We booked 12 more new patients in our first week."
                        </p>
                        <p className="text-xs text-gray-600">
                          — Dr. Lopez, Smile Dental, Austin, TX
                        </p>
                      </div>
                    </div>
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
                      <div className="col-span-2 flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="other-service"
                          checked={otherService.trim() !== ''}
                          disabled
                        />
                        <Label htmlFor="other-service" className="text-sm">
                          Other:
                        </Label>
                        <Input
                          placeholder="Enter other services"
                          value={otherService}
                          onChange={(e) => handleOtherServiceChange(e.target.value)}
                          className="flex-1"
                        />
                      </div>
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

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline"
                  onClick={currentStep === 1 ? () => navigate('/') : handleBack}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                
                {currentStep < 3 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                    className={`bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
                      (currentStep === 1 ? isStep1Valid() : isStep2Valid()) 
                        ? 'hover:scale-105 shadow-lg' 
                        : ''
                    }`}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                    {(currentStep === 1 ? isStep1Valid() : isStep2Valid()) && (
                      <Check className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
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
    </div>
  );
};

export default SignupFlow;
