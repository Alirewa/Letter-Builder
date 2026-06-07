import type { Metadata } from 'next';
import './globals.css';
import StoreHydrator from '@/components/layout/StoreHydrator';

export const metadata: Metadata = {
  title: 'نامه‌ساز | Letter Builder',
  description: 'Free Persian/English corporate letter generator — no backend, no sign-up.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
