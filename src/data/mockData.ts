
import type { User, LeaveRequest } from '../types';

//export type { User, LeaveRequest };

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@company.com',
    role: 'employee',
    managerId: '3',
    department: 'Développement',
    remainingDays: 18,
    totalDays: 25
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@company.com',
    role: 'employee',
    managerId: '3',
    department: 'Marketing',
    remainingDays: 12,
    totalDays: 22
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@company.com',
    role: 'manager',
    managerId: '4',
    department: 'IT',
    remainingDays: 15,
    totalDays: 28
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@company.com',
    role: 'director',
    department: 'Direction',
    remainingDays: 20,
    totalDays: 30
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Jean Dupont',
    type: 'vacation',
    startDate: '2024-07-15',
    endDate: '2024-07-25',
    days: 7,
    reason: 'Vacances d\'été en famille',
    status: 'pending',
    requestDate: '2024-06-20'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Marie Martin',
    type: 'sick',
    startDate: '2024-06-18',
    endDate: '2024-06-19',
    days: 2,
    reason: 'Grippe',
    status: 'approved',
    requestDate: '2024-06-17',
    reviewedBy: 'Pierre Durand',
    reviewDate: '2024-06-17'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Jean Dupont',
    type: 'personal',
    startDate: '2024-06-10',
    endDate: '2024-06-10',
    days: 1,
    reason: 'Rendez-vous médical',
    status: 'approved',
    requestDate: '2024-06-05',
    reviewedBy: 'Pierre Durand',
    reviewDate: '2024-06-06'
  }
];
