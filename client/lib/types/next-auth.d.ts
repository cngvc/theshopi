import { DefaultSession, User as DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    username: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
  }
}
