
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  websiteUrl: string;
  officeHours: string;
  servicesOffered: string;
  insuranceAccepted: string;
  emergencyInstructions: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    websiteUrl: '',
    officeHours: '',
    servicesOffered: '',
    insuranceAccepted: '',
    emergencyInstructions: ''
  });

  const handleInputChange = (field: keyof ClinicFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClinicId = (name: string): string => {
    const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-4);
    return `${cleaned.slice(0, 10)}-${timestamp}`;
  };

  const handleSubmitClinicInfo = async () => {
    setIsLoading(true);
    
    try {
      // Generate unique clinic ID
      const clinicId = generateClinicId(formData.name);
      
      // Parse services and insurance arrays
      const servicesArray = formData.servicesOffered.split(',').map(s => s.trim()).filter(s => s);
      const insuranceArray = formData.insuranceAccepted.split(',').map(s => s.trim()).filter(s => s);
      
      // Insert clinic data
      const { error: clinicError } = await supabase
        .from('clinics')
        .insert({
          clinic_id: clinicId,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website_url: formData.websiteUrl,
          office_hours: formData.officeHours,
          services_offered: servicesArray,
          insurance_accepted: insuranceArray,
          emergency_instructions: formData.emergencyInstructions,
          subscription_status: 'pending'
        });

      if (clinicError) throw clinicError;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          clinicId,
          clinicName: formData.name,
          email: formData.email
        }
      });

      if (error) throw error;

      toast({
        title: "Clinic registered successfully!",
        description: "Redirecting to secure payment..."
      });

      // Redirect to Stripe checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Error registering clinic:', error);
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
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
          <h1 className="text-3xl font-bold text-gray-900">Get Your AI Chat Widget</h1>
          <p className="text-gray-600 mt-2">Tell us about your practice to get started</p>
        </div>

        {/* Pricing Card */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">Premium Plan</h3>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$10</span>
                <span className="text-gray-600">/month</span>
              </div>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Clinic Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., DGTL Dental"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., 123 Main St, City, State 12345"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g., info@yourdental.com"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="e.g., https://yourdental.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="officeHours">Office Hours *</Label>
              <Input
                id="officeHours"
                value={formData.officeHours}
                onChange={(e) => handleInputChange('officeHours', e.target.value)}
                placeholder="e.g., Mon-Fri 8am-5pm, Sat 9am-1pm"
              />
            </div>

            <div>
              <Label htmlFor="servicesOffered">Services Offered *</Label>
              <Textarea
                id="servicesOffered"
                value={formData.servicesOffered}
                onChange={(e) => handleInputChange('servicesOffered', e.target.value)}
                placeholder="e.g., cleanings, crowns, Invisalign, dental implants (separate with commas)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="insuranceAccepted">Insurance Accepted *</Label>
              <Textarea
                id="insuranceAccepted"
                value={formData.insuranceAccepted}
                onChange={(e) => handleInputChange('insuranceAccepted', e.target.value)}
                placeholder="e.g., Delta Dental, MetLife, Cigna, Aetna (separate with commas)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="emergencyInstructions">Emergency Contact Instructions *</Label>
              <Textarea
                id="emergencyInstructions"
                value={formData.emergencyInstructions}
                onChange={(e) => handleInputChange('emergencyInstructions', e.target.value)}
                placeholder="What should patients do for dental emergencies?"
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitClinicInfo}
                disabled={!isFormValid() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Processing...' : 'Subscribe & Get Widget'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
