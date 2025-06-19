import React, { useEffect, useState } from 'react';
import { useProducts } from './hooks/useProducts';
import ProductForm from './components/products/ProductForm';
import ProductTable from './components/products/ProductTable';
import ProductFilters from './components/products/ProductFilters';
import { Product } from './types/Product';
import ProductFormModal from './components/products/ProductFormModal';
import { updateProduct } from './services/api';

function App() {
  const {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    fetchProducts
  } = useProducts();

  const[showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleEdit = async (id: string, updated: Product) =>{
    try{
      await updateProduct(id, updated);
      await fetchProducts();
    }catch(error){
      console.error("Error updating product: ",error);
    }

  }

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

{showModal && (
  <ProductFormModal
    onSubmit={(data) => {
      console.log("🧪 Modal creation form submitted", data);
      return addProduct(data);
    }}
    onClose={() => setShowModal(false)}
  />
)}

      <ProductFilters products={products} onFilter={setFilteredProducts} />
      <ProductTable products={filteredProducts} onDelete={deleteProduct} onEdit={handleEdit}/>
    </div>
  );
}

export default App;