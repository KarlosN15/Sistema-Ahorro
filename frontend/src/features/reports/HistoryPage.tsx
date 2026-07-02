import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { Calendar, Users, DollarSign, TrendingUp, FileText, Table } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const HistoryPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await api.get(`/reports/history?year=${selectedYear}&month=${selectedMonth}`);
      return res.data;
    }
  });

  const handleExportPDF = () => {
    if (!history || history.length === 0) return;
    const doc = new jsPDF();
    doc.text(`Reporte Mensual - ${selectedMonth}/${selectedYear}`, 14, 15);
    
    const tableColumn = ["Día", "Clientes", "Ingreso Bruto", "Beneficio Neto"];
    const tableRows: any[] = [];

    history.forEach((day: any) => {
      const startDate = new Date(day.dayStart);
      startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
      const dayLabel = startDate.toLocaleDateString();
      const rowData = [
        dayLabel,
        day.clients,
        formatCurrency(day.totalIncome),
        formatCurrency(day.netProfit)
      ];
      tableRows.push(rowData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`historial_${selectedMonth}_${selectedYear}.pdf`);
  };

  const handleExportExcel = () => {
    if (!history || history.length === 0) return;
    
    const exportData = history.map((day: any) => {
      const startDate = new Date(day.dayStart);
      startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
      return {
        "Día": startDate.toLocaleDateString(),
        "Clientes": day.clients,
        "Ingreso Bruto": day.totalIncome,
        "Beneficio Neto": day.netProfit
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
    XLSX.writeFile(workbook, `historial_${selectedMonth}_${selectedYear}.xlsx`);
  };

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

  if (isLoading) return <div className="text-textBase p-8">Cargando bitácora histórica...</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-textHighlight flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Bitácora Histórica
            </h1>
            <p className="text-textBase mt-2">Revisa tus métricas mensuales y exporta tus reportes.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportPDF} 
              disabled={!history || history.length === 0}
              className="btn-secondary flex items-center gap-2 px-4 py-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button 
              onClick={handleExportExcel} 
              disabled={!history || history.length === 0}
              className="btn-secondary flex items-center gap-2 px-4 py-2 disabled:opacity-50"
            >
              <Table className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 bg-surface p-4 rounded-xl border border-gray-800">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-textBase font-medium">Mes</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="input-field py-2"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-textBase font-medium">Año</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field py-2"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history?.map((day: any) => {
          const startDate = new Date(day.dayStart);
          startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
          
          const dayLabel = startDate.toLocaleDateString();

          return (
            <div key={day.dayStart} className="card relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 h-full w-2 bg-primary/20 group-hover:bg-primary transition-colors"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-textHighlight mb-1">{dayLabel}</h3>
                  <p className="text-sm text-textBase">Resumen del día</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-gray-700">
                      <Users className="w-5 h-5 text-textBase" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Clientes</p>
                      <p className="font-bold text-textHighlight text-lg">{day.clients}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Ingreso Bruto</p>
                      <p className="font-bold text-green-400 text-lg">{formatCurrency(day.totalIncome)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textBase">Beneficio Limpio</p>
                      <p className={`font-bold text-lg ${day.netProfit >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {formatCurrency(day.netProfit)}
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
            <p className="text-textBase text-lg">No hay registros para {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
