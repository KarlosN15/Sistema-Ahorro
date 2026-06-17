import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Receipt, TrendingDown, Scissors, LogOut, Tags, Calendar, Sparkles, ChevronDown, Menu, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { 
      name: 'Servicios', 
      icon: Scissors,
      subItems: [
        { name: 'Listado de Servicios', path: '/services' },
        { name: 'Añadir Nuevo', path: '/services/new' },
      ]
    },
    { 
      name: 'Ingresos', 
      icon: Receipt,
      subItems: [
        { name: 'Historial de Ingresos', path: '/incomes' },
        { name: 'Registrar Ingreso', path: '/incomes/new' },
      ]
    },
    { 
      name: 'Gastos', 
      icon: TrendingDown,
      subItems: [
        { name: 'Historial de Gastos', path: '/expenses' },
        { name: 'Registrar Gasto', path: '/expenses/new' },
      ]
    },
    { 
      name: 'Categorías', 
      icon: Tags,
      subItems: [
        { name: 'Ver Categorías', path: '/categories' },
        { name: 'Nueva Categoría', path: '/categories/new' },
      ]
    },
    { name: 'Historial', path: '/history', icon: Calendar },
    { name: 'Asistente IA', path: '/ai-planner', icon: Sparkles },
  ];

  // Auto-abrir el menú si estamos en una de sus sub-rutas
  useEffect(() => {
    const activeItem = menuItems.find(item => 
      item.subItems?.some(sub => location.pathname === sub.path)
    );
    if (activeItem) {
      setOpenMenu(activeItem.name);
    }
    // Cerrar menú móvil al cambiar de ruta
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-700/50 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-gray-800 py-4">
          <img src="/logo.png" alt="La Maxima Barbershop" className="h-full object-contain drop-shadow-md" />
          <button className="md:hidden text-textBase hover:text-textHighlight" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = !!item.subItems;
            const isActive = item.path ? location.pathname === item.path : item.subItems?.some(sub => location.pathname === sub.path);
            const isOpen = openMenu === item.name;

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                      isActive || isOpen
                        ? 'border-l-4 border-primary bg-surface/50 text-textHighlight' 
                        : 'border-l-4 border-transparent text-textBase hover:bg-surface/30 hover:text-textHighlight'
                    }`}
                  >
                    <div className="flex items-center justify-start w-full">
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    className={`flex items-center justify-start px-6 py-3 transition-colors ${
                      isActive 
                        ? 'border-l-4 border-primary bg-surface/50 text-textHighlight' 
                        : 'border-l-4 border-transparent text-textBase hover:bg-surface/30 hover:text-textHighlight'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}

                {/* SubItems */}
                {hasSubItems && isOpen && (
                  <div className="bg-surface/20 py-2 space-y-1 border-l-4 border-transparent">
                    {item.subItems!.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className={`block pl-14 pr-6 py-2 text-sm transition-colors ${
                          location.pathname === sub.path 
                            ? 'text-primary font-medium' 
                            : 'text-textBase hover:text-textHighlight hover:bg-surface/40'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700/50 space-y-3">
          <Link 
            to="/incomes/new" 
            className="flex items-center justify-center w-full px-4 py-3 bg-primary hover:bg-primaryHover text-[#0B0C10] font-bold rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            <Scissors className="w-5 h-5 mr-2" />
            <span>+ Registrar Corte</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-start w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-surface border-b border-gray-700/50 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-textBase hover:text-textHighlight"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-textHighlight hidden md:block">Panel de Control</h2>
          </div>
          <div className="flex items-center">
            <span className="text-textBase text-sm md:text-base mr-3 md:mr-4">Hola, <strong className="text-textHighlight">{user?.name || user?.email?.split('@')[0]}</strong></span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface border border-gray-700 flex items-center justify-center text-textHighlight font-bold text-sm md:text-base">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
