import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Image, MessageSquare, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import api, { handleApiResponse } from '../../utils/api';
import { SingleTicketResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import AssignTicket from './AssignTicket';

interface CommentForm {
  comment: string;
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [ticket, setTicket] = useState<SingleTicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();

  useEffect(() => {
    if (id) {
      fetchTicketDetail();
    }
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ticket/${id}`);
      const ticketData = handleApiResponse<SingleTicketResponse>(response);
      setTicket(ticketData);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitComment = async (data: CommentForm) => {
    try {
      setCommentLoading(true);
      const response = await api.post(`/ticket/${id}/comment`, data);
      handleApiResponse(response);
      
      toast.success('Comment added successfully');
      reset();
      fetchTicketDetail(); // Refresh to get updated comments
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ticket not found
        </h2>
        <button
          onClick={() => navigate('/tickets')}
          className="mt-4 btn-primary"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ticket.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ticket Details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Info */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium status-${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>
              
              {role === 'MANAGER' && ticket.status === 'OPEN' && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="btn-primary text-sm"
                >
                  Assign Ticket
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Photos */}
              {ticket.photoPath && ticket.photoPath.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Attachments
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ticket.photoPath.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="card">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comments ({ticket.comments?.length || 0})
            </h3>

            {/* Comments List */}
            <div className="space-y-4 mb-6">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet
                </p>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
              <div>
                <textarea
                  {...register('comment', { required: 'Comment is required' })}
                  rows={3}
                  className="input-field"
                  placeholder="Add a comment..."
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {commentLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Add Comment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Ticket Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Client:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {ticket.clientName}
                </span>
              </div>

              {ticket.assignedToName && (
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {ticket.assignedToName}
                  </span>
                </div>
              )}

              {ticket.assignedByName && (
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Assigned by:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {ticket.assignedByName}
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              {ticket.dueDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Due:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(ticket.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {role === 'MANAGER' && ticket.status === 'OPEN' && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full btn-primary text-sm"
                >
                  Assign Ticket
                </button>
              )}
              
              <button className="w-full btn-secondary text-sm">
                Update Status
              </button>
              
              <button className="w-full btn-secondary text-sm">
                Set Priority
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Ticket Modal */}
      {showAssignModal && (
        <AssignTicket
          ticketId={parseInt(id!)}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            fetchTicketDetail();
          }}
        />
      )}
    </div>
  );
};

export default TicketDetail;