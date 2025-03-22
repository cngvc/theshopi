import axiosPrivateInstance from '@/lib/axios-private';
import pages from '@/lib/constants/pages';
import NextAuth, { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NEXTAUTH_SECRET } from './lib/configs';

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
        accessToken: { type: 'text', required: false },
        refreshToken: { type: 'text', required: false },
        type: { type: 'text', required: true, defaultValue: 'credentials' }
      },
      async authorize(credentials) {
        if (credentials.type === 'credentials') {
          try {
            const { data } = await axiosPrivateInstance.post('/auth/signin', {
              username: credentials?.username,
              password: credentials?.password
            });
            if (data?.metadata?.user) {
              const { user, accessToken, refreshToken } = data.metadata;
              console.log({ accessToken, refreshToken });
              return {
                id: user.id,
                name: user.username,
                email: user.email,
                username: user.username,
                accessToken: accessToken,
                refreshToken: refreshToken
              } as User;
            }
            return null;
          } catch (error: unknown) {
            return null;
          }
        }
        if (credentials.type === 'sso') {
          const { data } = await axiosPrivateInstance.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`
            } as Record<string, string>
          });
          if (data?.metadata?.user) {
            const { user } = data.metadata;
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              username: user.username,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken
            } as User;
          }
          return null;
        }
        if (credentials.type === 'refresh-token') {
          return {
            accessToken: credentials.accessToken!,
            refreshToken: credentials.refreshToken!
          } as User;
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          sub: user.id,
          email: user.email,
          id: user.id,
          name: user.username,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        };
      }
      return token;
    },
    async session({ session, token, trigger }) {
      if (token.sub) {
        session.user.id = token.sub!;
        session.user.username = token.name!;
        session.user.email = token.email!;
      }
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token?.refreshToken) {
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === '/api/auth/signout') {
        return `${baseUrl}/login`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async authorized({ request, auth }: any) {
      const protectedPaths = [/\/messages\/(.*)/, /\/account\/(.*)/, /\/checkout\/(.*)/];
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
