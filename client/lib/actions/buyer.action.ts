'use server';

import { IBuyerDocument, IBuyerPayment, paymentScheme, shippingAddressSchema } from '@cngvc/shopi-types';
import { safeApiCall } from '../axios-helper';
import axiosPrivateInstance from '../axios-private';

export async function getCurrentBuyer() {
  return await safeApiCall(async () => {
    const { data } = await axiosPrivateInstance.get('/buyer/me');
    return data.metadata?.buyer as IBuyerDocument;
  });
}

export async function updateBuyerShippingAddress(payload: { address: string; city: string; country: string; postalCode: string }) {
  return await safeApiCall(async () => {
    const { error, value } = shippingAddressSchema.validate(payload);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await axiosPrivateInstance.put('/buyer/shipping-address', value);
  });
}

export async function updateBuyerPayment(payload: IBuyerPayment) {
  return await safeApiCall(async () => {
    const { error, value } = paymentScheme.validate(payload);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await axiosPrivateInstance.put('/buyer/payment', value);
  });
}
