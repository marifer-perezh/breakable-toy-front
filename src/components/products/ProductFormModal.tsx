import React, { useState } from 'react';
import { ProductFormData } from '../../types/Product';

interface Props {
  onSubmit: (product: ProductFormData) => Promise<void>;
  onClose: () => void;
}

const ProductFormModal: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    unitPrice: 0,
    quantityInStock: 0,
    expirationDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name.includes('Stock') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h3 className="text-lg font-semibold mb-4">Agregar Producto</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Precio</label>
            <input
              name="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              name="quantityInStock"
              type="number"
              min="0"
              value={formData.quantityInStock}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de vencimiento (opcional)</label>
            <input
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;