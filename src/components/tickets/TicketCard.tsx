import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Image } from 'lucide-react';
import { Ticket } from '../../types';
import { getPriorityColor, getStatusColor } from '../../utils/constants';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const priorityColor = getPriorityColor(ticket.priority);
  const statusColor = getStatusColor(ticket.status);

  return (
   <Link
  to={`/tickets/${ticket.id}`}
  className="block bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 
             rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {ticket.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
              {ticket.priority}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {ticket.description}
        </p>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {ticket.status}
          </span>
          
          {ticket.photoPath && ticket.photoPath.length > 0 && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Image className="w-4 h-4 mr-1" />
              {ticket.photoPath.length} photo{ticket.photoPath.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>Posted By: {ticket.clientName}</span>
            {ticket.createdAt && (
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            )}
          </div>
          
          {ticket.assignedToName && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>Assigned to: {ticket.assignedToName}</span>
            </div>
          )}
          
          {ticket.dueDate && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;