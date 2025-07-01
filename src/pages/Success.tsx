
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, ExternalLink, Settings, Loader2, RefreshCw } from 'lucide-react';
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
  const [isCopying, setIsCopying] = useState(false);
  
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
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = embedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } finally {
      setIsCopying(false);
    }
  };

  const refreshSubscription = async () => {
    setIsVerifying(true);
    await verifySubscription();
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {subscriptionActive ? 'Welcome to DGTL Chat!' : 'Registration Complete!'}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {subscriptionActive 
              ? `Your AI chat widget for ${clinicName} is ready to go` 
              : 'Your widget is being set up'
            }
          </p>
          {subscriptionActive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Subscription Active - Premium features enabled</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshSubscription}
                className="h-6 w-6 p-0 ml-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Main Embed Code Card */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl text-blue-900">Your Personalized Chat Widget Code</CardTitle>
              <p className="text-blue-700">Copy and paste this code into your website's HTML (before the closing &lt;/body&gt; tag)</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 relative group">
                <code className="text-sm break-all font-mono leading-relaxed block pr-12">
                  {embedCode}
                </code>
                <Button
                  onClick={copyToClipboard}
                  disabled={isCopying}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="secondary"
                >
                  {isCopying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={copyToClipboard} disabled={isCopying} className="flex-1">
                  {isCopying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Copying...
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => window.open('/?clinic=' + clinicId, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Widget
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Setup Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Setup Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Practice information saved</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">AI assistant configured</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Personalized embed code generated</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${subscriptionActive ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span className="text-sm">{subscriptionActive ? 'Premium subscription active' : 'Subscription being processed'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1 text-sm">1. Add to Your Website</h4>
                  <p className="text-xs text-gray-600">Paste the embed code into your site's HTML</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">2. Test the Widget</h4>
                  <p className="text-xs text-gray-600">Try asking questions to see how it responds</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">3. Access Your Portal</h4>
                  <p className="text-xs text-gray-600">Bookmark this page or log in anytime to manage your widget</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Access Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">Important: Save Your Access Information</h3>
                <div className="bg-white p-4 rounded-lg mb-4 border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Clinic ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{clinicId}</code>
                  </p>
                  <p className="text-sm text-gray-700">
                    To access your widget code and portal later, visit: <br />
                    <a href={`${window.location.origin}/portal?clinic=${clinicId}`} className="text-blue-600 hover:underline font-mono text-xs">
                      {window.location.origin}/portal?clinic={clinicId}
                    </a>
                  </p>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Bookmark the portal link above to easily access your embed code and manage your widget settings.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => navigate(`/portal?clinic=${clinicId}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Go to Portal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
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
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/portal?clinic=${clinicId}`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="mr-4"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => navigate(`/portal?clinic=${clinicId}`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Access Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
