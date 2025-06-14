import React, { useState } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: string;
  quantityInStock: number;
  creationDate: string;
  updateDate: string;
}

interface Props {
  onProductCreated: (product: Product) => void;
}

const ProductForm: React.FC<Props> = ({ onProductCreated }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    unitPrice: 0,
    expirationDate: '',
    quantityInStock: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post<Product>('http://localhost:9090/products', {
      ...product,
      unitPrice: Number(product.unitPrice),
      quantityInStock: Number(product.quantityInStock),
    })
      .then(res => {
        onProductCreated(res.data);
        setProduct({
          name: '',
          category: '',
          unitPrice: 0,
          expirationDate: '',
          quantityInStock: 0,
        });
      })
      .catch(err => console.error("Error al crear producto:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Crear nuevo producto</h3>
      <input name="name" placeholder="Nombre" value={product.name} onChange={handleChange} required />
      <input name="category" placeholder="Categoría" value={product.category} onChange={handleChange} required />
      <input name="unitPrice" type="number" placeholder="Precio" value={product.unitPrice} onChange={handleChange} required />
      <input name="quantityInStock" type="number" placeholder="Stock" value={product.quantityInStock} onChange={handleChange} required />
      <input name="expirationDate" type="date" value={product.expirationDate} onChange={handleChange} />
      <button type="submit">Guardar producto</button>
    </form>
  );
};

export default ProductForm;