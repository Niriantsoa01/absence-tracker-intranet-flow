
import { useState } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import LeaveRequestForm from '../components/LeaveRequestForm';
import RequestManagement from '../components/RequestManagement';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'request':
        return <LeaveRequestForm />;
      case 'manage':
        return <RequestManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>
    </AuthProvider>
  );
};

export default Index;
