import React, { useState } from 'react';
import { Product } from '../../types/Product';

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updated: Product) => void;
  toggleSort: (column:keyof Product) => void;
  sortCriteria: {column:keyof Product; direction: 'asc' | 'desc'}[];
}

const ProductTable: React.FC<Props> = ({ products = [], onDelete, onEdit, toggleSort, sortCriteria }) => {
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

  const renderSortIcon = (column: keyof Product) => {
    const criteria = sortCriteria.find(c => c.column === column);
    if (!criteria) return '⇅';
    return criteria.direction === 'asc' ? '↑' : '↓';
};

//Nice to have UI :)
const getRowColor = (product: Product) =>{
  if(!product.expirationDate) return ''; //N/A
  const expiration = new Date(product.expirationDate);
  const now = new Date();
  const diffInMs = expiration.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000*60*60*24);

  if(diffInDays<7) return 'bg-red-100';
  if(diffInDays<14) return 'bg-yellow-100';
  return 'bg-green-100';
}
const getStockColor = (stock: number) => {
  if(stock < 5) return 'text-red-600 font-semibold';
  if(stock <= 10) return 'text-orange-500 font-medium';
  return '';
};
const getTextClass = (product: Product) => {
  return product.quantityInStock === 0 ? 'line-through text-gray-500':'';
};


  return (
    <div className="overflow-x-auto rounded-md shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3 border-b text-center">✓</th>
            <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('category')}>
              Category {renderSortIcon('category')}
            </th>
            <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('name')}>
              Name {renderSortIcon('name')}
            </th>
            <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('unitPrice')}>
              Price {renderSortIcon('unitPrice')}
            </th>
            <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('expirationDate')}>
              Expiration {renderSortIcon('expirationDate')}
            </th>
            <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('quantityInStock')}>
              Stock {renderSortIcon('quantityInStock')}
            </th>
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
                <td className="p-3 border-b text-center">
                  <input
                    type="checkbox"
                    checked={product.quantityInStock === 0}
                    onChange={(e)=>{
                      const isChecked = e.target.checked;
                      const newStock = isChecked ? 0:10;
                      onEdit(product.id,{...product,quantityInStock: newStock});
                    }}
                  />
                </td>
                <td className="p-3 border-b">{isEditing ? (
                  <input
                    type="text"
                    name="category"
                    value={editData.category || ''}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                />
                ) : product.category}</td>

                <td className="p-3 border-b">{isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                />
                ) : product.name}</td>

                <td className="p-3 border-b">{isEditing ? (
                  <input
                    type="number"
                    name="unitPrice"
                    value={editData.unitPrice ?? 0}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                />
                ) : `$${product.unitPrice.toFixed(2)}`}</td>

                <td className="p-3 border-b">{isEditing ? (
                  <input
                    type="date"
                    name="expirationDate"
                    value={editData.expirationDate ?? ''}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                />
                ) : product.expirationDate || 'N/A'}</td>

                <td className="p-3 border-b">{isEditing ? (
                  <input
                    type="number"
                    name="quantityInStock"
                    value={editData.quantityInStock ?? 0}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                />
                ) : product.quantityInStock}</td>

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