'use server';

import { auth } from '@/auth';
import { ICartItem } from '@cngvc/shopi-shared-types';
import { notFound } from 'next/navigation';
import axiosInstance from '../axios';

export async function getCart() {
  const session = await auth();
  if (!session) notFound();
  try {
    const { data } = await axiosInstance.get('/cart/');
    const cart: ICartItem[] = data.metadata?.cart || [];
    return cart;
  } catch (error) {
    return [];
  }
}

export async function addToCart(productId: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.post('/cart/', {
    productId,
    quantity: 1
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function updateCart(productId: string, quantity = 1) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.put('/cart/', {
    productId,
    quantity
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function increaseItemInCart(productId: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.put('/cart/increase', {
    productId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function decreaseItemInCart(productId: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.put('/cart/decrease', {
    productId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}

export async function removeItemInCart(productId: string) {
  const session = await auth();
  if (!session) notFound();
  const { data } = await axiosInstance.put('/cart/remove-item', {
    productId
  });
  const cart: ICartItem[] = data.metadata?.cart || [];
  return cart;
}
