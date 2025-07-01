
import { Card } from '@/components/ui/card';
import { MessageSquare, Users, Activity } from 'lucide-react';

interface SuperAdminStatsProps {
  totalClinics: number;
  activeClinics: number;
  totalMessages: number;
  todayMessages: number;
}

const SuperAdminStats = ({ totalClinics, activeClinics, totalMessages, todayMessages }: SuperAdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">Total Clinics</span>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{totalClinics}</div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-gray-600">Active Subscriptions</span>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{activeClinics}</div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-600">Total Messages</span>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{totalMessages}</div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-orange-600" />
          <span className="text-sm font-medium text-gray-600">Today's Messages</span>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{todayMessages}</div>
      </Card>
    </div>
  );
};

export default SuperAdminStats;
