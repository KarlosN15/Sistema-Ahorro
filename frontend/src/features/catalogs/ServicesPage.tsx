import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Scissors, Pencil, Trash2, MoreVertical, X, PlusCircle } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewView = location.pathname.endsWith('/new');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Si cambiamos de ruta manualmente, limpiamos el estado de edición
  useEffect(() => {
    if (isNewView && !editingId) {
      handleCancelEdit();
    }
  }, [isNewView]);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get('/services');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newService: any) => api.post('/services', newService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      handleCancelEdit();
      navigate('/services'); // Volver a la lista al terminar
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedService: any) => api.put(`/services/${editingId}`, updatedService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      handleCancelEdit();
      navigate('/services');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setOpenMenuId(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ name, price: Number(price), description });
    } else {
      createMutation.mutate({ name, price: Number(price), description });
    }
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setName(service.name);
    setPrice(service.price.toString());
    setDescription(service.description || '');
    setOpenMenuId(null);
    navigate('/services/new'); // Cambiar a la vista de formulario
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setDescription('');
  };

  const handleGoBack = () => {
    handleCancelEdit();
    navigate('/services');
  };

  return (
    <div className="pb-10">
      {!isNewView ? (
        // ================= VISTA DE HISTORIAL =================
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-textHighlight flex items-center">
              <Scissors className="w-7 h-7 mr-3 text-primary" />
              Tus Servicios
            </h2>
            <button onClick={() => navigate('/services/new')} className="btn-primary flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Nuevo Servicio
            </button>
          </div>
          
          {isLoading ? <p className="text-textBase animate-pulse">Cargando servicios...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services?.map((service: any) => (
                <div key={service.id} className="card hover:border-gray-600 transition-colors relative group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-surface border border-gray-700 flex items-center justify-center text-textBase">
                          <Scissors className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-textHighlight text-lg">{service.name}</h3>
                      </div>
                      
                      {/* Botón de opciones */}
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                          className="p-1 rounded-md text-textBase hover:text-textHighlight hover:bg-surface transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Menú desplegable */}
                        {openMenuId === service.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-surface border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                            <button 
                              onClick={() => handleEdit(service)}
                              className="w-full text-left px-4 py-2 text-sm text-textBase hover:bg-gray-800 hover:text-textHighlight flex items-center"
                            >
                              <Pencil className="w-4 h-4 mr-2" /> Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(service.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {service.description && <p className="text-sm text-textBase mb-4">{service.description}</p>}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-sm text-textBase">Precio sugerido</span>
                    <p className="text-textHighlight font-bold text-2xl">${service.price}</p>
                  </div>
                </div>
              ))}
              {services?.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 bg-surface/30 rounded-xl border border-dashed border-gray-700">
                  <Scissors className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-textHighlight font-bold">No has creado servicios aún.</p>
                  <p className="text-gray-500 mt-2 mb-6">Comienza añadiendo los cortes o servicios que ofreces.</p>
                  <button onClick={() => navigate('/services/new')} className="btn-primary">
                    Crear mi primer servicio
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
                    {editingId ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}
                  </h2>
                  <p className="text-textBase text-sm mt-1">
                    {editingId ? 'Modifica los detalles del servicio seleccionado.' : 'Completa los detalles para añadir un nuevo servicio al catálogo.'}
                  </p>
                </div>
              </div>
              <button onClick={handleGoBack} className="p-2 text-textBase hover:text-red-400 bg-surface rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Nombre del Servicio</label>
                <input type="text" className="input-field py-3 text-lg" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej. Corte Clásico" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Precio Sugerido ($)</label>
                <input type="number" className="input-field py-3 text-lg" value={price} onChange={e => setPrice(e.target.value)} required placeholder="Ej. 15.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textBase mb-2">Descripción (Opcional)</label>
                <textarea className="input-field py-3" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Detalles del corte, tiempo estimado, etc." />
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
                    : (editingId ? 'Actualizar Servicio' : 'Crear Servicio')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
