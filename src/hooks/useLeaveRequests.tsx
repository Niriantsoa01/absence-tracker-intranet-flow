
import { useState } from 'react';
import { LeaveRequest } from '../types';
import { mockLeaveRequests } from '../data/mockData';

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

  const addRequest = (request: Omit<LeaveRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequestStatus = (
    id: string, 
    status: 'approved' | 'rejected', 
    reviewedBy: string, 
    comments?: string
  ) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status, 
            reviewedBy, 
            reviewDate: new Date().toISOString().split('T')[0],
            comments 
          }
        : req
    ));
  };

  const getRequestsByEmployee = (employeeId: string) => {
    return requests.filter(req => req.employeeId === employeeId);
  };

  const getPendingRequestsForManager = (managerId: string) => {
    // Dans une vraie app, on filtrerait par les employés sous ce manager
    return requests.filter(req => req.status === 'pending');
  };

  return {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestsByEmployee,
    getPendingRequestsForManager
  };
};
