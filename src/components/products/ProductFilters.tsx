import React, { useState } from 'react';
import { Product } from '../../types/Product';
// import './ProductFilters.css';

interface Props {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

const ProductFilters: React.FC<Props> = ({ products, onFilter }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const applyFilters = () => {
    const filtered = products.filter(product => {
      const matchesName = nameFilter 
        ? product.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      
      const matchesCategory = categoryFilter 
        ? product.category === categoryFilter
        : true;
      
      const matchesStock = inStockOnly 
        ? product.quantityInStock > 0
        : true;

      return matchesName && matchesCategory && matchesStock;
    });

    onFilter(filtered);
  };

  const resetFilters = () => {
    setNameFilter('');
    setCategoryFilter('');
    setInStockOnly(false);
    onFilter(products);
  };

  return (
    <div className="filters-container">
      <h3>Filters</h3>
      <div className="filter-group">
        <label>Name:</label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name.."
        />
      </div>
      <div className="filter-group">
        <label>Category:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group checkbox">
        <input
          type="checkbox"
          id="stock-filter"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />
        <label htmlFor="stock-filter">Only in stock</label>
      </div>
      <div className="filter-actions">
        <button type="button" onClick={applyFilters}>Aplicar</button>
        <button type="button" onClick={resetFilters}>Limpiar</button>
      </div>
    </div>
  );
};

export default ProductFilters;