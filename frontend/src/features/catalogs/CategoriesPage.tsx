import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Tags, Pencil, Trash2, MoreVertical, X, Briefcase, User, PlusCircle } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewView = location.pathname.endsWith('/new');

  const [name, setName] = useState('');
  const [type, setType] = useState('BUSINESS');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (isNewView && !editingId) {
      handleCancelEdit();
    }
  }, [isNewView]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newCat: any) => api.post('/categories', newCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCancelEdit();
      navigate('/categories');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedCat: any) => api.put(`/categories/${editingId}`, updatedCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCancelEdit();
      navigate('/categories');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setOpenMenuId(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ name, type });
    } else {
      createMutation.mutate({ name, type });
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setType(cat.type);
    setOpenMenuId(null);
    navigate('/categories/new');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría? Si tiene gastos asociados, podrían verse afectados.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setType('BUSINESS');
  };

  const handleGoBack = () => {
    handleCancelEdit();
    navigate('/categories');
  };

  return (
    <div className="pb-10">
      {!isNewView ? (
        // ================= VISTA DE HISTORIAL =================
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-textHighlight flex items-center">
              <Tags className="w-7 h-7 mr-3 text-primary" />
              Categorías de Gasto
            </h2>
            <button onClick={() => navigate('/categories/new')} className="btn-primary flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Nueva Categoría
            </button>
          </div>
          
          {isLoading ? <p className="text-textBase animate-pulse">Cargando categorías...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories?.map((cat: any) => (
                <div key={cat.id} className="card hover:border-gray-600 transition-colors relative group flex flex-col justify-between h-full py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-surface border border-gray-700 flex items-center justify-center text-textBase">
                        {cat.type === 'BUSINESS' ? <Briefcase className="w-7 h-7" /> : <User className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-textHighlight text-xl">{cat.name}</h3>
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-md mt-2 ${cat.type === 'BUSINESS' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                          {cat.type === 'BUSINESS' ? 'NEGOCIO' : 'PERSONAL'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botón de opciones */}
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === cat.id ? null : cat.id)}
                        className="p-1 rounded-md text-textBase hover:text-textHighlight hover:bg-surface transition-colors"
                      >
                        <MoreVertical className="w-6 h-6" />
                      </button>
                      
                      {/* Menú desplegable */}
                      {openMenuId === cat.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-surface border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                          <button 
                            onClick={() => handleEdit(cat)}
                            className="w-full text-left px-4 py-3 text-sm text-textBase hover:bg-gray-800 hover:text-textHighlight flex items-center"
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {categories?.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 bg-surface/30 rounded-xl border border-dashed border-gray-700">
                  <Tags className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-textHighlight font-bold">No hay categorías registradas.</p>
                  <p className="text-gray-500 mt-2 mb-6">Crea tu primera categoría para organizar tus gastos.</p>
                  <button onClick={() => navigate('/categories/new')} className="btn-primary">
                    Crear Categoría
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // ================= VISTA DE FORMULARIO =================
        <div className="max-w-2xl mx-auto mt-8">
          <div className="card border-t-4 border-t-primary shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  {editingId ? <Pencil className="w-6 h-6 text-primary" /> : <PlusCircle className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textHighlight">
                    {editingId ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
                  </h2>
                  <p className="text-textBase text-sm mt-1">
                    {editingId ? 'Modifica los detalles de la categoría.' : 'Clasifica tus gastos para mantener tus reportes organizados.'}
                  </p>
                </div>
              </div>
              <button onClick={handleGoBack} className="p-2 text-textBase hover:text-red-400 bg-surface rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Nombre de la Categoría</label>
                <input type="text" className="input-field py-3 text-lg" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej. Alquiler Local, Productos, Comida" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Tipo de Gasto</label>
                <select className="input-field py-3 text-lg" value={type} onChange={e => setType(e.target.value)}>
                  <option value="BUSINESS">Gasto de Negocio (Local/Herramientas)</option>
                  <option value="PERSONAL">Gasto Personal (Comida/Ropa)</option>
                </select>
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
                  className={`w-2/3 font-bold py-3 text-lg rounded-lg transition-colors shadow-md ${
                    editingId ? 'bg-primary text-[#0B0C10] hover:bg-primaryHover' : 'btn-primary'
                  }`} 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? 'Guardando...' 
                    : (editingId ? 'Actualizar Categoría' : 'Crear Categoría')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
