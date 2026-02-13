import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Login - NITDA Smart Tracking System',
  description: 'Sign in to access the National Information Technology Development Agency | SRAP 2.0 dashboard',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}