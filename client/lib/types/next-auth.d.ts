import { DefaultSession, User as DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    username: string;
  }

  interface Session extends DefaultSession {}
}
