'use server';

import { IProductDocument, IStoreDocument } from '@cngvc/shopi-types';
import axiosPublicInstance from '../axios-public';

export async function getProductList() {
  try {
    const { data } = await axiosPublicInstance.get('/products/');
    const products: IProductDocument[] = data.metadata?.products || [];
    return products;
  } catch (error) {
    return [];
  }
}

export async function getProductByIdentifier(identifier: string) {
  try {
    const { data } = await axiosPublicInstance.get(`/products/${identifier}`);
    const { product, store }: { product: IProductDocument; store: IStoreDocument | null } = data.metadata;
    return { product, store };
  } catch (error) {
    return null;
  }
}
