'use server';

import { auth } from '@/auth';
import { IBuyerDocument, IPayment, paymentScheme, shippingAddressSchema } from '@cngvc/shopi-types';
import { redirect } from 'next/navigation';
import axiosInstance from '../axios';
import pages from '../constants/pages';

export async function getCurrentBuyer() {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { data } = await axiosInstance.get('/buyer/me');
  const buyer: IBuyerDocument = data.metadata?.buyer;
  return buyer;
}

export async function updateBuyerShippingAddress(payload: { address: string; city: string; country: string; postalCode: string }) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { error, value } = shippingAddressSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  await axiosInstance.put('/buyer/shipping-address', value);
  return true;
}

export async function updateBuyerPayment(payload: IPayment) {
  const session = await auth();
  if (!session) redirect(pages.signin);
  const { error, value } = paymentScheme.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  await axiosInstance.put('/buyer/payment', value);
  return true;
}
