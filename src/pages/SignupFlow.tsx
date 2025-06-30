
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Check, Clock, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import OfficeHoursSelector from '@/components/OfficeHoursSelector';

const SignupFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    practiceName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    practiceType: '',
    services: '',
    officeHours: {},
    specialInstructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Practice Information */}
          {currentStep === 1 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Tell Us About Your Practice
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  We'll use this information to customize your AI assistant
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="practiceName">Practice Name *</Label>
                    <Input
                      id="practiceName"
                      value={formData.practiceName}
                      onChange={(e) => handleInputChange('practiceName', e.target.value)}
                      placeholder="Smile Dental Care"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="practiceType">Practice Type *</Label>
                    <Input
                      id="practiceType"
                      value={formData.practiceType}
                      onChange={(e) => handleInputChange('practiceType', e.target.value)}
                      placeholder="General Dentistry, Orthodontics, etc."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Dr. Smith"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="doctor@practice.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="www.yourpractice.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Practice Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Anytown"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="CA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="12345"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Services & Hours */}
          {currentStep === 2 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Services & Operating Hours
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  Help your AI assistant provide accurate information about your services
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    placeholder="Cleanings, Fillings, Crowns, Root Canals, Cosmetic Dentistry, etc."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Office Hours</Label>
                  <p className="text-sm text-slate-600 mb-4">
                    Set your practice hours so patients know when you're available
                  </p>
                  <OfficeHoursSelector
                    value={formData.officeHours}
                    onChange={(hours) => handleInputChange('officeHours', hours)}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customization */}
          {currentStep === 3 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Final Customization
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  Any special instructions or information for your AI assistant?
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Any specific policies, procedures, or information you'd like your AI assistant to know about your practice..."
                    className="mt-1 min-h-[120px]"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Examples: Insurance policies, emergency procedures, appointment policies, etc.
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-slate-900 mb-2">Setup Summary</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p><strong>Practice:</strong> {formData.practiceName}</p>
                    <p><strong>Contact:</strong> {formData.contactName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Link to="/success">
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                      Complete Setup <Check className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Section - Only show on step 1 */}
        {currentStep === 1 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
                <p className="text-slate-600">Your AI assistant never sleeps, handling patient inquiries around the clock.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Patient-Focused</h3>
                <p className="text-slate-600">Trained specifically for dental practices to provide accurate, helpful responses.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-slate-600">Built with privacy and security in mind to protect patient information.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupFlow;
