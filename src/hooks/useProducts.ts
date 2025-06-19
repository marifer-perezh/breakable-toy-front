import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/Product';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(); //Esto ahora retorna Product[]
      setProducts(data);
    } catch (err) {
      setError('Error loading products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: ProductFormData) => {
    try {
      const newProduct = await createProduct(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError('Error creating product');
      throw err;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error deleting product');
      throw err;
    }
  };

  const editProduct = async (id: string, updated: Product) => {
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

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return {
    products,
    loading,
    error,
    filteredProducts,
    fetchProducts,
    addProduct,
    deleteProduct: removeProduct,
    editProduct,
    filterAvailable,
    sortByName,
    resetFilters,
    setFilteredProducts
  };
};