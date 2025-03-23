'use server';

import { IBuyerPayment, IStoreDocument, paymentScheme, shippingAddressSchema } from '@cngvc/shopi-types';
import axiosPrivateInstance from '../axios-private';
import axiosPublicInstance from '../axios-public';

export async function getStoreByStorePublicId(storePublicId: string) {
  const { data } = await axiosPublicInstance.get(`store/${storePublicId}`);
  const store: IStoreDocument = data.metadata?.store;
  return store;
}

export async function updateBuyerShippingAddress(payload: { address: string; city: string; country: string; postalCode: string }) {
  const { error, value } = shippingAddressSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  await axiosPrivateInstance.put('/buyer/shipping-address', value);
  return true;
}

export async function updateBuyerPayment(payload: IBuyerPayment) {
  const { error, value } = paymentScheme.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  await axiosPrivateInstance.put('/buyer/payment', value);
  return true;
}
