import React, { useState } from 'react';
import { Sparkles, Target, Calculator, ArrowRight, Save } from 'lucide-react';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export const AiPlannerPage: React.FC = () => {
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'weeks' | 'months'>('months');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const [plan, setPlan] = useState<{
    amountPerPeriod: number;
    totalPeriods: number;
    advice: string[];
    isCalculated: boolean;
  }>({
    amountPerPeriod: 0,
    totalPeriods: 0,
    advice: [],
    isCalculated: false
  });

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const saveOfficialGoal = async () => {
    if (!plan.isCalculated || frequency === 'monthly') {
      alert("Por ahora el sistema de notificaciones automáticas solo soporta metas Diarias o Semanales. Por favor cambia la frecuencia a Diario o Semanal para activarla.");
      return;
    }
    
    setIsSaving(true);
    try {
      await api.post('/savings/goal', { 
        type: frequency === 'daily' ? 'DAILY' : 'WEEKLY', 
        amount: plan.amountPerPeriod 
      });
      alert("¡Meta Oficial activada con éxito! Recibirás notificaciones en tu Dashboard.");
      navigate('/');
    } catch (error) {
      console.error("Error al guardar la meta", error);
      alert("Hubo un error al guardar tu meta.");
    } finally {
      setIsSaving(false);
    }
  };

  const calculatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const target = parseFloat(goalAmount);
    const time = parseInt(timeValue);
    
    if (isNaN(target) || isNaN(time) || target <= 0 || time <= 0) return;

    // Convert time to total days for easier calculation
    let totalDays = 0;
    if (timeUnit === 'weeks') totalDays = time * 7;
    if (timeUnit === 'months') totalDays = time * 30.44; // average month

    // Calculate periods based on frequency
    let periods = 0;
    let periodName = '';
    
    if (frequency === 'daily') {
      periods = Math.ceil(totalDays);
      periodName = 'día';
    } else if (frequency === 'weekly') {
      periods = Math.ceil(totalDays / 7);
      periodName = 'semana';
    } else if (frequency === 'monthly') {
      periods = Math.ceil(totalDays / 30.44);
      periodName = 'mes';
    }

    const amountPerPeriod = target / periods;

    // Generate smart advice based on the barber context
    const avgHaircutPrice = 15; // Assume $15 per haircut
    const haircutsNeeded = Math.ceil(amountPerPeriod / avgHaircutPrice);
    
    const generatedAdvice = [
      `Para llegar a tu meta, necesitas guardar $${amountPerPeriod.toFixed(2)} cada ${periodName}.`,
      `🧠 Sugerencia de IA: Esto equivale aproximadamente a ${haircutsNeeded} cortes de cabello adicionales por ${periodName}.`,
      `💡 Tip: Configura una transferencia automática de $${amountPerPeriod.toFixed(2)} a una cuenta separada al final de cada ${periodName}.`,
      `🔥 ¡Si logras hacer 1 corte extra al día, alcanzarás tu meta mucho más rápido!`
    ];

    setPlan({
      amountPerPeriod,
      totalPeriods: periods,
      advice: generatedAdvice,
      isCalculated: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="bg-primary/20 p-3 rounded-lg mr-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-textHighlight">Asistente IA de Ahorro</h1>
          <p className="text-textBase mt-1">Tu planificador inteligente para alcanzar metas financieras en tu barbería.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="card h-fit">
          <h2 className="text-xl font-semibold text-textHighlight mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Define tu Meta
          </h2>
          
          <form onSubmit={calculatePlan} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-textBase mb-2">
                ¿Cuánto quieres ahorrar? ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textBase">$</span>
                <input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Ej: 5000"
                  className="input-field pl-8"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-textBase mb-2">
                  ¿En cuánto tiempo?
                </label>
                <input
                  type="number"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  placeholder="Ej: 6"
                  className="input-field"
                  required
                  min="1"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-textBase mb-2">
                  Unidad
                </label>
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as 'weeks' | 'months')}
                  className="input-field"
                >
                  <option value="weeks">Semanas</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textBase mb-2">
                Frecuencia de ahorro deseada
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="input-field"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center mt-6">
              <Calculator className="w-5 h-5 mr-2" />
              Generar Plan de Ahorro
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div className={`transition-all duration-500 ${plan.isCalculated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="bg-surface rounded-xl p-6 shadow-lg border-2 border-primary relative overflow-hidden">
            {/* Adorno visual */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10"></div>
            
            <h2 className="text-xl font-semibold text-textHighlight mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Tu Plan Inteligente
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-textBase text-sm uppercase tracking-wider mb-1">Debes ahorrar</p>
              <div className="text-4xl font-bold text-primary mb-2">
                ${plan.amountPerPeriod.toFixed(2)}
              </div>
              <p className="text-textBase">
                {frequency === 'daily' ? 'diarios' : frequency === 'weekly' ? 'semanales' : 'mensuales'} durante {plan.totalPeriods} {frequency === 'daily' ? 'días' : frequency === 'weekly' ? 'semanas' : 'meses'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-textHighlight uppercase tracking-wider border-b border-gray-700 pb-2">
                Análisis y Consejos
              </h3>
              
              <ul className="space-y-3">
                {plan.advice.map((adv, idx) => (
                  <li key={idx} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span className="text-textBase text-sm leading-relaxed">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={saveOfficialGoal}
              disabled={isSaving}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Guardando...' : 'Establecer como mi Meta Oficial'}
            </button>
            <p className="text-xs text-textBase text-center mt-3">
              Activa esta meta para recibir notificaciones y llevar tu progreso en el Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
