import { Priority, Status, Role, OrgPlan } from '../types';

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'URGENT', label: 'Urgent', color: 'red' },
  { value: 'IMPORTANT', label: 'Important', color: 'orange' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'LOW', label: 'Low', color: 'green' },
];

export const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: 'OPEN', label: 'Open', color: 'blue' },
  { value: 'ASSIGNED', label: 'Assigned', color: 'purple' },
  { value: 'INPROGRESS', label: 'In Progress', color: 'indigo' },
  { value: 'RESOLVED', label: 'Resolved', color: 'green' },
  { value: 'REOPENED', label: 'Reopened', color: 'orange' },
  { value: 'CLOSED', label: 'Closed', color: 'gray' },
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
  return option?.color || 'gray';
};

export const getStatusColor = (status: Status): string => {
  const option = STATUS_OPTIONS.find(s => s.value === status);
  return option?.color || 'gray';
};