export type Role = 'CLIENT' | 'DEVELOPER' | 'MANAGER' | 'ADMIN';
export type Priority = 'URGENT' | 'IMPORTANT' | 'MEDIUM' | 'LOW';
export type Status = 'OPEN' | 'ASSIGNED' | 'RESOLVED' | 'INPROGRESS' | 'REOPENED' | 'CLOSED';
export type OrgPlan = 'BASE' | 'PREMIUM';

export interface ApiWrapper<T> {
  success: boolean;
  status: number;
  data?: T;
  error?: {
    status: number;
    message: string;
    errorCode: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  organizationName: string;
  createdAt: string;
}

export interface Organization {
  id: number;
  orgName: string;
  orgEmail: string;
  orgAddr: string;
  orgPhone: number;
  industryType: string;
  orgPlan: OrgPlan;
  createdAt: string;
}

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  clientName?: string;
  assignedToName?: string;
  assignedByName?: string;
  createdAt?: string;
  dueDate?: string;
  photoPath?: string[];
  organizationName?: string;
}

export interface SingleTicketResponse {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  clientName: string;
  assignedToName?: string;
  assignedByName?: string;
  createdAt: string;
  dueDate?: string;
  photoPath?: string[];
  comments?: string[];
}

export interface Comment {
  id: number;
  comment: string;
  commentedBy: User;
  lastUpdated: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  jwt: string;
  isCorrectCredentials: boolean;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
}

export interface AiResponse {
  answer: string;
  sources: string[];
}