import React, { useState } from 'react';
import { ProductFormData } from '../../types/Product';

interface Props {
  onSubmit: (product: ProductFormData) => Promise<void>;
}

const ProductForm: React.FC<Props> = ({ onSubmit }) => {
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
      setFormData({
        name: '',
        category: '',
        unitPrice: 0,
        quantityInStock: 0,
        expirationDate: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-md max-w-md mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-gray-700">Agregar Producto</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600">Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600">Category:</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600">Price:</label>
        <input
          name="unitPrice"
          type="number"
          min="0"
          step="0.01"
          value={formData.unitPrice}
          onChange={handleChange}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600">Stock:</label>
        <input
          name="quantityInStock"
          type="number"
          min="0"
          value={formData.quantityInStock}
          onChange={handleChange}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Expiration Date (opcional):</label>
        <input
          name="expirationDate"
          type="date"
          value={formData.expirationDate || ''}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;