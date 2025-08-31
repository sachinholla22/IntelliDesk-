import React, { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api, { handleApiResponse } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    unassignedTickets: 0,
    assignedTickets: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [unassignedResponse, allTicketsResponse] = await Promise.all([
        api.get('/ticket/getTickets?status=OPEN'),
        api.get('/ticket/getalltickets'),
      ]);

      const unassigned = handleApiResponse(unassignedResponse);
      const allTickets = handleApiResponse(allTicketsResponse);

      setStats({
        unassignedTickets: Array.isArray(unassigned) ? unassigned.length : 0,
        assignedTickets: Array.isArray(allTickets) ? allTickets.filter((t: any) => t.status === 'ASSIGNED').length : 0,
        resolvedTickets: Array.isArray(allTickets) ? allTickets.filter((t: any) => t.status === 'RESOLVED').length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unassigned
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unassignedTickets}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Assigned
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.assignedTickets}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resolved
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.resolvedTickets}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Industry Standard Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Industry Best Practices for Ticketing Dashboards
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          In most IT service management (ITSM) and customer support systems, dashboards 
          provide at-a-glance visibility into operations. Common industry standards include:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-400 mt-3 space-y-1">
          <li>📌 Clear view of <strong>open, assigned, and resolved tickets</strong>.</li>
          <li>⏱️ Monitoring <strong>response times and SLA compliance</strong>.</li>
          <li>🚨 Highlighting <strong>critical or high-priority tickets</strong>.</li>
          <li>📊 Providing simple metrics to help managers allocate resources efficiently.</li>
          <li>🔄 Regular updates so data reflects the most recent activity.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Keeping dashboards lightweight but informative ensures managers can take quick, 
          data-driven decisions without information overload.
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
