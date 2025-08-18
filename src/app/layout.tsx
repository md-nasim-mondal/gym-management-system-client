import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { Toaster } from 'sonner';
import ErrorHandler from '@/components/ErrorHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gym Management System',
  description: 'A system for managing gym classes and memberships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ErrorHandler>
            {children}
          </ErrorHandler>
          <Toaster position="top-center" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
