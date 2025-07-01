
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<{ name: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const clinicId = searchParams.get('clinic_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchClinicData = async () => {
      if (!clinicId) {
        console.log('No clinic_id provided, redirecting to home');
        navigate('/');
        return;
      }

      try {
        console.log('Fetching clinic data for ID:', clinicId);
        const { data: clinicData, error } = await supabase
          .from('clinics')
          .select('name, clinic_id')
          .eq('clinic_id', clinicId)
          .single();

        if (error) {
          console.error('Error fetching clinic:', error);
          toast({
            title: "Error",
            description: "Could not load clinic information",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (clinicData) {
          setClinic({ name: clinicData.name, id: clinicData.clinic_id });
          console.log('Clinic data loaded:', clinicData);
        } else {
          console.log('No clinic found, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, [clinicId, navigate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Widget code copied to clipboard"
    });
  };

  const widgetCode = clinic ? `<script>
  window.dgtlConfig = {
    clinicId: '${clinic.id}'
  };
</script>
<script src="${window.location.origin}/widget.js"></script>` : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clinic) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to DGTL Chat!
          </h1>
          <p className="text-xl text-gray-600">
            Your subscription is active for <strong>{clinic.name}</strong>
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copy className="h-5 w-5 mr-2" />
                Installation Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{widgetCode}</pre>
              </div>
              <Button 
                onClick={() => copyToClipboard(widgetCode)}
                className="mt-4 w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Install the Widget</h3>
                <p className="text-gray-600 text-sm">
                  Add the code to your website and the chat widget will appear in the bottom right corner.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Test Your Widget</h3>
                <p className="text-gray-600 text-sm">
                  Visit your website and try asking questions about your practice to see the AI in action.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Customize (Optional)</h3>
                <p className="text-gray-600 text-sm">
                  Contact us if you need help customizing the widget's appearance or responses.
                </p>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={() => window.open(`/embed-demo?clinic=${clinic.id}`, '_blank')}
                  variant="outline" 
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Your Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')} size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
