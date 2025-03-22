'use server';

import { auth } from '@/auth';
import axiosPrivateInstance from '@/lib/axios-private';
import pages from '@/lib/constants/pages';
import { IOrderDocument } from '@cngvc/shopi-types';
import { redirect } from 'next/navigation';

export async function getOrderByOrderPublicId(id: string) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  try {
    const { data } = await axiosPrivateInstance.get(`/orders/${id}`);
    const order: IOrderDocument = data.metadata?.order || null;
    return order;
  } catch (error) {
    return null;
  }
}

export async function getOrders() {
  const session = await auth();
  if (!session) redirect(pages.signin);
  try {
    const { data } = await axiosPrivateInstance.get('/orders/');
    const orders: IOrderDocument[] = data.metadata?.orders || [];
    return orders;
  } catch (error) {
    return [];
  }
}
export async function createOrder() {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosPrivateInstance.post('/orders');
  const order: IOrderDocument = data.metadata?.order;
  return order;
}
