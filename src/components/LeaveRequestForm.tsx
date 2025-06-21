
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { Calendar, Send, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LeaveRequestForm = () => {
  const { currentUser } = useAuth();
  const { addRequest } = useLeaveRequests();
  
  const [formData, setFormData] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = [
    { value: 'vacation', label: 'Vacances' },
    { value: 'sick', label: 'Congé maladie' },
    { value: 'personal', label: 'Congé personnel' },
    { value: 'maternity', label: 'Congé maternité' },
    { value: 'other', label: 'Autre' }
  ];

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays(formData.startDate, formData.endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (days > currentUser.remainingDays) {
      toast({
        title: "Erreur",
        description: `Vous n'avez que ${currentUser.remainingDays} jours de congé restants.`,
        variant: "destructive"
      });
      return;
    }

    const request = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      type: formData.type as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason
    };

    addRequest(request);
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de congé a été envoyée à votre supérieur pour validation."
    });

    // Reset form
    setFormData({
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const isFormValid = formData.startDate && formData.endDate && formData.reason.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Nouvelle demande de congé</h1>
              <p className="text-slate-600">Remplissez le formulaire pour soumettre votre demande</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de congé */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type de congé
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Durée calculée */}
          {days > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Durée: {days} jour{days > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Jours restants après cette demande: {(currentUser?.remainingDays || 0) - days}
              </p>
            </div>
          )}

          {/* Alerte si pas assez de jours */}
          {days > (currentUser?.remainingDays || 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  Attention: Vous n'avez que {currentUser?.remainingDays} jours restants
                </span>
              </div>
            </div>
          )}

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Motif de la demande
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              placeholder="Décrivez brièvement le motif de votre demande..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              required
            />
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={!isFormValid || days > (currentUser?.remainingDays || 0)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>Envoyer la demande</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
