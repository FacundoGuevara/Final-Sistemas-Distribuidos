import React from 'react';
import { MenuItem } from '../../types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  adminMode?: boolean;
  canOrder?: boolean;
}

const categoryIcons: Record<string, string> = {
  'Consulta General': '🩺',
  'Vacunación': '💉',
  'Cirugía': '🔬',
  'Peluquería y Baño': '✂️',
  'Odontología': '🦷',
  'Diagnóstico por Imagen': '📡',
  'Análisis Clínicos': '🧪',
  'Urgencias': '🚨',
};

const categoryColors: Record<string, string> = {
  'Consulta General':      'bg-teal-50   text-teal-700   border-teal-200',
  'Vacunación':            'bg-green-50  text-green-700  border-green-200',
  'Cirugía':               'bg-violet-50 text-violet-700 border-violet-200',
  'Peluquería y Baño':     'bg-pink-50   text-pink-700   border-pink-200',
  'Odontología':           'bg-sky-50    text-sky-700    border-sky-200',
  'Diagnóstico por Imagen':'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Análisis Clínicos':     'bg-cyan-50   text-cyan-700   border-cyan-200',
  'Urgencias':             'bg-red-50    text-red-600    border-red-200',
};

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  adminMode = false,
  canOrder = false,
}) => {
  const isAvailable = item.available !== false;
  const icon = categoryIcons[item.category] || '🐾';
  const colorClass = categoryColors[item.category] || 'bg-teal-50 text-teal-700 border-teal-200';

  return (
    <div
      className={`card-hover group bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden shadow-sm ${
        !isAvailable ? 'opacity-60' : ''
      }`}
    >
      {/* Card header — teal→blue gradient */}
      <div className="relative bg-gradient-to-br from-clinic-600 via-clinic-700 to-medblue-800 p-6 flex items-start justify-between">
        <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-clinic-200 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Precio</p>
          <p className="text-white text-2xl font-bold leading-none">
            ${item.price?.toLocaleString('es-AR')}
          </p>
        </div>
        {!isAvailable && (
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-red-400 shadow-sm" title="No disponible" />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
          {item.category}
        </span>

        <div className="flex-1">
          <h3 className="text-base font-bold text-slate-800 leading-snug">{item.name}</h3>
          <p className="mt-1.5 text-slate-500 text-sm leading-relaxed line-clamp-3">{item.description}</p>
        </div>

        {!isAvailable && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            <span className="text-xs text-red-500 font-medium">No disponible</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {adminMode ? (
            <>
              <button
                onClick={() => onEdit?.(item)}
                className="flex-1 bg-clinic-50 hover:bg-clinic-100 text-clinic-700 border border-clinic-200 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-150"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (onDelete && window.confirm('¿Eliminar este servicio?')) onDelete(item.id);
                }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-150"
              >
                Eliminar
              </button>
            </>
          ) : (
            canOrder && (
              <button
                onClick={() => isAvailable && onAddToCart?.(item, 1)}
                disabled={!isAvailable}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isAvailable
                    ? 'bg-clinic-600 hover:bg-clinic-700 active:bg-clinic-800 text-white shadow-sm hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isAvailable ? '+ Agregar a reserva' : 'No disponible'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
