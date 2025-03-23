import axios from 'axios';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

export async function unsafeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    return null;
  }
}

export async function safeAuthCall(
  apiCall: () => Promise<{ success: boolean; message: string }>
): Promise<{ success: boolean; message: string }> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: getErrorMessage(error) };
  }
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Something went wrong.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
  return 'An unknown error occurred.';
}
