import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PiggyBank, Calendar, CheckCircle2, TrendingUp, History } from 'lucide-react';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export const SavingsProgress: React.FC = () => {
  const { data: progress, isLoading } = useQuery({
    queryKey: ['savings-progress'],
    queryFn: async () => {
      const res = await api.get('/savings/progress');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-surface h-48 rounded-xl border border-gray-800"></div>;
  }

  if (!progress || !progress.hasGoal) return null;

  return (
    <div className="bg-surface border border-gray-800 rounded-xl p-6 relative overflow-hidden group">
      {/* Visual embellishment */}
      <div className="absolute -right-10 -top-10 bg-primary/5 w-40 h-40 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Lado Izquierdo: Resumen Total */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-textHighlight">Progreso de Ahorro</h3>
          </div>
          
          <p className="text-textBase text-sm mb-4">
            Tu meta oficial es de <strong className="text-textHighlight">{formatCurrency(progress.goalAmount)}</strong> {progress.goalType === 'DAILY' ? 'diarios' : 'semanales'}.
          </p>

          <div className="bg-background border border-gray-700 rounded-xl p-5 mt-auto">
            <p className="text-sm text-textBase uppercase tracking-wider font-semibold mb-1">Total Acumulado</p>
            <div className="text-4xl font-bold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              {formatCurrency(progress.totalSaved)}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Historial Reciente */}
        <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-8">
          <h4 className="text-sm font-semibold text-textHighlight uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Últimos Depósitos
          </h4>
          
          {progress.history && progress.history.length > 0 ? (
            <ul className="space-y-3">
              {progress.history.map((deposit: any) => {
                const date = new Date(deposit.date);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                
                return (
                  <li key={deposit.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-textHighlight">
                          {progress.goalType === 'DAILY' ? 'Depósito del día' : 'Depósito de la semana'}
                        </p>
                        <p className="text-xs text-textBase flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(deposit.amount)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-8 text-textBase">
              <p className="text-sm">Aún no tienes depósitos registrados.</p>
              <p className="text-xs mt-1">Tu progreso aparecerá aquí en cuanto realices tu primer depósito pendiente.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
