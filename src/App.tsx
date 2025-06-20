import React, { useEffect, useState } from 'react';
import ProductTable from './components/products/ProductTable';
import ProductFilters from './components/products/ProductFilters';
import ProductFormModal from './components/products/ProductFormModal';

import { updateProduct } from './services/api';
import { useProducts } from './hooks/useProducts';
import { Product } from './types/Product';

function App() {
  const {
    products,
    loading,
    error,
    filteredProducts,
    sortCriteria,
    toggleSort,
    addProduct,
    deleteProduct,
    editProduct,
    resetFilters,
    applyFilters
  } = useProducts();

  //Estados
  const[showModal, setShowModal] = useState(false);
  
  if (loading) return <div className="text-center text-gray-600 py-6">Loading products...</div>;
  if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Inventory Manager</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          New Product
        </button>
      </div>
      {showModal && (<ProductFormModal onSubmit={addProduct} onClose={() => setShowModal(false)}/>)}
      <ProductFilters products={products} onFilter={applyFilters} onReset={resetFilters}/>
      <ProductTable products={filteredProducts} onDelete={deleteProduct} onEdit={editProduct} toggleSort={toggleSort} sortCriteria={sortCriteria}/>
    </div>
  );
}

export default App;