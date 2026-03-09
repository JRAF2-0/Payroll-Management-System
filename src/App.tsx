import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider, useData } from '@/context/DataContext';
import Sidebar from '@/components/Layout/Sidebar';
import TopBar from '@/components/Layout/TopBar';
import LoadingScreen from '@/components/LoadingScreen';
import ToastContainer from '@/components/Toast';
import Dashboard from '@/pages/Dashboard';
import Employees from '@/pages/Employees';
import Payroll from '@/pages/Payroll';
import Reimbursements from '@/pages/Reimbursements';
import Records from '@/pages/Records';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  payroll: 'Payroll',
  reimbursements: 'Reimbursements',
  records: 'Records',
};

function AppContent() {
  const { loading } = useData();
  const [page, setPage] = useState('dashboard');

  if (loading) return <LoadingScreen />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'payroll': return <Payroll />;
      case 'reimbursements': return <Reimbursements />;
      case 'records': return <Records />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--luna-page-bg)', transition: 'background 0.3s' }}>
      <Sidebar activePage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col lg:ml-[210px]">
        <TopBar title={PAGE_TITLES[page]} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {renderPage()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <DataProvider>
      <AppContent />
    </DataProvider>
  </ThemeProvider>
);

export default App;
