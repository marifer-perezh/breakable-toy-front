import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/Product';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../services/api';

export const useProducts = () => {
  //Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortCriteria, setSortCriteria] = useState<{column: keyof Product; direction: 'asc' | 'desc'}[]>([]);  
    
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
  
  const resetFilters = () => {
    setFilteredProducts(products);
  };

const toggleSort = (column: keyof Product) => {
  setSortCriteria(prev => {
    const existing = prev.find(c => c.column === column);

    if (!existing) {
      return [...prev, { column, direction: 'asc' }];
    }

    if (existing.direction === 'asc') {
      return prev.map(c =>
        c.column === column ? { ...c, direction: 'desc' } : c
      );
    }

    // Si ya estaba en 'desc', lo eliminamos
    return prev.filter(c => c.column !== column);
  });
};

const applySort = (data: Product[]) => {
  let sorted = [...data];

  sortCriteria.forEach(({ column, direction }) => {
    sorted.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (column === 'expirationDate' || column === 'creationDate' || column === 'updateDate') {
        const aDate = new Date(aVal as string);
        const bDate = new Date(bVal as string);

        return direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0; // fallback
    });
  });

  return sorted;
};

  const applyFilters = ({
  name,
  categories,
  inStockOnly
}: {
  name: string;
  categories: string[];
  inStockOnly: boolean;
}) => {
  const filtered = products.filter(p => {
    const matchesName = name
      ? p.name.toLowerCase().includes(name.toLowerCase())
      : true;

    const matchesCategories =
      categories.length > 0 ? categories.includes(p.category) : true;

    const matchesStock = inStockOnly ? p.quantityInStock > 0 : true;

    return matchesName && matchesCategories && matchesStock;
  });

  //setFilteredProducts(filtered);
  const sorted = applySort(filtered);
  setFilteredProducts(sorted);
};

  useEffect(() => {
  let result = [...products];

  // Aplicar ordenamiento múltiple
  sortCriteria.forEach(({ column, direction }) => {
    result.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      // Comparación especial para fechas
      if (column === 'expirationDate') {
        const dateA = valA ? new Date(valA).getTime() : Infinity;
        const dateB = valB ? new Date(valB).getTime() : Infinity;

        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Números o strings
      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });
  });

  setFilteredProducts(result);
}, [products, sortCriteria]);

  return {
    products,
    loading,
    error,
    filteredProducts,
    sortCriteria,
    addProduct,
    deleteProduct: removeProduct,
    editProduct,
    resetFilters,
    applyFilters,
    toggleSort
  };
};