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
    addProduct,
    deleteProduct,
    fetchProducts,
    editProduct
  } = useProducts();

  //Estados
  const[showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  //Funciones
  const handleEdit = async (id: string, updated: Product) =>{
    try{
      await updateProduct(id, updated);
      await fetchProducts();
    }catch(error){
      console.error("Error updating product: ",error);
    }

  }

  const filterAvailable = () => {
    setFilteredProducts(products.filter(p => p.quantityInStock > 0));
  };

  const sortByName = () => {
    setFilteredProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const resetFilters = () => {
    setFilteredProducts(products);
  };

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
      <div className="flex flex-wrap gap-4 my-4">
        <button onClick={filterAvailable} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Only Available</button>
        <button onClick={sortByName} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Sort A-Z</button>
        <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
      </div>
      {showModal && (
        <ProductFormModal
          onSubmit={addProduct}
          onClose={() => setShowModal(false)}
        />
      )}

      <ProductFilters products={products} onFilter={setFilteredProducts} />
      <ProductTable products={filteredProducts} onDelete={deleteProduct} onEdit={handleEdit}/>
    </div>
  );
}

export default App;