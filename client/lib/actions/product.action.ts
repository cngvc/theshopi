'use server';

import { IProductDocument } from '@cngvc/shopi-shared-types';
import axiosInstance from '../axios';

export async function getProductList() {
  const { data } = await axiosInstance.get('/products/');
  const products: IProductDocument[] = data.metadata?.products || [];
  return products;
}

export async function getProductByIdentifier(identifier: string) {
  try {
    const { data } = await axiosInstance.get(`/products/${identifier}`);
    const product: IProductDocument = data.metadata?.product;
    return product;
  } catch (error) {
    return null;
  }
}
