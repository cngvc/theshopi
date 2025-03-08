'use server';

import { auth } from '@/auth';
import axiosInstance from '@/lib/axios';
import pages from '@/lib/constants/pages';
import { ICartItem } from '@cngvc/shopi-shared-types';
import { redirect } from 'next/navigation';

export async function getCart() {
  const session = await auth();
  if (!session) redirect(pages.signin);
  try {
    const { data } = await axiosInstance.get('/cart/');
    const cart: ICartItem[] = data.metadata?.cart || [];
    return cart;
  } catch (error) {
    return [];
  }
}

export async function addToCart(productPublicId: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.post('/cart/', {
    productPublicId,
    quantity: 1
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function updateCart(productPublicId: string, quantity = 1) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.put('/cart/', {
    productPublicId,
    quantity
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function increaseItemInCart(productPublicId: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.put('/cart/increase', {
    productPublicId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function decreaseItemInCart(productPublicId: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.put('/cart/decrease', {
    productPublicId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function removeItemInCart(productPublicId: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.put('/cart/remove-item', {
    productPublicId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}
