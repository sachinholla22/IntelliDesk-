import React, { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api, { handleApiResponse } from '../../utils/api';
import { User as UserType } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface AssignTicketProps {
  ticketId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface AssignForm {
  assignedToId: string;
}

const AssignTicket: React.FC<AssignTicketProps> = ({ ticketId, onClose, onSuccess }) => {
  const [developers, setDevelopers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignForm>();

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ticket/getdevelopers?role=DEVELOPER');
      const developersData = handleApiResponse<UserType[]>(response);
      setDevelopers(Array.isArray(developersData) ? developersData : []);
    } catch (error) {
      console.error('Failed to fetch developers:', error);
      toast.error('Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AssignForm) => {
    try {
      setSubmitting(true);
      const response = await api.post(`/ticket/${ticketId}/assign`, {
        assignedToId: parseInt(data.assignedToId),
      });
      
      handleApiResponse(response);
      toast.success('Ticket assigned successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to assign ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assign Ticket
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to Developer
                </label>
                <select
                  {...register('assignedToId', { required: 'Please select a developer' })}
                  className="input-field"
                >
                  <option value="">Select a developer</option>
                  {developers.map((developer) => (
                    <option key={developer.id} value={developer.id}>
                      {developer.name} ({developer.email})
                    </option>
                  ))}
                </select>
                {errors.assignedToId && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignedToId.message}</p>
                )}
              </div>

              {developers.length === 0 && (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No developers available for assignment
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || developers.length === 0}
                  className="btn-primary flex items-center space-x-2"
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Assign Ticket'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTicket;