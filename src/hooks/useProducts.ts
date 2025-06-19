import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/Product';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const editProduct = async (id: string, updatedProduct: ProductFormData) => {
    try{
      const updated = await updateProduct(id, updatedProduct);
      //setProducts(prev => [...prev, updated]);
      setProducts(prev => ({
        ...prev,
        data: prev.map(p => (p.id === id ? updated : p))
      }));
    }
    catch(err){
      setError('Error updating product');
      throw err;
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    deleteProduct: removeProduct,
    editProduct
  };
};