import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Users, PiggyBank, Bot } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const { data, isLoading } = useQuery({
    queryKey: ['full-dashboard', currentYear, currentMonth],
    queryFn: async () => {
      const res = await api.get(`/reports/full-dashboard?year=${currentYear}&month=${currentMonth}`);
      return res.data;
    }
  });

  if (isLoading || !data) return <div className="text-textBase mt-10 text-center animate-pulse">Cargando reporte de finanzas...</div>;

  const { dashboard, weekly, aiAdvice } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* SECCIÓN 0: ASISTENTE IA */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-textHighlight mb-4 flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          Asistente Analítico & Financiero
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAdvice?.map((advice: any, idx: number) => {
              const bgColors: any = {
                success: 'bg-surface border-gray-800',
                warning: 'bg-surface border-gray-800',
                danger: 'bg-surface border-gray-800',
                info: 'bg-surface border-gray-800',
              };
              const textColors: any = {
                success: 'text-textBase',
                warning: 'text-textBase',
                danger: 'text-textBase',
                info: 'text-textBase',
              };
              const accentColors: any = {
                success: 'text-green-500',
                warning: 'text-orange-500',
                danger: 'text-red-500',
                info: 'text-blue-500',
              }
              return (
                <div key={idx} className={`card border ${bgColors[advice.type]} flex items-start gap-3`}>
                  <div className={`mt-0.5 ${accentColors[advice.type]}`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${textColors[advice.type]}`}>
                    {advice.message}
                  </p>
                </div>
              );
            })}
          </div>
      </section>

      {/* SECCIÓN 1: RESUMEN MENSUAL */}
      <section>
        <h1 className="text-2xl font-bold text-textHighlight mb-6">Resumen del Mes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textBase text-sm font-medium">Ingresos Totales</p>
                <p className="text-3xl font-bold text-textHighlight mt-2">{formatCurrency(dashboard.totalIncome)}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-green-500 bg-surface border border-gray-800">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textBase text-sm font-medium">Gastos Negocio</p>
                <p className="text-3xl font-bold text-textHighlight mt-2">{formatCurrency(dashboard.businessExpenses)}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-textBase bg-surface border border-gray-800">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textBase text-sm font-medium">Gastos Personales</p>
                <p className="text-3xl font-bold text-textHighlight mt-2">{formatCurrency(dashboard.personalExpenses)}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-textBase bg-surface border border-gray-800">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textBase text-sm font-medium">Beneficio Neto</p>
                <p className={`text-3xl font-bold mt-2 ${dashboard.netProfit >= 0 ? 'text-textHighlight' : 'text-textHighlight'}`}>
                  {formatCurrency(dashboard.netProfit)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-textHighlight bg-primary border border-primaryHover shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: RENDIMIENTO SEMANAL Y AHORROS */}
      <section>
        <h2 className="text-2xl font-bold text-textHighlight mb-6">Métricas de esta Semana</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tarjeta de Clientes */}
          <div className="card bg-gradient-to-br from-surface to-surface/50 border border-gray-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-textHighlight mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Clientes Atendidos (Lun - Dom)
              </h3>
              <div className="flex items-end gap-4">
                <span className="text-5xl font-bold text-textHighlight">{weekly.currentClients}</span>
                <span className={`flex items-center text-sm font-medium pb-1 ${weekly.clientsTrend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {weekly.clientsTrend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(weekly.clientsDifference)} vs sem pasada
                </span>
              </div>
              <p className="text-sm text-textBase mt-4">
                {weekly.clientsTrend === 'up' 
                  ? '¡Excelente ritmo! Has superado tu marca de la semana anterior.'
                  : 'Vamos un poco más lentos que la semana pasada. ¡Sigue adelante!'}
              </p>
            </div>
          </div>

          {/* Tarjeta de Ahorros */}
          <div className="card bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PiggyBank className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-textHighlight mb-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                Asistente de Ahorro
              </h3>
              {weekly.currentNetProfit > 0 ? (
                <>
                  <p className="text-textBase mb-2">Has generado <strong>{formatCurrency(weekly.currentNetProfit)}</strong> de beneficio limpio esta semana.</p>
                  <p className="text-textBase mb-4">Te sugerimos transferir el 30% a tu cuenta de ahorros para el futuro del negocio o metas personales:</p>
                  <div className="inline-block bg-primary/20 text-primary font-bold text-2xl px-6 py-3 rounded-lg border border-primary/30">
                    Sugerencia: {formatCurrency(weekly.suggestedSavings)}
                  </div>
                </>
              ) : (
                <p className="text-textBase mt-6">Aún no hay beneficio neto positivo esta semana. ¡Sigue registrando tus recortes para recibir sugerencias de ahorro!</p>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
