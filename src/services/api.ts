import axios from 'axios';
import qs from 'qs';
import { ProductFormData, Product } from '../types/Product';

const API = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: params => qs.stringify(params,{arrayFormat: 'repeat'})
});

//Todos los productos
export const getProducts = async () => {
  const res = await API.get('/products');
  return res.data.content;
};

export const getProductPage = async (page: number) => {
  const res = await API.get(`/products?page=${page}&size=10`);
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
};

export const getInventoryMetrics = async () =>{
  const res = await API.get('/products/metrics');
  return res.data;
};

export const getAllCategories = async () =>{
  const res = await API.get('/products/categories');
  return res.data;
};

export const getProductsFiltered = async ({
  name,
  categories,
  inStock,
  sort,
  page,
  size
}: {
  name?: string;
  categories?: string[];
  inStock?: boolean;
  sort?: string[];
  page?: number;
  size?: number;
}) => {
  const params: any = {};

  if (name && name.trim() !== '') params.name = name.trim();
  if (categories && categories.length > 0) params.categories = categories;
  if (typeof inStock === 'boolean') params.inStock = inStock;
  if (sort && sort.length > 0) params.sort = sort;
  if (page !== undefined) params.page = page;
  if (size !== undefined) params.size = size;

  const res = await API.get('/products', { params });
  return res.data;
};