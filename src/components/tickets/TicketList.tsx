import React, { useEffect, useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api, { handleApiResponse } from '../../utils/api';
import { Ticket, Priority, Status } from '../../types';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import TicketCard from './TicketCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TicketList: React.FC = () => {
  const { role, user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    priority?: Priority;
    status?: Status;
  }>({});

  // Debug authentication
  useEffect(() => {
    console.log('TicketList - Auth check:');
    console.log('- Authenticated:', isAuthenticated);
    console.log('- User:', user);
    console.log('- Role:', role);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, should redirect');
      return;
    }
    
    if (!user) {
      console.log('User object not loaded yet');
      return;
    }
    
    console.log('Starting to fetch tickets...');
    fetchTickets();
  }, [isAuthenticated, user]);

  const fetchTickets = async () => {
    try {
      console.log('fetchTickets called with filters:', filters);
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);

      const url = `/ticket/getalltickets?${params.toString()}`;
      console.log('Making API call to:', url);
      
      const response = await api.get(url);
      console.log('Raw response:', response);
      
      const ticketData = handleApiResponse<Ticket[]>(response);
      console.log('Processed ticket data:', ticketData);
      
      // Handle different response formats
      let ticketsArray: Ticket[] = [];
      if (Array.isArray(ticketData)) {
        ticketsArray = ticketData;
      } else if (ticketData && typeof ticketData === 'object' && 'data' in ticketData) {
        ticketsArray = Array.isArray(ticketData.data) ? ticketData.data : [];
      } else {
        console.warn('Unexpected ticket data format:', ticketData);
        ticketsArray = [];
      }
      
      console.log('Final tickets array:', ticketsArray);
      setTickets(ticketsArray);
      
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tickets';
      setError(errorMessage);
      setTickets([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async () => {
    try {
      setLoading(true);
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      
      console.log('Sorting tickets with direction:', newDirection);
      
      const response = await api.get(`/ticket/getticketbysort?direction=${newDirection}`);
      const sortedTickets = handleApiResponse<Ticket[]>(response);
      
      setTickets(Array.isArray(sortedTickets) ? sortedTickets : []);
    } catch (error) {
      console.error('Failed to sort tickets:', error);
      toast.error('Failed to sort tickets');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track support tickets
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={fetchTickets}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track support tickets
          </p>
        </div>
        {role === 'CLIENT' && (
          <Link
            to="/tickets/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={handleSort}
              className="btn-secondary flex items-center space-x-2"
              disabled={loading}
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              <span>Priority</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority || undefined })}
                  className="input-field"
                >
                  <option value="">All Priorities</option>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as Status || undefined })}
                  className="input-field"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({})}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug Info Panel */}
      {/* <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Debug Info:</h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <p>✅ Component Rendered</p>
          <p>Loading: {loading.toString()}</p>
          <p>Error: {error || 'None'}</p>
          <p>Raw Tickets: {tickets.length}</p>
          <p>Filtered: {filteredTickets.length}</p>
          <p>User Role: {role}</p>
          <p>User Name: {user?.name}</p>
          <p>Authenticated: {isAuthenticated.toString()}</p>
        </div>
      </div> */}

      {/* Tickets Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <LoadingSpinner size="lg" />
          <span className="text-gray-600 dark:text-gray-400">Loading tickets...</span>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tickets found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filters.priority || filters.status
              ? 'Try adjusting your search or filters'
              : 'No tickets have been created yet'}
          </p>
          {role === 'CLIENT' && (
            <Link
              to="/tickets/create"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Ticket</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket, index) => {
              console.log(`Rendering ticket ${index}:`, ticket);
              return (
                <TicketCard 
                  key={ticket.id || `ticket-${index}`} 
                  ticket={ticket} 
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;