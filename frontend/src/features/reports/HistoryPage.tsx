import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await api.get('/reports/history');
      return res.data;
    }
  });

  if (isLoading) return <div className="text-textBase p-8">Cargando bitácora histórica...</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-textHighlight flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Bitácora Histórica
        </h1>
        <p className="text-textBase mt-2">Aquí se guardan tus métricas semana tras semana para que midas tu crecimiento.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history?.map((week: any, index: number) => {
          const startDate = new Date(week.weekStart);
          startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          
          const weekLabel = `${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()}`;

          return (
            <div key={week.weekStart} className="card relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 h-full w-2 bg-primary/20 group-hover:bg-primary transition-colors"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-textHighlight mb-1">{index === 0 ? 'Semana Actual' : `Semana del ${weekLabel}`}</h3>
                  <p className="text-sm text-textBase">Guardado automáticamente</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-gray-700">
                      <Users className="w-5 h-5 text-textBase" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Clientes</p>
                      <p className="font-bold text-textHighlight text-lg">{week.clients}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Ingreso Bruto</p>
                      <p className="font-bold text-green-400 text-lg">{formatCurrency(week.totalIncome)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Beneficio Limpio</p>
                      <p className={`font-bold text-lg ${week.netProfit >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {formatCurrency(week.netProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {history?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-textBase text-lg">Aún no hay semanas registradas.</p>
          </div>
        )}
      </div>
    </div>
  );
};
