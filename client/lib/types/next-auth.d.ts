import { DefaultSession, User as DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    accessToken: string;
    username: string;
  }

  interface Session extends DefaultSession {}
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     accessToken: string;
//     username: string;
//   }
// }
