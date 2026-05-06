import React, { useState } from 'react';
import { MenuItem } from '../../types';

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

const categories = [
  'Consulta General',
  'Vacunación',
  'Cirugía',
  'Peluquería y Baño',
  'Odontología',
  'Diagnóstico por Imagen',
  'Análisis Clínicos',
  'Urgencias',
];

const inputBase =
  'w-full px-4 py-2.5 bg-clinic-50 border rounded-xl text-slate-800 placeholder-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-clinic-400/40 focus:bg-white transition-all duration-150';

const MenuItemForm: React.FC<MenuItemFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name:        initialData?.name        || '',
    description: initialData?.description || '',
    price:       initialData?.price       || 0,
    category:    initialData?.category    || '',
    available:   initialData?.available   ?? true,
    image:       initialData?.image       || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())        e.name        = 'El nombre es obligatorio';
    if (!formData.description.trim()) e.description = 'La descripción es obligatoria';
    if (formData.price <= 0)          e.price       = 'El precio debe ser mayor a 0';
    if (!formData.category.trim())    e.category    = 'La categoría es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'   ? parseFloat(value) || 0 :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-clinic-600 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Nombre del servicio" error={errors.name}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Consulta General"
          className={`${inputBase} ${errors.name ? 'border-red-400 focus:ring-red-300/40' : 'border-clinic-200'}`}
        />
      </Field>

      <Field label="Descripción" error={errors.description}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe el servicio..."
          className={`${inputBase} resize-none ${errors.description ? 'border-red-400 focus:ring-red-300/40' : 'border-clinic-200'}`}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio ($)" error={errors.price}>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className={`${inputBase} ${errors.price ? 'border-red-400 focus:ring-red-300/40' : 'border-clinic-200'}`}
          />
        </Field>

        <Field label="Categoría" error={errors.category}>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputBase} ${errors.category ? 'border-red-400 focus:ring-red-300/40' : 'border-clinic-200'}`}
          >
            <option value="">Seleccioná...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="URL de imagen (opcional)">
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
          className={`${inputBase} border-clinic-200`}
        />
      </Field>

      {/* Toggle disponibilidad */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${formData.available ? 'bg-clinic-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${formData.available ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
        </div>
        <span className="text-sm font-medium text-clinic-700">Servicio disponible</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-clinic-600 hover:bg-clinic-700 active:bg-clinic-800 text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all"
        >
          {initialData ? 'Actualizar' : 'Agregar'} Servicio
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-clinic-50 hover:bg-clinic-100 text-clinic-700 border border-clinic-200 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
