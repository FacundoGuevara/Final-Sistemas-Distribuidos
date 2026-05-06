import React from 'react';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  getStatusColor: (status: Order['status']) => string;
  getStatusText: (status: Order['status']) => string;
  userView?: boolean;
}

const statusDot: Record<string, string> = {
  pending:     'bg-amber-400',
  in_progress: 'bg-medblue-500',
  completed:   'bg-emerald-500',
  cancelled:   'bg-red-400',
};

const statusBadge: Record<string, string> = {
  pending:     'bg-amber-50  text-amber-700  border-amber-200',
  in_progress: 'bg-blue-50   text-blue-700   border-blue-200',
  completed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:   'bg-red-50    text-red-600    border-red-200',
};

const statusMap: Record<string, string> = {
  pending: 'PENDIENTE', in_progress: 'EN_PROGRESO',
  completed: 'COMPLETED', cancelled: 'CANCELLED',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, getStatusText, userView = false }) => {
  const normalizedStatus = (() => {
    if (!order.status) return 'pending';
    const s = order.status.toLowerCase();
    if (s === 'pendiente') return 'pending';
    if (s === 'en_progreso') return 'in_progress';
    if (s === 'completado' || s === 'completed') return 'completed';
    if (s === 'cancelado' || s === 'cancelled') return 'cancelled';
    return s;
  })() as Order['status'];

  const handleStatusChange = (newStatus: string) =>
    onUpdateStatus?.(order.id, statusMap[newStatus] || newStatus);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const dotCls   = statusDot[normalizedStatus]   || 'bg-slate-400';
  const badgeCls = statusBadge[normalizedStatus] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-clinic-50 border border-clinic-100 flex items-center justify-center">
            <span className="text-lg">🐾</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Turno #{order.id}</p>
            <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeCls}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotCls}`} />
          {getStatusText(normalizedStatus)}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {!userView && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-clinic-500 to-medblue-600 flex items-center justify-center text-white text-xs font-bold">
              {(order.customerName || order.customerEmail || 'C')[0].toUpperCase()}
            </div>
            <span className="text-sm text-slate-600 font-medium">
              {order.customerEmail || order.customerName || order.userId || 'Cliente'}
            </span>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-clinic-600 uppercase tracking-wider mb-2">Servicios</p>
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1.5 px-3 bg-clinic-50/60 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {(item as any).menuItem?.name || item.menuItemName || 'Servicio'}
                  </span>
                  <span className="text-xs bg-clinic-100 text-clinic-700 px-2 py-0.5 rounded-full font-semibold">
                    x{item.quantity}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-sm font-bold text-slate-700">
            Total: <span className="text-clinic-700">${order.total.toFixed(2)}</span>
          </span>

          {!userView && normalizedStatus !== 'completed' && normalizedStatus !== 'cancelled' && (
            <div className="flex gap-2">
              {normalizedStatus === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="bg-medblue-600 hover:bg-medblue-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              )}
              {normalizedStatus === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Finalizar Atención
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
