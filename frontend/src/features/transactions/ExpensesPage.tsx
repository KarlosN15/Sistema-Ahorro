import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { TrendingDown, Pencil, Trash2, MoreVertical, X, PlusCircle, DollarSign } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewView = location.pathname.endsWith('/new');

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (isNewView && !editingId) {
      handleCancelEdit();
    }
  }, [isNewView]);

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => (await api.get('/expenses')).data
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data
  });

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['weekly'] });
    queryClient.invalidateQueries({ queryKey: ['history'] });
    handleCancelEdit();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/expenses');
    }, 1500);
  };

  const createMutation = useMutation({
    mutationFn: (newExpense: any) => api.post('/expenses', newExpense),
    onSuccess: onSuccessAction
  });

  const updateMutation = useMutation({
    mutationFn: (updatedExpense: any) => api.put(`/expenses/${editingId}`, updatedExpense),
    onSuccess: onSuccessAction
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
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
      categoryId: Number(categoryId),
      date: dateObj.toISOString()
    };

    if (editingId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setAmount(exp.amount.toString());
    setDescription(exp.description || '');
    setCategoryId(exp.categoryId?.toString() || '');
    setDate(new Date(exp.date).toISOString().split('T')[0]);
    setOpenMenuId(null);
    navigate('/expenses/new');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este gasto? Tus métricas globales se actualizarán.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleGoBack = () => {
    handleCancelEdit();
    navigate('/expenses');
  };

  return (
    <div className="pb-10">
      {!isNewView ? (
        // ================= VISTA DE HISTORIAL =================
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-textHighlight flex items-center">
              <TrendingDown className="w-7 h-7 mr-3 text-red-500" />
              Historial de Gastos
            </h2>
            <button onClick={() => navigate('/expenses/new')} className="btn-primary !bg-red-600 hover:!bg-red-500 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Registrar Gasto
            </button>
          </div>
          
          {loadingExpenses ? <p className="text-textBase animate-pulse">Cargando gastos...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses?.map((exp: any) => (
                <div key={exp.id} className={`card py-5 flex items-center justify-between border-l-4 hover:border-gray-600 transition-colors relative group ${exp.category?.type === 'BUSINESS' ? 'border-l-red-500' : 'border-l-orange-500'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${exp.category?.type === 'BUSINESS' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-textHighlight text-xl text-red-400">-{formatCurrency(exp.amount)}</p>
                        {exp.category && (
                          <span className="text-xs font-medium bg-gray-800 px-2 py-0.5 rounded-md text-gray-300 border border-gray-700">
                            {exp.category.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-textBase">{exp.description || 'Sin descripción'}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Botón de opciones */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === exp.id ? null : exp.id)}
                      className="p-2 rounded-md text-textBase hover:text-textHighlight hover:bg-surface transition-colors"
                    >
                      <MoreVertical className="w-6 h-6" />
                    </button>
                    
                    {/* Menú desplegable */}
                    {openMenuId === exp.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-surface border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                        <button 
                          onClick={() => handleEdit(exp)}
                          className="w-full text-left px-4 py-3 text-sm text-textBase hover:bg-gray-800 hover:text-textHighlight flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(exp.id)}
                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {expenses?.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-surface/30 rounded-xl border border-dashed border-gray-700">
                  <TrendingDown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-textHighlight font-bold">No has registrado gastos aún.</p>
                  <p className="text-gray-500 mt-2 mb-6">Lleva el control de los gastos de tu negocio y personales.</p>
                  <button onClick={() => navigate('/expenses/new')} className="btn-primary !bg-red-600 hover:!bg-red-500">
                    Añadir Gasto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // ================= VISTA DE FORMULARIO =================
        <div className="max-w-2xl mx-auto mt-8">
          <div className="card border-t-4 border-t-red-500 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                  {editingId ? <Pencil className="w-6 h-6 text-red-500" /> : <PlusCircle className="w-6 h-6 text-red-500" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textHighlight">
                    {editingId ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
                  </h2>
                  <p className="text-textBase text-sm mt-1">
                    {editingId ? 'Modifica los detalles del gasto.' : 'Anota compras, pagos de servicios o gastos personales.'}
                  </p>
                </div>
              </div>
              <button onClick={handleGoBack} className="p-2 text-textBase hover:text-red-400 bg-surface rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Monto del Gasto ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="w-6 h-6 text-gray-500" />
                  </div>
                  <input type="number" className="input-field pl-12 py-4 text-xl border-red-500/30 focus:border-red-500" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" placeholder="0.00" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-textBase mb-2">Categoría</label>
                  <select className="input-field py-3 text-lg" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                    <option value="">-- Seleccionar --</option>
                    {categories?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type === 'BUSINESS' ? 'Negocio' : 'Personal'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textBase mb-2">Fecha</label>
                  <input type="date" className="input-field py-3 text-lg" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Descripción (Opcional)</label>
                <input type="text" className="input-field py-3 text-lg" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Compra de tintes, pago de luz..." />
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
                      ? '!bg-red-500 text-white scale-105' 
                      : editingId 
                        ? 'bg-surface border border-gray-600 text-textHighlight hover:bg-gray-800'
                        : '!bg-red-600 hover:!bg-red-500'
                  }`} 
                  disabled={createMutation.isPending || updateMutation.isPending || isSuccess}
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? 'Guardando...' 
                    : isSuccess 
                      ? '¡Guardado con éxito! ✅' 
                      : (editingId ? 'Actualizar Gasto' : 'Registrar Gasto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
