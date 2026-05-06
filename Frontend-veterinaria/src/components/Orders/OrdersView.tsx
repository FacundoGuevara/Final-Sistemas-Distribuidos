import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { Order } from '../../types';
import OrderCard from './OrderCard';

interface OrdersViewProps {
  userView?: boolean;
}

const statusConfig = {
  pending:     { label: 'Pendiente',   bg: 'bg-amber-50  text-amber-700  border-amber-200' },
  in_progress: { label: 'En Progreso', bg: 'bg-blue-50   text-blue-700   border-blue-200'  },
  completed:   { label: 'Completado',  bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled:   { label: 'Cancelado',   bg: 'bg-red-50    text-red-600    border-red-200'   },
};

function normalizeStatus(status: string): Order['status'] {
  const s = status?.toLowerCase() ?? '';
  if (s === 'pendiente') return 'pending';
  if (s === 'en_progreso') return 'in_progress';
  if (s === 'completado' || s === 'completed') return 'completed';
  if (s === 'cancelado' || s === 'cancelled') return 'cancelled';
  return s as Order['status'];
}

const OrdersView: React.FC<OrdersViewProps> = ({ userView = false }) => {
  const { getAccessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();
      let list: Order[] = userView
        ? await apiService.getMyOrders(token)
        : await apiService.getAllOrders(token);
      list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar turnos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await getAccessToken();
      await apiService.updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
    } catch {
      alert('Error al actualizar el estado del turno');
    }
  };

  const getStatusColor = (status: Order['status']) =>
    statusConfig[normalizeStatus(status as string) as keyof typeof statusConfig]?.bg ?? 'bg-slate-50 text-slate-600 border-slate-200';

  const getStatusText = (status: Order['status']) =>
    statusConfig[normalizeStatus(status as string) as keyof typeof statusConfig]?.label ?? String(status);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => normalizeStatus(o.status as string) === filterStatus);

  const stats = {
    total:      orders.length,
    pending:    orders.filter((o) => normalizeStatus(o.status as string) === 'pending').length,
    inProgress: orders.filter((o) => normalizeStatus(o.status as string) === 'in_progress').length,
    completed:  orders.filter((o) => normalizeStatus(o.status as string) === 'completed').length,
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="text-center space-y-2 mb-6">
          <div className="h-8 bg-clinic-100 rounded-full w-48 mx-auto animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-full w-64 mx-auto animate-pulse" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-clinic-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-24" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-32" />
                </div>
              </div>
              <div className="h-6 bg-slate-100 rounded-full w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-clinic-50 rounded-xl" />
              <div className="h-8 bg-clinic-50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-slate-600 font-medium">{error}</p>
        <button onClick={loadOrders} className="bg-clinic-600 hover:bg-clinic-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold text-clinic-900 tracking-tight">
          {userView ? 'Mis Turnos' : 'Gestión de Turnos'}
        </h1>
        <p className="text-slate-500">
          {userView ? 'Historial de tus reservas' : 'Administrá todos los turnos de la veterinaria'}
        </p>
      </div>

      {/* Stats (admin) */}
      {!userView && orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total',       value: stats.total,      color: 'bg-clinic-50   text-clinic-700   border-clinic-200' },
            { label: 'Pendientes',  value: stats.pending,    color: 'bg-amber-50    text-amber-700    border-amber-200'  },
            { label: 'En Progreso', value: stats.inProgress, color: 'bg-blue-50     text-blue-700     border-blue-200'   },
            { label: 'Completados', value: stats.completed,  color: 'bg-emerald-50  text-emerald-700  border-emerald-200'},
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl px-4 py-3 text-center border`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs font-semibold opacity-75 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Status filters */}
      {orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((s) => {
            const label = s === 'all' ? 'Todos' : getStatusText(s as Order['status']);
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                  filterStatus === s
                    ? 'bg-clinic-600 text-white border-clinic-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-clinic-400 hover:text-clinic-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-5xl">📋</div>
          <p className="text-slate-500 font-medium">
            {userView ? 'No tenés turnos aún' : 'No hay turnos para mostrar'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              userView={userView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersView;
