import React, { useState } from 'react';
import { formatCurrency } from '../../../lib/utils';
import { BellRing, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

interface Props {
  savingsStatus: any;
  refetchSavings: () => void;
}

export const SavingsReminder: React.FC<Props> = ({ savingsStatus, refetchSavings }) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      await api.post('/savings/deposit');
      refetchSavings();
      setDepositSuccess(true);
      toast.success('¡Ahorro depositado con éxito!');
      setTimeout(() => setDepositSuccess(false), 3000);
    } catch (error) {
      console.error("Error making deposit", error);
      toast.error('Error al registrar el depósito');
    } finally {
      setIsDepositing(false);
    }
  };

  if (!savingsStatus?.hasGoal || savingsStatus?.pendingDeposit === null) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className={`border-2 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 ${depositSuccess ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-primary/20 border-primary animate-pulse-slow shadow-[0_0_15px_rgba(229,9,20,0.2)]'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full text-textHighlight transition-colors duration-500 ${depositSuccess ? 'bg-green-500' : 'bg-primary'}`}>
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-textHighlight">
              {depositSuccess ? '¡Excelente trabajo!' : '¡Recordatorio de Ahorro!'}
            </h3>
            <p className="text-textBase">
              {depositSuccess 
                ? 'Has guardado tu ahorro correctamente. Sigue así.'
                : <>Tienes pendiente guardar <strong className="text-primary text-lg">{formatCurrency(savingsStatus.pendingDeposit)}</strong> para tu meta {savingsStatus.goal.type === 'DAILY' ? 'diaria' : 'semanal'}.</>}
            </p>
          </div>
        </div>
        <button 
          onClick={handleDeposit}
          disabled={isDepositing || depositSuccess}
          className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 text-lg transition-all duration-500 disabled:opacity-100 ${depositSuccess ? 'bg-green-500 text-white rounded-lg shadow-lg scale-105' : 'btn-primary'} ${isDepositing ? 'opacity-70 cursor-wait' : ''}`}
        >
          <CheckCircle2 className={`w-5 h-5 ${isDepositing ? 'animate-spin' : ''}`} />
          {isDepositing ? 'Guardando...' : depositSuccess ? '¡Confirmado!' : 'Ahorro Depositado'}
        </button>
      </div>
    </section>
  );
};
