'use server';

import { auth } from '@/auth';
import pages from '@/lib/constants/pages';
import { ICartItem } from '@cngvc/shopi-types';
import { redirect } from 'next/navigation';
import { safeApiCall } from '../axios-helper';
import axiosPrivateInstance from '../axios-private';

export async function getCart() {
  const session = await auth();
  if (!session) return [];
  return safeApiCall<ICartItem[]>(async () => {
    const response = await axiosPrivateInstance.get('/cart');
    return response.data.metadata?.cart || [];
  });
}

export async function addToCart(productPublicId: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  return safeApiCall<void>(async () => {
    await axiosPrivateInstance.post('/cart/', {
      productPublicId,
      quantity: 1
    });
  });
}

export async function updateCart(productPublicId: string, quantity = 1) {
  return safeApiCall<void>(async () => {
    await axiosPrivateInstance.put('/cart/', {
      productPublicId,
      quantity
    });
  });
}

export async function increaseItemInCart(productPublicId: string) {
  return safeApiCall<void>(async () => {
    await axiosPrivateInstance.put('/cart/increase', {
      productPublicId
    });
  });
}

export async function decreaseItemInCart(productPublicId: string) {
  return safeApiCall<void>(async () => {
    await axiosPrivateInstance.put('/cart/decrease', {
      productPublicId
    });
  });
}

export async function removeItemInCart(productPublicId: string) {
  return safeApiCall<void>(async () => {
    await axiosPrivateInstance.put('/cart/remove-item', {
      productPublicId
    });
  });
}
