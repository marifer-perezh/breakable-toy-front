import axios from 'axios';
import { ProductFormData, Product } from '../types/Product';

const API = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = async () => {
  const res = await API.get('/products');
  return res.data;
};

export const createProduct = async (product: any) => {
  const res = await API.post('/products', product);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  await API.delete(`/products/${id}`);
};

export const updateProduct = async (id: string, updatedProduct: ProductFormData) => {
  const res = await API.put(`/products/${id}`,updatedProduct);
  return res.data;
}
/*
const API_BASE_URL = 'http://localhost:9090/products';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>('http://localhost:9090/products');
  return response.data;
};

export const createProduct = async (product: ProductFormData): Promise<Product> => {
  const response = await axios.post(`${API_BASE_URL}/products`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
};
*/