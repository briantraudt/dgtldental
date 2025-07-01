
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PracticeDetails, servicesOptions, insuranceOptions } from '@/types/signupTypes';
import OfficeHoursSelector from '@/components/OfficeHoursSelector';

interface PracticeDetailsStepProps {
  practiceDetails: PracticeDetails;
  updatePracticeDetails: (field: keyof PracticeDetails, value: any) => void;
}

const PracticeDetailsStep = ({ practiceDetails, updatePracticeDetails }: PracticeDetailsStepProps) => {
  const [otherService, setOtherService] = useState('');

  const toggleService = (service: string) => {
    updatePracticeDetails('servicesOffered', 
      practiceDetails.servicesOffered.includes(service)
        ? practiceDetails.servicesOffered.filter(s => s !== service)
        : [...practiceDetails.servicesOffered, service]
    );
  };

  const handleOtherServiceChange = (value: string) => {
    setOtherService(value);
    
    // Remove any existing "other" services first
    const existingServices = practiceDetails.servicesOffered.filter(s => !s.startsWith('Other: '));
    
    if (value.trim()) {
      updatePracticeDetails('servicesOffered', [...existingServices, `Other: ${value.trim()}`]);
    } else {
      updatePracticeDetails('servicesOffered', existingServices);
    }
  };

  const toggleInsurance = (insurance: string) => {
    const currentInsurance = practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(Boolean);
    
    if (currentInsurance.includes(insurance)) {
      const updatedInsurance = currentInsurance.filter(i => i !== insurance);
      updatePracticeDetails('insuranceAccepted', updatedInsurance.join(', '));
    } else {
      const updatedInsurance = [...currentInsurance, insurance];
      updatePracticeDetails('insuranceAccepted', updatedInsurance.join(', '));
    }
  };

  const handleOtherInsuranceChange = (value: string) => {
    const currentInsurance = practiceDetails.insuranceAccepted.split(',').map(s => s.trim()).filter(Boolean);
    const predefinedInsurance = currentInsurance.filter(i => insuranceOptions.includes(i));
    
    if (value.trim()) {
      const updatedInsurance = [...predefinedInsurance, value.trim()];
      updatePracticeDetails('insuranceAccepted', updatedInsurance.join(', '));
    } else {
      updatePracticeDetails('insuranceAccepted', predefinedInsurance.join(', '));
    }
  };

  return (
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
  );
};

export default PracticeDetailsStep;
