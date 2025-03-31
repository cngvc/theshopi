export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000/api/gateway/v1';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
export const NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL_INTERNAL;

console.log(SERVER_URL, GATEWAY_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXTAUTH_URL_INTERNAL);
