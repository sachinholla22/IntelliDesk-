import React, { useEffect, useState } from 'react';
import { Users, Ticket, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api, { handleApiResponse } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    unassignedTickets: 0,
    assignedTickets: 0,
    overdueTickets: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [unassignedResponse, allTicketsResponse, overdueResponse] = await Promise.all([
        api.get('/ticket/getTickets?status=OPEN'),
        api.get('/ticket/getalltickets'),
        api.get('/ticket/overdues'),
      ]);

      const unassigned = handleApiResponse(unassignedResponse);
      const allTickets = handleApiResponse(allTicketsResponse);
      const overdue = handleApiResponse(overdueResponse);

      setStats({
        unassignedTickets: Array.isArray(unassigned) ? unassigned.length : 0,
        assignedTickets: Array.isArray(allTickets) ? allTickets.filter((t: any) => t.status === 'ASSIGNED').length : 0,
        overdueTickets: Array.isArray(overdue) ? overdue.length : 0,
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

  const quickActions = [
    {
      title: 'Assign Tickets',
      description: 'Review and assign unassigned tickets',
      href: '/tickets?status=OPEN',
      icon: Users,
      color: 'blue',
      count: stats.unassignedTickets,
    },
    {
      title: 'Review Overdue',
      description: 'Check overdue tickets requiring attention',
      href: '/tickets/overdue',
      icon: AlertTriangle,
      color: 'red',
      count: stats.overdueTickets,
    },
    {
      title: 'Team Performance',
      description: 'View team metrics and performance',
      href: '/analytics',
      icon: TrendingUp,
      color: 'green',
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Overdue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.overdueTickets}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-${action.color}-100 dark:bg-${action.color}-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  {action.count !== undefined && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${action.color}-100 text-${action.color}-800 dark:bg-${action.color}-900 dark:text-${action.color}-200`}>
                      {action.count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Ticket #{1000 + i} was assigned to John Doe
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {i} hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;