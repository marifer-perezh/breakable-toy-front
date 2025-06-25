import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/Product';
import { getProducts, createProduct, deleteProduct, updateProduct, getProductPage, getInventoryMetrics, getProductsFiltered } from '../services/api';

export const useProducts = () => {
  //Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null); 

  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<{ column: keyof Product; direction: 'asc' | 'desc' }[]>([]);
  
  const [page, setPage] = useState(0);
  const pageSize = 10;


  //Proximos a eliminar
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);  
  //const [sortCriteria, setSortCriteria] = useState<{column: keyof Product; direction: 'asc' | 'desc'}[]>([]); 
  
  //Metodos convencionales :)
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

  //Filtraje paginacion y ordenado, nuevo GET :)
  const fetchProducts = async () => {
  try {
    setLoading(true);

    // Construir dinámicamente los filtros válidos
    const sort = sortCriteria.map(s => `${s.column},${s.direction}`);

    const filters: any = {
      page,
      size: pageSize,
    };

    if (nameFilter.trim() !== '') {
      filters.name = nameFilter.trim();
    }

    if (categoryFilter.length > 0) {
      filters.categories = categoryFilter;
    }

    if (inStockOnly === true) {
      filters.inStock = true;
    }

    if (sort.length > 0) {
      filters.sort = sort;
    }

    const data = await getProductsFiltered(filters);
    setProducts(data.content);
    setTotalPages(data.totalPages); // importante si estás usando paginación
    setCurrentPage(data.number);    // para mantener actualizado el número de página
  } catch (err) {
    console.error(" Error fetching products", err);
    setError('Error loading products');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, [nameFilter, categoryFilter, inStockOnly, sortCriteria, page]);

  const toggleSort = (column: keyof Product) => {
    setSortCriteria(prev => {
      const existing = prev.find(s => s.column === column);
      if (!existing) return [...prev, { column, direction: 'asc' }];
      if (existing.direction === 'asc') return prev.map(s => s.column === column ? { ...s, direction: 'desc' } : s);
      return prev.filter(s => s.column !== column); // remove sort
    });
  };

  const applyFilters = (filters: {
    name?: string;
    categories?: string[];
    inStockOnly?: boolean;
  }) => {
    setNameFilter(filters.name || '');
    setCategoryFilter(filters.categories || []);
    setInStockOnly(!!filters.inStockOnly);
    setPage(0); // reset to first page on new filters
  };

  const resetFilters = () => {
    setNameFilter('');
    setCategoryFilter([]);
    setInStockOnly(false);
    setSortCriteria([]);
    setPage(0);
  }


    //Proximos a eliminar
    const fetchProductsPage = async (index: number) => {
    try {
      setLoading(true);
      const data = await getProductPage(index); 
      setProducts(data.content);
      setFilteredProducts(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Error loading paginated products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
const fetchMetrics = async () => {
  try{
    const data = await getInventoryMetrics();
    setMetrics(data);
  }
  catch (err){
    console.error('Error loading Metrics', err);
  }
}


  return {
    products,
    loading,
    error,
    addProduct,
    deleteProduct: removeProduct,
    editProduct,
    //metrics,
    fetchMetrics,
    //filteredProducts,
    sortCriteria,
    toggleSort,
    applyFilters,
    setPage,
    page,
    fetchProducts,
    resetFilters,
    //revisar, eliminar
    fetchProductsPage,
    currentPage,
    totalPages,
    setCurrentPage
  };
};