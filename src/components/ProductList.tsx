import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipo de datos para representar un producto
interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate?: string;
  quantityInStock: number;
  creationDate?: string;
  updateDate?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // respaldo completo

  // Obtener productos al cargar la página
  useEffect(() => {
    axios.get<Product[]>('http://localhost:9090/products')
      .then(response => {
        setProducts(response.data);
        setAllProducts(response.data);
      })
      .catch(error => console.error("❌ Error al obtener productos:", error));
  }, []);

  // Crear nuevo producto desde el formulario
  const handleProductCreated = (nuevo: Product) => {
    setProducts([...products, nuevo]);
    setAllProducts([...allProducts, nuevo]);
  };

  // Filtrar productos con stock
  const filtrarDisponibles = () => {
    const disponibles = allProducts.filter(p => p.quantityInStock > 0);
    setProducts(disponibles);
  };

  // Ordenar productos por nombre A-Z
  const ordenarAZ = () => {
    const ordenados = [...products].sort((a, b) => a.name.localeCompare(b.name));
    setProducts(ordenados);
  };

  // Eliminar producto
  const eliminarProducto = (id: string) => {
    axios.delete(`http://localhost:9090/products/${id}`)
      .then(() => {
        setProducts(products.filter(p => p.id !== id));
        setAllProducts(allProducts.filter(p => p.id !== id));
      })
      .catch(err => console.error("Error al eliminar producto:", err));
  };

  return (
    <div>
      <h2>Productos en Inventario</h2>

      <ProductForm onProductCreated={handleProductCreated} />

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={filtrarDisponibles}>Ver solo en stock</button>
        <button onClick={ordenarAZ} style={{ marginLeft: '10px' }}>Ordenar A-Z</button>
      </div>

      {products.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.unitPrice.toFixed(2)}</td>
                <td>{p.quantityInStock}</td>
                <td>{p.expirationDate || 'N/A'}</td>
                <td>{p.creationDate ? format(new Date(p.creationDate), 'd MMMM yyyy', { locale: es }) : 'N/A'}</td>
                <td>
                  <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;