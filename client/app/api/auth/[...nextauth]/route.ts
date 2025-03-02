import axiosInstance from '@/lib/axios';
import { NEXTAUTH_SECRET } from '@/lib/constants';
import pages from '@/lib/constants/pages';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const config: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const res = await axiosInstance.post(`/auth/signin`, {
            username: credentials?.username,
            password: credentials?.password
          });
          if (res && res.data && res.data.id) {
            return {
              id: res.data.id
            };
          }
          return null;
        } catch (error: unknown) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      session.user!.name = token.sub;
      return session;
    }
  },
  pages: {
    signIn: pages.signin,
    error: pages.signin
  },
  secret: NEXTAUTH_SECRET
};

const handler = NextAuth(config);

export { handler as GET, handler as POST };
