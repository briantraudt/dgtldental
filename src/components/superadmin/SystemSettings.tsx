
import { Card } from '@/components/ui/card';

const SystemSettings = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">System Settings</h3>
      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Staging vs Production</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <code>supabase/functions/staging-chat/index.ts</code> - Your safe testing environment</li>
            <li>• <code>supabase/functions/demo-chat/index.ts</code> - Homepage demo (not client-facing)</li>
            <li>• <code>supabase/functions/chat-ai/index.ts</code> - Live production chatbot for all clients</li>
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How It Works</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Test new features in the Staging Test tab</li>
            <li>2. When satisfied, copy staging changes to production edge function</li>
            <li>3. Use Deploy Updates tab to push to selected clients</li>
            <li>4. Monitor client messages and feedback</li>
          </ol>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">Deployment Process</h4>
          <p className="text-sm text-orange-700 mb-2">
            To deploy staging changes to production:
          </p>
          <ol className="text-sm text-orange-700 space-y-1">
            <li>1. Edit <code>supabase/functions/chat-ai/index.ts</code> with your staging changes</li>
            <li>2. Use the Deploy Updates tab to select which clients get the update</li>
            <li>3. Changes are deployed instantly to selected clients</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default SystemSettings;
