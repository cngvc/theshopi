'use server';

import axiosPrivateInstance from '@/lib/axios-private';
import { IOrderDocument } from '@cngvc/shopi-types';
import { safeApiCall } from '../axios-helper';

export async function getOrderByOrderPublicId(id: string) {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get(`/orders/${id}`);
    const order: IOrderDocument = data.metadata?.order || null;
    return order;
  });
}

export async function getOrders() {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get('/orders/');
    const orders: IOrderDocument[] = data.metadata?.orders || [];
    return orders;
  });
}

export async function createOrder() {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.post('/orders');
    const order: { orderPublicId: string; clientSecret?: string } = data.metadata;
    return order;
  });
}
