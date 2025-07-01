
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountInfo, howDidYouHearOptions } from '@/types/signupTypes';

interface AccountInfoStepProps {
  accountInfo: AccountInfo;
  updateAccountInfo: (field: keyof AccountInfo, value: string) => void;
}

const AccountInfoStep = ({ accountInfo, updateAccountInfo }: AccountInfoStepProps) => {
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
    </>
  );
};

export default AccountInfoStep;
