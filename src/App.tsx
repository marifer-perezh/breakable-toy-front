import React, { useEffect, useState } from 'react';
import ProductTable from './components/products/ProductTable';
import ProductFilters from './components/products/ProductFilters';
import ProductFormModal from './components/products/ProductFormModal';
import ProductMetrics from './components/products/ProductMetrics';

import { updateProduct } from './services/api';
import { useProducts } from './hooks/useProducts';
import { Product } from './types/Product';

function App() {
  const {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    editProduct,
    //metrics,
    fetchMetrics,
    //filteredProducts,
    sortCriteria,
    toggleSort,
    applyFilters,
    fetchProducts,
    resetFilters,
    //revisar, eliminar
    fetchProductsPage,
    currentPage,
    totalPages,
    setCurrentPage,

  } = useProducts();

  //Estados
  const[showModal, setShowModal] = useState(false);

  //Cargamos productos y metricas 
    useEffect(() => {
      fetchProducts();
      fetchMetrics();
    }, []);
  
  if (loading) return <div className="text-center text-gray-600 py-6">Loading products...</div>;
  if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Inventory Manager</h1>

      {showModal && (
        <ProductFormModal onSubmit={addProduct} onClose={() => setShowModal(false)} />
      )}

      {/* Filtros */}
      <ProductFilters onFilter={applyFilters} onReset={resetFilters} />

      {/* Botón de nuevo producto */}
      <div className="flex justify-start my-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          New Product
        </button>
      </div>

      <ProductTable
        products={products}
        onDelete={deleteProduct}
        onEdit={editProduct}
        toggleSort={toggleSort}
        sortCriteria={sortCriteria}
      />

      <div className="flex justify-center mt-6 gap-4 items-center text-sm">
        <button
          onClick={() => fetchProductsPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          &#60; Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={() => fetchProductsPage(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next &#62;
        </button>
      </div>
      <ProductMetrics/>
    </div>
  );
}

export default App;