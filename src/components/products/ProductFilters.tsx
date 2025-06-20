import React, { useState } from 'react';
import { Product } from '../../types/Product';

interface Props {
  products: Product[];
  onFilter: (filters: {
    name: string;
    categories: string[];
    inStockOnly: boolean;
  }) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<Props> = ({ products, onFilter, onReset }) => {
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onFilter({ name, categories: selectedCategories, inStockOnly });
  };

  const handleReset = () => {
    setName('');
    setSelectedCategories([]);
    setInStockOnly(false);
    onReset();
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      <div className="mb-3">
        <label className="block font-medium">Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-3 py-2 border rounded mt-1"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Category:</label>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(prev => !prev)}
          />
          Only in stock
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;