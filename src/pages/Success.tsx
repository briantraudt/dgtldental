
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, ExternalLink, Settings, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [embedCode, setEmbedCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  
  const clinicId = searchParams.get('clinic_id') || location.state?.clinicId;
  const clinicName = searchParams.get('clinic_name') || location.state?.clinicName;

  useEffect(() => {
    if (!clinicId || !clinicName) {
      navigate('/');
      return;
    }
    
    const code = `<script defer src="${window.location.origin}/widget.js" data-clinic-id="${clinicId}"></script>`;
    setEmbedCode(code);
    
    // Verify subscription status
    verifySubscription();
  }, [clinicId, clinicName, navigate]);

  const verifySubscription = async () => {
    try {
      // Get clinic email from the clinics table
      const { data: clinic, error: clinicError } = await supabase
        .from('clinics')
        .select('email')
        .eq('clinic_id', clinicId)
        .single();

      if (clinicError || !clinic) {
        throw new Error('Clinic not found');
      }

      // Check subscription status
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { email: clinic.email }
      });

      if (error) throw error;

      setSubscriptionActive(data.subscribed || false);
      
      if (data.subscribed) {
        // Update clinic subscription status
        await supabase
          .from('clinics')
          .update({ subscription_status: 'active' })
          .eq('clinic_id', clinicId);
      }
    } catch (error) {
      console.error('Error verifying subscription:', error);
      toast({
        title: "Verification Warning",
        description: "Could not verify subscription status. Your widget should still work.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the code",
        variant: "destructive"
      });
    }
  };

  if (!clinicId) {
    return null;
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your subscription...</h1>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {subscriptionActive ? 'Welcome to DGTL Chat!' : 'Registration Complete!'}
          </h1>
          <p className="text-xl text-gray-600">
            {subscriptionActive 
              ? 'Your AI chat widget is ready to go' 
              : 'Your widget is being set up'
            }
          </p>
          {subscriptionActive && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Subscription Active - Premium features enabled
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Custom Embed Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Copy this code and paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag:
              </p>
              
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                <code className="text-sm break-all">{embedCode}</code>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button 
                  onClick={() => window.open('/?clinic=' + clinicId, '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Widget
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Setup Complete ✅</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Practice information saved</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>AI assistant configured</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Embed code generated</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${subscriptionActive ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span>{subscriptionActive ? 'Premium subscription active' : 'Subscription being processed'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">1. Add to Your Website</h4>
                  <p className="text-sm text-gray-600">Paste the embed code into your site's HTML</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">2. Test the Widget</h4>
                  <p className="text-sm text-gray-600">Try asking questions to see how it responds</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">3. Monitor Performance</h4>
                  <p className="text-sm text-gray-600">Check back for analytics and updates</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  We're here to help you get the most out of your chat widget.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Practice Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
