import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

interface Props {
  weekly: {
    currentClients: number;
    clientsTrend: 'up' | 'down';
    clientsDifference: number;
    currentNetProfit: number;
    suggestedSavings: number;
  };
}

export const DashboardCharts: React.FC<Props> = ({ weekly }) => {
  // Datos simulados para el gráfico de ejemplo usando recharts (semanal)
  // En una app real, esto vendría del endpoint /reports/history 
  const data = [
    { name: 'Lun', ingresos: 4000, gastos: 2400 },
    { name: 'Mar', ingresos: 3000, gastos: 1398 },
    { name: 'Mié', ingresos: 2000, gastos: 9800 },
    { name: 'Jue', ingresos: 2780, gastos: 3908 },
    { name: 'Vie', ingresos: 1890, gastos: 4800 },
    { name: 'Sáb', ingresos: 2390, gastos: 3800 },
    { name: 'Dom', ingresos: 3490, gastos: 4300 },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-textHighlight mb-6">Métricas de esta Semana</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      <div className="card border border-gray-800 p-6 h-[400px]">
        <h3 className="text-lg font-semibold text-textHighlight mb-4">Balance Semanal (Ejemplo visual)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e50914" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Area type="monotone" dataKey="ingresos" stroke="#22c55e" fillOpacity={1} fill="url(#colorIngresos)" />
            <Area type="monotone" dataKey="gastos" stroke="#e50914" fillOpacity={1} fill="url(#colorGastos)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
};
