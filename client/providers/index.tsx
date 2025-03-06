import { combine } from '@/providers/combine';
import { ThemeProvider } from 'next-themes';
import React, { Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  combine([_nowrapProvider], [_query, _session, _suspense, _theme], children);

const _theme = (props: { children?: React.ReactNode }) => (
  <ThemeProvider attribute={'class'} defaultTheme="light" enableSystem disableTransitionOnChange>
    {props.children}
  </ThemeProvider>
);
const _suspense = (props: { children?: React.ReactNode }) => <Suspense>{props.children}</Suspense>;
const _session = (props: { children?: React.ReactNode }) => <AuthProvider>{props.children}</AuthProvider>;
const _query = (props: { children?: React.ReactNode }) => <QueryProvider>{props.children}</QueryProvider>;
const _nowrapProvider = () => (
  <>
    <Toaster />
  </>
);
export default Providers;
