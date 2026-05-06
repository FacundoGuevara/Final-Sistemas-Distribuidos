import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { MenuItem, OrderItem } from '../../types';
import MenuCard from './MenuCard';

interface MenuViewProps {
  adminMode?: boolean;
  onEditItem?: (item: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

const ALL = 'Todos';

const MenuView: React.FC<MenuViewProps> = ({ adminMode = false, onEditItem, onDeleteItem }) => {
  const { isAuthenticated, hasRole, getAccessToken } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { loadMenu(); }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      let items: MenuItem[];
      if (adminMode && isAuthenticated) {
        const token = await getAccessToken();
        items = await apiService.getFullMenu(token);
      } else {
        items = await apiService.getPublicMenu();
      }
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const categories = [ALL, ...Array.from(new Set(menuItems.map((i) => i.category)))];
  const filtered = activeCategory === ALL ? menuItems : menuItems.filter((i) => i.category === activeCategory);

  const addToCart = (item: MenuItem, qty = 1) => {
    console.log('[Cart] addToCart llamado:', item.name, '| isAuthenticated:', isAuthenticated, '| hasRole cliente:', hasRole('cliente'));
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + qty } : c);
      return [...prev, { id: Date.now().toString(), menuItemId: item.id, menuItemName: item.name, quantity: qty, price: item.price }];
    });
  };

  const removeFromCart = (id: string) => setCart((p) => p.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart((p) => p.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const placeOrder = async () => {
    console.log('[Order] placeOrder | isAuthenticated:', isAuthenticated, '| cart:', cart.length);
    if (!isAuthenticated || cart.length === 0) return;
    try {
      const token = await getAccessToken();
      const payload = cart.map((i) => ({ menuItem: { id: i.menuItemId }, quantity: i.quantity, price: i.price }));
      console.log('[Order] enviando:', JSON.stringify(payload));
      await apiService.createOrder(payload, token);
      setCart([]);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      console.error('[Order] error:', err);
      alert('Error al realizar el pedido: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <div className="h-8 bg-clinic-100 rounded-full w-48 mx-auto animate-pulse" />
          <div className="h-4 bg-clinic-100 rounded-full w-72 mx-auto animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-clinic-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-28 bg-gradient-to-br from-clinic-100 to-medblue-100" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                <div className="h-3 bg-slate-100 rounded-full w-full" />
                <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                <div className="h-9 bg-clinic-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-slate-600 font-medium">{error}</p>
        <button
          onClick={loadMenu}
          className="bg-clinic-600 hover:bg-clinic-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8 fade-in max-w-7xl mx-auto">
      {/* Page header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-clinic-900 tracking-tight">
          {adminMode ? 'Administrar Servicios' : 'Nuestros Servicios'}
        </h1>
        <p className="text-slate-500">
          {adminMode
            ? 'Gestioná los servicios veterinarios disponibles'
            : 'Encontrá el cuidado ideal para tu mascota'}
        </p>
      </div>

      {/* Category filters */}
      {!adminMode && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-clinic-600 text-white border-clinic-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-clinic-400 hover:text-clinic-700 hover:bg-clinic-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-slate-500 font-medium">No hay servicios disponibles por el momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              adminMode={adminMode}
              canOrder={isAuthenticated && hasRole('cliente')}
            />
          ))}
        </div>
      )}

    </div>

    {/* Portal: renderiza fuera del árbol para evitar que transforms del padre rompan fixed */}
    {mounted && createPortal(
      <>
        {orderSuccess && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold text-sm flex items-center gap-2 z-[9999]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            ¡Turno reservado con éxito!
          </div>
        )}

        {isAuthenticated && hasRole('cliente') && cart.length > 0 && (
          <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
            <div className="bg-gradient-to-r from-clinic-600 to-medblue-700 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">Tu Reserva</span>
                <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((a, i) => a + i.quantity, 0)}
                </span>
              </div>
            </div>

            <div className="px-4 py-3 space-y-2.5 max-h-52 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.menuItemName}</p>
                    <p className="text-xs text-slate-400">${item.price.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-clinic-50 rounded-lg px-1 py-0.5">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-clinic-600 hover:text-clinic-800 font-bold text-base leading-none"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-clinic-600 hover:text-clinic-800 font-bold text-base leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-500 font-medium">Total</span>
                <span className="text-base font-bold text-clinic-800">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-clinic-600 hover:bg-clinic-700 active:bg-clinic-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        )}
      </>,
      document.body
    )}
    </>
  );
};

export default MenuView;
