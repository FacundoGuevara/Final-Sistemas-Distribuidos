import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { MenuItem } from '../../types';
import MenuView from '../Menu/MenuView';
import MenuItemForm from './MenuItemForm';
import OrdersView from '../Orders/OrdersView';
import VeterinarioView from './VeterinarioView';

type Tab = 'menu' | 'pedidos' | 'veterinarios';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'menu',         label: 'Servicios',    icon: '🩺' },
  { id: 'pedidos',      label: 'Turnos',       icon: '📋' },
  { id: 'veterinarios', label: 'Veterinarios', icon: '👨‍⚕️' },
];

const AdminView: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('menu');

  const handleEditItem = (item: MenuItem) => { setEditingItem(item); setShowForm(true); };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = await getAccessToken();
      await apiService.deleteMenuItem(id, token);
      setRefreshKey((k) => k + 1);
    } catch {
      alert('Error al eliminar el servicio');
    }
  };

  const handleSaveItem = async (itemData: Omit<MenuItem, 'id'>) => {
    try {
      const token = await getAccessToken();
      if (editingItem) {
        await apiService.updateMenuItem(editingItem.id, itemData, token);
      } else {
        await apiService.addMenuItem(itemData, token);
      }
      setShowForm(false);
      setEditingItem(null);
      setRefreshKey((k) => k + 1);
    } catch {
      alert('Error al guardar el servicio');
    }
  };

  const handleCancelEdit = () => { setShowForm(false); setEditingItem(null); };

  return (
    <div className="space-y-8 fade-in">
      {/* Page header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold text-clinic-900 tracking-tight">Panel de Administración</h1>
        <p className="text-slate-500">Gestioná servicios, turnos y veterinarios</p>
      </div>

      {/* Segmented tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white border border-clinic-100 rounded-2xl p-1.5 gap-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-clinic-600 to-medblue-700 text-white shadow-sm'
                  : 'text-slate-500 hover:text-clinic-700 hover:bg-clinic-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Servicios */}
      {activeTab === 'menu' && (
        <div className="space-y-6 fade-in">
          <div className="flex justify-end max-w-6xl mx-auto">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-clinic-600 hover:bg-clinic-700 active:bg-clinic-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Servicio
            </button>
          </div>
          <div key={refreshKey}>
            <MenuView adminMode onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
          </div>
        </div>
      )}

      {activeTab === 'pedidos'      && <div className="fade-in"><OrdersView /></div>}
      {activeTab === 'veterinarios' && <div className="fade-in"><VeterinarioView /></div>}

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCancelEdit(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto fade-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-clinic-900">
                  {editingItem ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingItem ? 'Modificá los datos del servicio' : 'Completá los datos para agregar un servicio'}
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <MenuItemForm initialData={editingItem || undefined} onSave={handleSaveItem} onCancel={handleCancelEdit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
