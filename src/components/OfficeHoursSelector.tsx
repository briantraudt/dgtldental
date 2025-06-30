
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface OfficeHoursData {
  [key: string]: {
    isOpen: boolean;
    startTime: string;
    endTime: string;
  };
}

interface OfficeHoursSelectorProps {
  value: OfficeHoursData;
  onChange: (value: OfficeHoursData) => void;
}

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const timeOptions = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
];

const OfficeHoursSelector: React.FC<OfficeHoursSelectorProps> = ({ value, onChange }) => {
  const handleDayToggle = (dayKey: string, isOpen: boolean) => {
    onChange({
      ...value,
      [dayKey]: {
        ...value[dayKey],
        isOpen,
        startTime: isOpen ? (value[dayKey]?.startTime || '8:00 AM') : '',
        endTime: isOpen ? (value[dayKey]?.endTime || '5:00 PM') : ''
      }
    });
  };

  const handleTimeChange = (dayKey: string, timeType: 'startTime' | 'endTime', time: string) => {
    onChange({
      ...value,
      [dayKey]: {
        ...value[dayKey],
        [timeType]: time
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Office Hours *</Label>
      <div className="space-y-3">
        {days.map((day) => {
          const dayData = value[day.key] || { isOpen: false, startTime: '', endTime: '' };
          
          return (
            <div key={day.key} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex items-center space-x-2 min-w-[120px]">
                <Checkbox
                  id={day.key}
                  checked={dayData.isOpen}
                  onCheckedChange={(checked) => handleDayToggle(day.key, checked as boolean)}
                />
                <Label htmlFor={day.key} className="font-medium">
                  {day.label}
                </Label>
              </div>
              
              {dayData.isOpen && (
                <div className="flex items-center space-x-2 flex-1">
                  <Select
                    value={dayData.startTime}
                    onValueChange={(time) => handleTimeChange(day.key, 'startTime', time)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-gray-500">to</span>
                  
                  <Select
                    value={dayData.endTime}
                    onValueChange={(time) => handleTimeChange(day.key, 'endTime', time)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {!dayData.isOpen && (
                <span className="text-gray-500 italic">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfficeHoursSelector;
