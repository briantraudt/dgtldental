
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClinicsListProps {
  clinics: any[];
}

const ClinicsList = ({ clinics }: ClinicsListProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">All Dental Practices</h3>
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{clinic.name}</h4>
                <Badge 
                  variant={clinic.subscription_status === 'active' ? 'default' : 'secondary'}
                >
                  {clinic.subscription_status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{clinic.address}</p>
              <p className="text-sm text-gray-600 mb-2">Phone: {clinic.phone}</p>
              <p className="text-sm text-gray-600 mb-2">Email: {clinic.email}</p>
              <p className="text-xs text-gray-500">
                Clinic ID: {clinic.clinic_id} | Created: {new Date(clinic.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ClinicsList;
