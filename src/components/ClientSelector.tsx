
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Users, AlertCircle } from 'lucide-react';

interface ClientSelectorProps {
  clinics: any[];
  onUpdate: () => void;
}

const ClientSelector = ({ clinics, onUpdate }: ClientSelectorProps) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  const handleClientToggle = (clinicId: string) => {
    setSelectedClients(prev => 
      prev.includes(clinicId) 
        ? prev.filter(id => id !== clinicId)
        : [...prev, clinicId]
    );
  };

  const handleSelectAll = () => {
    const activeClinicIds = clinics
      .filter(clinic => clinic.subscription_status === 'active')
      .map(clinic => clinic.clinic_id);
    
    setSelectedClients(prev => 
      prev.length === activeClinicIds.length ? [] : activeClinicIds
    );
  };

  const handlePushUpdate = async () => {
    if (selectedClients.length === 0) {
      setUpdateStatus('Please select at least one client to update.');
      return;
    }

    setIsUpdating(true);
    setUpdateStatus('Pushing updates to selected clients...');

    try {
      // Update the database to mark these clients as having the latest version
      const { error } = await supabase
        .from('clinics')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .in('clinic_id', selectedClients);

      if (error) throw error;

      setUpdateStatus(`Successfully pushed updates to ${selectedClients.length} client(s)!`);
      setSelectedClients([]);
      onUpdate(); // Refresh the parent component
      
      // Clear status after 3 seconds
      setTimeout(() => setUpdateStatus(''), 3000);
      
    } catch (error) {
      console.error('Error pushing updates:', error);
      setUpdateStatus('Error pushing updates. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const activeClients = clinics.filter(clinic => clinic.subscription_status === 'active');
  const selectedCount = selectedClients.length;

  return (
    <Card className="p-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Deploy Updates to Clients</span>
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Select which clients should receive the latest chatbot updates. Only active subscriptions are shown.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedCount === activeClients.length ? 'Deselect All' : 'Select All Active'}
          </Button>
          
          <div className="text-sm text-gray-600">
            {selectedCount} of {activeClients.length} clients selected
          </div>
        </div>

        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-3">
            {activeClients.map((clinic) => (
              <div key={clinic.clinic_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <Checkbox
                  id={clinic.clinic_id}
                  checked={selectedClients.includes(clinic.clinic_id)}
                  onCheckedChange={() => handleClientToggle(clinic.clinic_id)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <label 
                      htmlFor={clinic.clinic_id}
                      className="font-medium text-sm cursor-pointer"
                    >
                      {clinic.name}
                    </label>
                    <Badge variant="default" className="text-xs">
                      {clinic.subscription_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {clinic.clinic_id} • {clinic.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {updateStatus && (
          <div className={`p-3 rounded-lg text-sm flex items-center space-x-2 ${
            updateStatus.includes('Error') || updateStatus.includes('Please select') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : updateStatus.includes('Successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {updateStatus.includes('Error') ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{updateStatus}</span>
          </div>
        )}

        <Button 
          onClick={handlePushUpdate}
          disabled={isUpdating || selectedClients.length === 0}
          className="w-full"
          size="lg"
        >
          {isUpdating ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Pushing Updates...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Push Updates to {selectedCount} Client{selectedCount !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
