import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProducts } from '../../hooks/useProducts';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { Product } from '../../types/Product';

const ProductList: React.FC = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    editProduct,
  } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState(products);
  //const [showForm, setShowForm] = useState(true);

  const filterAvailable = () => {
    setFilteredProducts(products.filter(p => p.quantityInStock > 0));
  };

  const sortByName = () => {
    setFilteredProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const resetFilters = () => {
    setFilteredProducts(products);
  };

  const handleCreate = async (product: Omit<Product, 'id'>) => {
    await addProduct(product);
    resetFilters();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    resetFilters();
  };

  const handleEdit = async (id: string, updatedProduct: Product) => {
    await editProduct(id, updatedProduct);
    resetFilters();
  };

  if (loading) return <div className="text-center py-4">⏳ Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Products</h2>
      
      {/*<ProductForm onSubmit={handleCreate} />*/}
      
      <div className="flex flex-wrap gap-4 my-4">
        <button onClick={filterAvailable} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Only Available</button>
        <button onClick={sortByName} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Sort A-Z</button>
        <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
      </div>

      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ProductList;
/*
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProducts } from '../../hooks/useProducts';
import ProductForm from './ProductForm';
import { Product } from '../../types/Product';

const ProductList: React.FC = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    deleteProduct
    //editProduct
  } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filtrar productos en stock
  const filterAvailable = () => {
    setFilteredProducts(products.filter(p => p.quantityInStock > 0));
  };

  // Ordenar productos A-Z
  const sortByName = () => {
    setFilteredProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilteredProducts(products);
  };

  const handleCreate = async (product: Omit<typeof products[0], 'id'>) => {
    await addProduct(product);
    resetFilters();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    resetFilters();
  };

  const handleEdit = async (id: string, product: Product) => {
    await editProduct(id, product);
    resetFilters();
  }
   

  // Mientras carga
  if (loading) return <div className="text-center py-4">⏳ Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Products</h2>

      <ProductForm onSubmit={handleCreate} />

      <div className="flex flex-wrap gap-4 my-4">
        <button onClick={filterAvailable} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Only Available</button>
        <button onClick={sortByName} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Sort A-Z</button>
        <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Expiration</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={product.quantityInStock === 0 ? 'bg-red-100' : ''}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">${product.unitPrice.toFixed(2)}</td>
                  <td className={`px-4 py-2 ${product.quantityInStock < 5 ? 'text-orange-600 font-semibold' : ''}`}>
                    {product.quantityInStock}
                  </td>
                  <td className="px-4 py-2">{product.expirationDate ? format(new Date(product.expirationDate), 'dd/MM/yyyy') : 'N/A'}</td>
                  <td className="px-4 py-2">{product.creationDate ? format(new Date(product.creationDate), 'd MMM yyyy', { locale: es }) : 'N/A'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
*/