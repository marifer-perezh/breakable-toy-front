import React from 'react';
import { Product } from '../../types/Product';

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<Props> = ({ products = [], onDelete }) => {
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
                  <button
                    onClick={() => onDelete(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
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