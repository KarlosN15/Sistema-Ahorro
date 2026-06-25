import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { DollarSign, Pencil, Trash2, MoreVertical, X, TrendingUp, PlusCircle, User } from 'lucide-react';

export const IncomesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewView = location.pathname.endsWith('/new');

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (isNewView && !editingId) {
      handleCancelEdit();
    }
  }, [isNewView]);

  const { data: incomes, isLoading: loadingIncomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: async () => (await api.get('/incomes')).data
  });

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ['incomes'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['weekly'] });
    queryClient.invalidateQueries({ queryKey: ['history'] });
    handleCancelEdit();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/incomes');
    }, 1500);
  };

  const createMutation = useMutation({
    mutationFn: (newIncome: any) => api.post('/incomes', newIncome),
    onSuccess: onSuccessAction
  });

  const updateMutation = useMutation({
    mutationFn: (updatedIncome: any) => api.put(`/incomes/${editingId}`, updatedIncome),
    onSuccess: onSuccessAction
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/incomes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      setOpenMenuId(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(date);
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    
    const payload = { 
      amount: Number(amount), 
      description,
      clientName: clientName ? clientName : undefined,
      date: dateObj.toISOString()
    };

    if (editingId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (inc: any) => {
    setEditingId(inc.id);
    setAmount(inc.amount.toString());
    setDescription(inc.description || '');
    setClientName(inc.clientName || '');
    setDate(new Date(inc.date).toISOString().split('T')[0]);
    setOpenMenuId(null);
    navigate('/incomes/new');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este ingreso? Tus métricas globales se actualizarán.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setDescription('');
    setClientName('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleGoBack = () => {
    handleCancelEdit();
    navigate('/incomes');
  };

  return (
    <div className="pb-10">
      {!isNewView ? (
        // ================= VISTA DE HISTORIAL =================
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-textHighlight flex items-center">
              <TrendingUp className="w-7 h-7 mr-3 text-green-500" />
              Historial de Ingresos
            </h2>
            <button onClick={() => navigate('/incomes/new')} className="btn-primary !bg-green-600 hover:!bg-green-500 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Registrar Ingreso
            </button>
          </div>
          
          {loadingIncomes ? <p className="text-textBase animate-pulse">Cargando ingresos...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomes?.map((inc: any) => (
                <div key={inc.id} className="card py-5 flex items-center justify-between border-l-4 border-l-green-500 hover:border-gray-600 transition-colors relative group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-textHighlight text-xl text-green-400">+{formatCurrency(inc.amount)}</p>
                      <p className="text-sm text-textBase mt-1">
                        {inc.clientName && <span className="font-semibold text-gray-300">{inc.clientName} • </span>}
                        {inc.description || 'Corte general'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(inc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Botón de opciones */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === inc.id ? null : inc.id)}
                      className="p-2 rounded-md text-textBase hover:text-textHighlight hover:bg-surface transition-colors"
                    >
                      <MoreVertical className="w-6 h-6" />
                    </button>
                    
                    {/* Menú desplegable */}
                    {openMenuId === inc.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-surface border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                        <button 
                          onClick={() => handleEdit(inc)}
                          className="w-full text-left px-4 py-3 text-sm text-textBase hover:bg-gray-800 hover:text-textHighlight flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(inc.id)}
                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {incomes?.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-surface/30 rounded-xl border border-dashed border-gray-700">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-textHighlight font-bold">No has registrado ingresos aún.</p>
                  <p className="text-gray-500 mt-2 mb-6">Registra tu primer corte o venta para empezar a ver métricas.</p>
                  <button onClick={() => navigate('/incomes/new')} className="btn-primary !bg-green-600 hover:!bg-green-500">
                    Añadir Ingreso
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // ================= VISTA DE FORMULARIO =================
        <div className="max-w-2xl mx-auto mt-8">
          <div className="card border-t-4 border-t-green-500 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                  {editingId ? <Pencil className="w-6 h-6 text-green-500" /> : <PlusCircle className="w-6 h-6 text-green-500" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textHighlight">
                    {editingId ? 'Editar Ingreso' : 'Registrar Nuevo Ingreso'}
                  </h2>
                  <p className="text-textBase text-sm mt-1">
                    {editingId ? 'Modifica los detalles del ingreso registrado.' : 'Anota un nuevo corte, propina o venta de producto.'}
                  </p>
                </div>
              </div>
              <button onClick={handleGoBack} className="p-2 text-textBase hover:text-red-400 bg-surface rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Monto Cobrado ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="w-6 h-6 text-gray-500" />
                  </div>
                  <input type="number" className="input-field pl-12 py-4 text-xl border-green-500/30 focus:border-green-500" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Nombre del Cliente (Opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input type="text" className="input-field pl-12 py-3 text-lg focus:border-green-500" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ej. Juan Pérez" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-textBase mb-2">Fecha</label>
                  <input type="date" className="input-field py-3 text-lg" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textBase mb-2">Descripción</label>
                  <input type="text" className="input-field py-3 text-lg" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Corte clásico + Barba" required />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={handleGoBack}
                  className="w-1/3 py-3 rounded-lg font-bold bg-surface border border-gray-700 text-textBase hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`w-2/3 font-bold py-3 text-lg rounded-lg transition-all duration-300 shadow-md ${
                    isSuccess 
                      ? '!bg-green-500 text-white scale-105' 
                      : editingId 
                        ? 'bg-surface border border-gray-600 text-textHighlight hover:bg-gray-800'
                        : '!bg-green-600 hover:!bg-green-500'
                  }`} 
                  disabled={createMutation.isPending || updateMutation.isPending || isSuccess}
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? 'Guardando...' 
                    : isSuccess 
                      ? '¡Guardado con éxito! ✅' 
                      : (editingId ? 'Actualizar Ingreso' : 'Registrar Ingreso')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
