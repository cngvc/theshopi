import axiosInstance from '@/lib/axios';
import pages from '@/lib/constants/pages';
import NextAuth, { NextAuthConfig, User } from 'next-auth';
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
            const { user, accessToken } = data.metadata;
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              username: user.username,
              accessToken: accessToken
            } as User;
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
    },
    async redirect({ url, baseUrl }) {
      if (url === '/api/auth/signout') return `${baseUrl}/login`;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async authorized({ request, auth }: any) {
      const protectedPaths = [/\/message\/(.*)/];
      const { pathname } = request.nextUrl;
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      return true;
    }
  },
  pages: {
    signIn: pages.signin,
    error: pages.signin
  },
  secret: NEXTAUTH_SECRET
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
