import React, { useEffect, useState } from 'react';
import { getInventoryMetrics } from '../../services/api';

interface Metrics {
  overall: {
    totalValue: number;
    totalStock: number;
    averagePrice: number;
  };
  byCategory: {
    [category: string]: {
      totalValue: number;
      totalStock: number;
      averagePrice: number;
    };
  };
}

const ProductMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getInventoryMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p className="text-gray-500">Loading metrics...</p>;
  if (!metrics) return <p className="text-red-500">Failed to load metrics.</p>;

  return (
    <div className="bg-white p-6 shadow rounded-md mb-6">
      <h2 className="text-xl font-bold mb-4">Inventory Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Total Stock</h3>
          <p>{metrics.overall.totalStock}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Total Value</h3>
          <p>${metrics.overall.totalValue?.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Avg Price</h3>
          <p>${metrics.overall.averagePrice?.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">By Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(metrics.byCategory).map(([category, data]) => (
          <div key={category} className="bg-gray-50 p-4 rounded border">
            <h4 className="font-bold">{category}</h4>
            <p>Stock: {data.totalStock}</p>
            <p>Value: ${data.totalValue?.toFixed(2)}</p>
            <p>Avg Price: ${data.averagePrice?.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMetrics;