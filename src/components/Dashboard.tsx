
import { useAuth } from '../hooks/useAuth';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getRequestsByEmployee } = useLeaveRequests();
  
  const userRequests = currentUser ? getRequestsByEmployee(currentUser.id) : [];
  
  const stats = {
    totalRequests: userRequests.length,
    pendingRequests: userRequests.filter(r => r.status === 'pending').length,
    approvedRequests: userRequests.filter(r => r.status === 'approved').length,
    rejectedRequests: userRequests.filter(r => r.status === 'rejected').length,
    remainingDays: currentUser?.remainingDays || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {currentUser?.name} !</h1>
        <p className="text-blue-100 text-lg">
          Bienvenue sur votre tableau de bord de gestion d'absences
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Jours restants</p>
              <p className="text-3xl font-bold text-slate-900">{stats.remainingDays}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">En attente</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Approuvées</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total demandes</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalRequests}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Mes demandes récentes</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {userRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>Aucune demande d'absence pour le moment</p>
            </div>
          ) : (
            userRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-slate-900">
                        {getTypeLabel(request.type)}
                      </span>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvée' : 'Rejetée'}</span>
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-1">{request.reason}</p>
                    <p className="text-slate-500 text-xs">
                      Du {new Date(request.startDate).toLocaleDateString('fr-FR')} au {new Date(request.endDate).toLocaleDateString('fr-FR')} 
                      ({request.days} jour{request.days > 1 ? 's' : ''})
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    Demandée le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
