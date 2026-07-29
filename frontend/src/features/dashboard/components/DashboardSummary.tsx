import React from 'react';
import { formatCurrency } from '../../../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Users } from 'lucide-react';

interface Props {
  dashboard: {
    totalIncome: number;
    businessExpenses: number;
    personalExpenses: number;
    netProfit: number;
  };
  todayClients: number;
}

export const DashboardSummary: React.FC<Props> = ({ dashboard, todayClients }) => {
  return (
    <section>
      <h1 className="text-2xl font-bold text-textHighlight mb-6">Resumen Principal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:border-primary/50 transition-colors border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textBase text-sm font-medium">Recortes de Hoy</p>
              <p className="text-4xl font-black text-textHighlight mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{todayClients}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary bg-primary/10 border border-primary/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textBase text-sm font-medium">Ingresos Mes</p>
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

        <div className="card md:col-span-2 lg:col-span-4 hover:border-primary/30 transition-colors border-2 border-transparent bg-gradient-to-r from-surface to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textBase text-lg font-medium">Beneficio Neto</p>
              <p className={`text-4xl font-bold mt-2 ${dashboard.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(dashboard.netProfit)}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-textHighlight bg-primary shadow-[0_0_15px_rgba(229,9,20,0.4)]">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
