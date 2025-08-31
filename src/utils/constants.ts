import { Priority, Status, Role, OrgPlan } from '../types';

export const PRIORITY_OPTIONS: { value: Priority; label: string; className: string }[] = [
  { value: 'URGENT', label: 'Urgent', className: 'bg-red-100 text-red-800'},
  { value: 'IMPORTANT', label: 'Important', className: 'bg-orange-100 text-orange-800' },
  { value: 'MEDIUM', label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
  { value: 'LOW', label: 'Low', className: 'bg-green-100 text-green-800' },
];

export const STATUS_OPTIONS: { value: Status; label: string; className: string }[] = [
  { value: 'OPEN', label: 'Open', className: 'bg-blue-100 text-blue-800' },
  { value: 'ASSIGNED', label: 'Assigned', className: 'bg-purple-100 text-purple-800' },
  { value: 'INPROGRESS', label: 'In Progress',className: 'bg-indigo-100 text-indigo-800' },
  { value: 'RESOLVED', label: 'Resolved',className: 'bg-green-100 text-green-800' },
  { value: 'REOPENED', label: 'Reopened', className: 'bg-orange-100 text-orange-800' },
  { value: 'CLOSED', label: 'Closed', className: 'bg-gray-100 text-gray-800' },
];

export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'CLIENT', label: 'Client' },
  { value: 'DEVELOPER', label: 'Developer' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN', label: 'Admin' },
];

export const ORG_PLAN_OPTIONS: { value: OrgPlan; label: string; price: string; features: string[] }[] = [
  {
    value: 'BASE',
    label: 'Base Plan',
    price: 'Free',
    features: [
      'Up to 10 users',
      '2 photos per ticket',
      'Basic ticket management',
      'Email notifications',
    ],
  },
  {
    value: 'PREMIUM',
    label: 'Premium Plan',
    price: '$29/month',
    features: [
      'Unlimited users',
      '7 photos per ticket',
      'Advanced analytics',
      'AI chat assistance',
      'Priority support',
    ],
  },
];

export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Transportation',
  'Entertainment',
  'Other',
];

export const getPriorityColor = (priority: Priority): string => {
  const option = PRIORITY_OPTIONS.find(p => p.value === priority);
  return option?.className || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status: Status): string => {
  const option = STATUS_OPTIONS.find(s => s.value === status);
  return option?.className || 'bg-gray-100 text-gray-800';
};