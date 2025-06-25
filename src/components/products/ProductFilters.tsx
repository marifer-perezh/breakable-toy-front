import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/api'; 

interface Props {
  onFilter: (filters: {
    name?: string;
    categories?: string[];
    inStockOnly?: boolean;
  }) => void;
  onReset?: () => void;
}

const ProductFilters: React.FC<Props> = ({ onFilter, onReset }) => {
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(()=> {
    getAllCategories().then(setCategories).catch(err => {
      console.error('Error loading categories', err);
    });
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onFilter({
      name,
      categories: selectedCategories,
      inStockOnly,
    });
  };

  const handleReset = () => {
    setName('');
    setSelectedCategories([]);
    setInStockOnly(false);
    onReset?.();
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-bold mb-2">Filters</h3>

      <div className="mb-3">
        <label className="block font-medium mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Search by name..."
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Categories:</label>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
          />
          Only in stock
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
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
