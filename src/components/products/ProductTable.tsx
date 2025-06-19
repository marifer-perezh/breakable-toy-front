import React, { useState } from 'react';
import { Product } from '../../types/Product';

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updated: Product) => void;
}

const ProductTable: React.FC<Props> = ({ products = [], onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'unitPrice' || name === 'quantityInStock' ? Number(value) : value,
    }));
  };

  return (
    <div className="overflow-x-auto rounded-md shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Stock</th>
            <th className="p-3 border-b">Expiration</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const isEditing = editingId === product.id;

            return (
              <tr
                key={product.id}
                className={product.quantityInStock === 0 ? 'bg-red-50 text-red-800' : 'hover:bg-gray-50'}
              >
                <td className="p-3 border-b">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name || ''}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing ? (
                    <input
                      type="text"
                      name="category"
                      value={editData.category || ''}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    product.category
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing ? (
                    <input
                      type="number"
                      name="unitPrice"
                      value={editData.unitPrice ?? 0}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    `$${product.unitPrice.toFixed(2)}`
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing ? (
                    <input
                      type="number"
                      name="quantityInStock"
                      value={editData.quantityInStock ?? 0}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    product.quantityInStock
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing ? (
                    <input
                      type="date"
                      name="expirationDate"
                      value={editData.expirationDate ?? ''}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    product.expirationDate || 'N/A'
                  )}
                </td>
                <td className="p-3 border-b">
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            onEdit(editingId, editData as Product);
                            cancelEdit();
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(product)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
/*
import React from 'react';
import { Product } from '../../types/Product';

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string, product: Product) => void;
}

const ProductTable: React.FC<Props> = ({ products = [], onDelete, onEdit }) => {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center">No hay productos disponibles.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Stock</th>
            <th className="p-3 border-b">Expiration</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const isOutOfStock = product.quantityInStock === 0;
            const isLowStock = product.quantityInStock > 0 && product.quantityInStock < 5;

            return (
              <tr
                key={product.id}
                className={isOutOfStock ? 'bg-red-50 text-red-800' : 'hover:bg-gray-50'}
              >
                <td className="p-3 border-b">{product.name}</td>
                <td className="p-3 border-b">{product.category}</td>
                <td className="p-3 border-b">${product.unitPrice.toFixed(2)}</td>
                <td className={`p-3 border-b ${isLowStock ? 'text-yellow-600 font-medium' : ''}`}>
                  {product.quantityInStock}
                </td>
                <td className="p-3 border-b">
                  {product.expirationDate ? product.expirationDate : 'N/A'}
                </td>
                <td className="p-3 border-b">
                  <div className = "flex gap-2">
                  <button
                    onClick={() => onEdit(product.id, product)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Eliminate
                  </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
*/