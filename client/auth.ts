import axiosInstance from '@/lib/axios';
import pages from '@/lib/constants/pages';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NEXTAUTH_SECRET } from './lib/configs';

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
          if (data?.metadata?.user) {
            return {
              id: data.metadata.user.id,
              name: data.metadata.user.username,
              email: data.metadata.user.email,
              username: data.metadata.user.username,
              accessToken: data.metadata.accessToken
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
        session.user = { ...(token.user as any), accessToken: token.accessToken };
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
