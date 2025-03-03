import axiosInstance from '@/lib/axios';
import { NEXTAUTH_SECRET } from '@/lib/constants';
import pages from '@/lib/constants/pages';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { data } = await axiosInstance.post(`/auth/signin`, {
            username: credentials?.username,
            password: credentials?.password
          });
          if (data?.user) {
            return {
              id: data.user.id,
              name: data.user.username,
              email: data.user.email,
              accessToken: data.accessToken
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
    async jwt({ token, user, account }) {
      if (user && account) {
        const { accessToken } = user;
        return { ...token, accessToken, user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = `${token.accessToken}`;
      }
      return session;
    }
  },
  pages: {
    signIn: pages.signin,
    error: pages.signin
  },
  secret: NEXTAUTH_SECRET
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
