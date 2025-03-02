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
      async authorize(credentials, req) {
        try {
          const { data } = await axiosInstance.post(
            `/auth/signin`,
            {
              username: credentials?.username,
              password: credentials?.password
            },
            {
              withCredentials: true
            }
          );
          if (data?.user) {
            return {
              id: data.user.id,
              name: data.user.username
            };
          }
          return null;
        } catch (error: unknown) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token, user, trigger }) {
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
