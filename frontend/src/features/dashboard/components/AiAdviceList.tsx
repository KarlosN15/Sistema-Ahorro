import React from 'react';
import { Bot } from 'lucide-react';

interface Advice {
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
}

interface Props {
  advices: Advice[];
}

export const AiAdviceList: React.FC<Props> = ({ advices }) => {
  if (!advices || advices.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-textHighlight mb-4 flex items-center gap-2">
        <Bot className="w-8 h-8 text-primary" />
        Asistente Analítico & Financiero
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advices.map((advice, idx) => {
          const bgColors = {
            success: 'bg-surface border-gray-800',
            warning: 'bg-surface border-gray-800',
            danger: 'bg-surface border-gray-800',
            info: 'bg-surface border-gray-800',
          };
          const textColors = {
            success: 'text-textBase',
            warning: 'text-textBase',
            danger: 'text-textBase',
            info: 'text-textBase',
          };
          const accentColors = {
            success: 'text-green-500',
            warning: 'text-orange-500',
            danger: 'text-red-500',
            info: 'text-blue-500',
          };
          
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
  );
};
