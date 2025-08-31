// Enhanced ClientDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api, { handleApiResponse } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Ticket as TicketType } from '../../types';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ticket/getalltickets');
      const tickets = handleApiResponse<TicketType[]>(response) || [];
      
      // Filter tickets created by current user
      const clientTickets = tickets.filter(ticket => ticket.clientName === user?.name);
      setMyTickets(clientTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ASSIGNED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'RESOLVED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = {
    total: myTickets.length,
    open: myTickets.filter(t => t.status === 'OPEN').length,
    inProgress: myTickets.filter(t => t.status === 'ASSIGNED').length,
    resolved: myTickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.name} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link
            to="/tickets/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tickets
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All your tickets
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Open
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.open}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Awaiting response
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.inProgress}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Being worked on
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resolved
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.resolved}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Successfully closed
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tickets */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  My Recent Tickets
                </h3>
                <Link
                  to="/tickets"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                >
                  View all →
                </Link>
              </div>

              {myTickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No tickets yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Create your first support ticket to get help from our team. We're here to assist you!
                  </p>
                  <Link
                    to="/tickets/create"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Ticket
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTickets.slice(0, 5).map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/tickets/${ticket.id}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {ticket.title}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            {ticket.assignedToName && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Assigned to: {ticket.assignedToName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getTimeAgo(ticket.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/tickets/create"
                    className="flex items-center p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-3 text-blue-600" />
                    Create New Ticket
                  </Link>
                  <Link
                    to="/tickets"
                    className="flex items-center p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Ticket className="w-4 h-4 mr-3 text-gray-600" />
                    View All My Tickets
                  </Link>
                  {stats.open > 0 && (
                    <Link
                      to="/tickets?status=OPEN"
                      className="flex items-center p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400 rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 mr-3 text-yellow-600" />
                      Check Open Tickets
                      <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {stats.open}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Support Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  💡 Support Tips
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>Be specific:</strong> Include detailed descriptions and screenshots
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>Set priority:</strong> Help us understand urgency level
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>Stay updated:</strong> Check back for responses and updates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Summary */}
            {myTickets.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Ticket Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }} 
                        />
                      </div>
                    </div>
                    
                    {stats.open > 0 && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">
                            {stats.open} ticket{stats.open !== 1 ? 's' : ''} awaiting response
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section for New Users */}
        {myTickets.length === 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to IntelliDesk Support!</h2>
              <p className="text-blue-100 mb-6">
                Need help? Our support team is here for you. Create your first ticket to get started.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold mb-1">1. Create Ticket</h4>
                  <p className="text-sm text-blue-100">Describe your issue with details</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold mb-1">2. Track Progress</h4>
                  <p className="text-sm text-blue-100">Monitor status and updates</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold mb-1">3. Get Resolved</h4>
                  <p className="text-sm text-blue-100">Receive solutions from our team</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case 'URGENT': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'ASSIGNED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case 'RESOLVED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export default ClientDashboard;