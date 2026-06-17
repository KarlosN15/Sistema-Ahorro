import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ServicesPage } from './features/catalogs/ServicesPage';
import { CategoriesPage } from './features/catalogs/CategoriesPage';
import { IncomesPage } from './features/transactions/IncomesPage';
import { ExpensesPage } from './features/transactions/ExpensesPage';
import { HistoryPage } from './features/reports/HistoryPage';
import { AiPlannerPage } from './features/ai-planner/AiPlannerPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
