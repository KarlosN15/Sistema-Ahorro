import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from 'react-hot-toast';

const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ServicesPage = lazy(() => import('./features/catalogs/ServicesPage').then(m => ({ default: m.ServicesPage })));
const CategoriesPage = lazy(() => import('./features/catalogs/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const IncomesPage = lazy(() => import('./features/transactions/IncomesPage').then(m => ({ default: m.IncomesPage })));
const ExpensesPage = lazy(() => import('./features/transactions/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const HistoryPage = lazy(() => import('./features/reports/HistoryPage').then(m => ({ default: m.HistoryPage })));
const AiPlannerPage = lazy(() => import('./features/ai-planner/AiPlannerPage').then(m => ({ default: m.AiPlannerPage })));

const SuspenseLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-textBase text-lg animate-pulse flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      Cargando...
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' } }} />
        <Suspense fallback={<SuspenseLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/new" element={<ServicesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/new" element={<CategoriesPage />} />
                <Route path="/incomes" element={<IncomesPage />} />
                <Route path="/incomes/new" element={<IncomesPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/expenses/new" element={<ExpensesPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/ai-planner" element={<AiPlannerPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
