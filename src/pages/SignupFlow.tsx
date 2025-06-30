
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Check, Zap, User, Building, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceWebsite: string;
  password: string;
  referralSource: string;
}

interface PracticeDetails {
  practiceName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  practicePhone: string;
  officeEmail: string;
  officeHours: string;
  servicesOffered: string[];
  insuranceAccepted: string;
  emergencyPolicy: string;
  practiceDescription: string;
  needsInstallHelp: boolean;
}

const SERVICES_OPTIONS = [
  'General Dentistry',
  'Cleanings & Preventive Care',
  'Fillings',
  'Crowns & Bridges',
  'Root Canal Therapy',
  'Extractions',
  'Dental Implants',
  'Invisalign/Orthodontics',
  'Teeth Whitening',
  'Cosmetic Dentistry',
  'Periodontal Treatment',
  'Oral Surgery',
  'Pediatric Dentistry',
  'Emergency Dental Care'
];

const REFERRAL_OPTIONS = [
  'Google Search',
  'Social Media',
  'Referral from Another Practice',
  'Industry Conference/Event',
  'Dental Publication',
  'Word of Mouth',
  'Online Advertisement',
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
    referralSource: ''
  });

  const [practiceDetails, setPracticeDetails] = useState<PracticeDetails>({
    practiceName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    practicePhone: '',
    officeEmail: '',
    officeHours: '',
    servicesOffered: [],
    insuranceAccepted: '',
    emergencyPolicy: '',
    practiceDescription: '',
    needsInstallHelp: false
  });

  const updateAccountInfo = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePracticeDetails = (field: keyof PracticeDetails, value: any) => {
    setPracticeDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setPracticeDetails(prev => ({
      ...prev,
      servicesOffered: checked
        ? [...prev.servicesOffered, service]
        : prev.servicesOffered.filter(s => s !== service)
    }));
  };

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'password'];
    return required.every(field => accountInfo[field as keyof AccountInfo].trim() !== '');
  };

  const validateStep2 = () => {
    const required = ['practiceName', 'streetAddress', 'city', 'state', 'zipCode', 'practicePhone', 'officeEmail', 'officeHours', 'emergencyPolicy'];
    return required.every(field => practiceDetails[field as keyof PracticeDetails].toString().trim() !== '') &&
           practiceDetails.servicesOffered.length > 0;
  };

  const generateClinicId = (name: string): string => {
    const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-4);
    return `${cleaned.slice(0, 10)}-${timestamp}`;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountInfo.email,
        password: accountInfo.password,
        options: {
          emailRedirectTo: `${window.location.origin}/success`
        }
      });

      if (authError) throw authError;

      // Generate unique clinic ID
      const clinicId = generateClinicId(practiceDetails.practiceName);
      
      // Prepare clinic data
      const clinicData = {
        clinic_id: clinicId,
        name: practiceDetails.practiceName,
        address: `${practiceDetails.streetAddress}, ${practiceDetails.city}, ${practiceDetails.state} ${practiceDetails.zipCode}`,
        phone: practiceDetails.practicePhone,
        email: practiceDetails.officeEmail,
        website_url: accountInfo.practiceWebsite,
        office_hours: practiceDetails.officeHours,
        services_offered: practiceDetails.servicesOffered,
        insurance_accepted: practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(s => s),
        emergency_instructions: practiceDetails.emergencyPolicy,
        subscription_status: 'pending',
        practice_description: practiceDetails.practiceDescription,
        owner_name: `${accountInfo.firstName} ${accountInfo.lastName}`,
        owner_phone: accountInfo.phone,
        referral_source: accountInfo.referralSource,
        needs_install_help: practiceDetails.needsInstallHelp
      };

      // Insert clinic data
      const { error: clinicError } = await supabase
        .from('clinics')
        .insert(clinicData);

      if (clinicError) throw clinicError;

      // Calculate total amount (base $10 + optional $100 setup fee)
      const baseAmount = 1000; // $10.00 in cents
      const setupFee = practiceDetails.needsInstallHelp ? 10000 : 0; // $100.00 in cents
      const totalAmount = baseAmount + setupFee;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          clinicId,
          clinicName: practiceDetails.practiceName,
          email: accountInfo.email,
          setupFee: practiceDetails.needsInstallHelp,
          totalAmount
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Redirecting to secure payment..."
      });

      // Redirect to Stripe checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        title: "Signup failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step < currentStep ? 'bg-blue-600 text-white' :
              step === currentStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < 3 && <div className={`w-16 h-0.5 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="grid md:grid-cols-2 gap-4">
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
          <Label>How did you hear about us?</Label>
          <RadioGroup
            value={accountInfo.referralSource}
            onValueChange={(value) => updateAccountInfo('referralSource', value)}
            className="mt-2"
          >
            {REFERRAL_OPTIONS.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Practice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="practiceName">Practice Name *</Label>
          <Input
            id="practiceName"
            value={practiceDetails.practiceName}
            onChange={(e) => updatePracticeDetails('practiceName', e.target.value)}
            placeholder="Smith Family Dentistry"
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
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              value={practiceDetails.zipCode}
              onChange={(e) => updatePracticeDetails('zipCode', e.target.value)}
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

        <div>
          <Label htmlFor="officeHours">Office Hours *</Label>
          <Textarea
            id="officeHours"
            value={practiceDetails.officeHours}
            onChange={(e) => updatePracticeDetails('officeHours', e.target.value)}
            placeholder="Mon-Fri: 8am-5pm, Sat: 9am-2pm, Sun: Closed"
            rows={2}
          />
        </div>

        <div>
          <Label>Services Offered * (Select all that apply)</Label>
          <div className="grid md:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
            {SERVICES_OPTIONS.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={practiceDetails.servicesOffered.includes(service)}
                  onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                />
                <Label htmlFor={service} className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="insuranceAccepted">Insurance Accepted</Label>
          <Textarea
            id="insuranceAccepted"
            value={practiceDetails.insuranceAccepted}
            onChange={(e) => updatePracticeDetails('insuranceAccepted', e.target.value)}
            placeholder="Delta Dental, MetLife, Cigna, Aetna (separate with commas)"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="emergencyPolicy">Emergency Policy / After-Hours Instructions *</Label>
          <Textarea
            id="emergencyPolicy"
            value={practiceDetails.emergencyPolicy}
            onChange={(e) => updatePracticeDetails('emergencyPolicy', e.target.value)}
            placeholder="For dental emergencies, call our after-hours line at (555) 123-HELP or visit the nearest emergency room."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="practiceDescription">Short Practice Description</Label>
          <Textarea
            id="practiceDescription"
            value={practiceDetails.practiceDescription}
            onChange={(e) => updatePracticeDetails('practiceDescription', e.target.value)}
            placeholder="Family-friendly dental practice serving the Austin community for over 20 years..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="needsInstallHelp"
            checked={practiceDetails.needsInstallHelp}
            onCheckedChange={(checked) => updatePracticeDetails('needsInstallHelp', checked)}
          />
          <Label htmlFor="needsInstallHelp">
            Do you need help installing the widget? (+$100 one-time setup fee)
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment & Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-2xl font-bold text-gray-900">Your Plan</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Premium AI Chatbot</span>
              <span className="font-semibold">$10/month</span>
            </div>
            {practiceDetails.needsInstallHelp && (
              <div className="flex justify-between items-center">
                <span>Setup & Installation Help</span>
                <span className="font-semibold">$100 one-time</span>
              </div>
            )}
            <hr className="border-blue-200" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Today</span>
              <span>${practiceDetails.needsInstallHelp ? '110' : '10'}</span>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div>
          <h4 className="font-semibold mb-3">What's Included:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Unlimited AI conversations</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>24/7 patient support</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Custom practice information</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Easy website integration</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Mobile-responsive design</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Analytics & insights</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Order Summary:</h4>
          <div className="text-sm space-y-1">
            <div><strong>Practice:</strong> {practiceDetails.practiceName}</div>
            <div><strong>Email:</strong> {accountInfo.email}</div>
            <div><strong>Setup Help:</strong> {practiceDetails.needsInstallHelp ? 'Yes (+$100)' : 'No'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Get Your AI Chat Widget
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Account Information' :
              currentStep === 2 ? 'Practice Details' :
              'Payment & Subscription'
            }
          </p>
        </div>

        {renderProgressIndicator()}

        <div className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

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
                {isLoading ? 'Processing...' : `Complete Payment ($${practiceDetails.needsInstallHelp ? '110' : '10'})`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
