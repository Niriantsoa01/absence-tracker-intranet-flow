
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { CheckCircle, XCircle, Clock, MessageSquare, Calendar, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RequestManagement = () => {
  const { currentUser } = useAuth();
  const { getPendingRequestsForManager, updateRequestStatus } = useLeaveRequests();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  
  const pendingRequests = currentUser ? getPendingRequestsForManager(currentUser.id) : [];

  const handleApprove = (requestId: string) => {
    if (!currentUser) return;
    
    updateRequestStatus(requestId, 'approved', currentUser.name, comments);
    toast({
      title: "Demande approuvée",
      description: "La demande de congé a été approuvée avec succès."
    });
    setSelectedRequest(null);
    setComments('');
  };

  const handleReject = (requestId: string) => {
    if (!currentUser) return;
    
    updateRequestStatus(requestId, 'rejected', currentUser.name, comments);
    toast({
      title: "Demande rejetée",
      description: "La demande de congé a été rejetée."
    });
    setSelectedRequest(null);
    setComments('');
  };

  const getTypeLabel = (type: string) => {
    const types = {
      vacation: 'Vacances',
      sick: 'Maladie',
      personal: 'Personnel',
      maternity: 'Maternité',
      other: 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Demandes en attente</h1>
              <p className="text-slate-600">
                {pendingRequests.length} demande{pendingRequests.length !== 1 ? 's' : ''} à traiter
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune demande en attente</h3>
              <p>Toutes les demandes ont été traitées</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {request.employeeName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getTypeLabel(request.type)}</span>
                        </span>
                        <span>
                          Du {new Date(request.startDate).toLocaleDateString('fr-FR')} 
                          au {new Date(request.endDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="font-medium">
                          {request.days} jour{request.days > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{request.reason}</p>
                      <p className="text-xs text-slate-500">
                        Demandée le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedRequest === request.id && (
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commentaires (optionnel)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      placeholder="Ajoutez un commentaire pour expliquer votre décision..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {selectedRequest === request.id ? (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirmer l'approbation</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Confirmer le rejet</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(null);
                          setComments('');
                        }}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedRequest(request.id)}
                        className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => setSelectedRequest(request.id)}
                        className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Rejeter</span>
                      </button>
                      <button
                        onClick={() => setSelectedRequest(request.id)}
                        className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Ajouter un commentaire</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;
