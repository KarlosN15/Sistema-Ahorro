import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { PiggyBank } from 'lucide-react';
import { SavingsProgress } from './SavingsProgress';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { DashboardSummary } from './components/DashboardSummary';
import { SavingsReminder } from './components/SavingsReminder';
import { AiAdviceList } from './components/AiAdviceList';
import { DashboardCharts } from './components/DashboardCharts';

export const DashboardPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedYear = Number(searchParams.get('year')) || currentYear;
  const selectedMonth = Number(searchParams.get('month')) || currentMonth;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ month: e.target.value, year: selectedYear.toString() });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ month: selectedMonth.toString(), year: e.target.value });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['full-dashboard', selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await api.get(`/reports/full-dashboard?year=${selectedYear}&month=${selectedMonth}`);
      return res.data;
    },
    retry: 1
  });

  const { data: savingsStatus, refetch: refetchSavings } = useQuery({
    queryKey: ['savings-status'],
    queryFn: async () => {
      const res = await api.get('/savings/status');
      return res.data;
    }
  });

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el reporte</h2>
        <p className="text-textBase">Ocurrió un problema al contactar al servidor. Por favor intenta recargar la página.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-6">Recargar página</button>
      </div>
    );
  }

  if (!data) return null;

  const { dashboard, weekly, aiAdvice, todayClients } = data;

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECCIÓN: FILTRO DE MES/AÑO */}
      <section className="bg-surface border border-gray-800 rounded-xl p-4 flex flex-wrap items-center gap-6">
        <h2 className="text-lg font-bold text-textHighlight">Mes a Consultar:</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-textBase">Mes</label>
          <select 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="input-field py-1.5 px-3 min-w-[120px]"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-textBase">Año</label>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="input-field py-1.5 px-3 min-w-[100px]"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </section>

      {/* SECCIÓN: NOTIFICACIÓN DE AHORRO */}
      <SavingsReminder savingsStatus={savingsStatus} refetchSavings={refetchSavings} />

      {/* SECCIÓN: CREAR META SI NO HAY */}
      {savingsStatus && !savingsStatus.hasGoal && (
        <section className="mb-6">
          <div className="bg-surface border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PiggyBank className="w-8 h-8 text-textBase" />
              <div>
                <h3 className="text-lg font-bold text-textHighlight">Aún no tienes una meta oficial de ahorro</h3>
                <p className="text-textBase text-sm">Usa el Asistente IA para calcular tu meta y actívala para recibir recordatorios aquí.</p>
              </div>
            </div>
            <button onClick={() => navigate('/ai-planner')} className="btn-secondary whitespace-nowrap">
              Ir al Planificador IA
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN: PROGRESO DE AHORRO (Solo si tiene meta) */}
      {savingsStatus && savingsStatus.hasGoal && (
        <section className="mb-6">
          <SavingsProgress />
        </section>
      )}

      {/* SECCIÓN 0: ASISTENTE IA */}
      <AiAdviceList advices={aiAdvice} />

      {/* SECCIÓN 1: RESUMEN MENSUAL */}
      <DashboardSummary dashboard={dashboard} todayClients={todayClients} />

      {/* SECCIÓN 2: RENDIMIENTO SEMANAL Y GRÁFICOS */}
      <DashboardCharts weekly={weekly} />

    </div>
  );
};
