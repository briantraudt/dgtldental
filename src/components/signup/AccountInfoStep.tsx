
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountInfo, howDidYouHearOptions } from '@/types/signupTypes';

interface AccountInfoStepProps {
  accountInfo: AccountInfo;
  updateAccountInfo: (field: keyof AccountInfo, value: string) => void;
}

const AccountInfoStep = ({ accountInfo, updateAccountInfo }: AccountInfoStepProps) => {
  const [websiteError, setWebsiteError] = useState('');

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return '';
    
    // Remove any whitespace
    url = url.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (url && !url.match(/^https?:\/\//)) {
      url = 'https://' + url;
    }
    
    return url;
  };

  const validateWebsiteUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    
    try {
      const formattedUrl = formatWebsiteUrl(url);
      new URL(formattedUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleWebsiteChange = (value: string) => {
    const isValid = validateWebsiteUrl(value);
    
    if (!isValid && value.trim()) {
      setWebsiteError('Please enter a valid website URL (e.g., yoursite.com or https://yoursite.com)');
    } else {
      setWebsiteError('');
    }
    
    updateAccountInfo('practiceWebsite', value);
  };

  const handleWebsiteBlur = () => {
    if (accountInfo.practiceWebsite && !websiteError) {
      const formatted = formatWebsiteUrl(accountInfo.practiceWebsite);
      updateAccountInfo('practiceWebsite', formatted);
    }
  };

  return (
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
          onChange={(e) => handleWebsiteChange(e.target.value)}
          onBlur={handleWebsiteBlur}
          placeholder="www.smithdental.com"
          className={websiteError ? 'border-red-500' : ''}
        />
        {websiteError && (
          <p className="text-sm text-red-500 mt-1">{websiteError}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Enter your website URL (we'll automatically add https:// if needed)
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
  );
};

export default AccountInfoStep;
