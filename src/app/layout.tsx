import type { Metadata } from 'next';
import './globals.css';
import StoreHydrator from '@/components/layout/StoreHydrator';

export const metadata: Metadata = {
  title: 'نامه‌ساز اختصاصی | اپلای فا',
  description: 'سامانه تولید نامه‌های اداری و شرکتی با قالب‌های حرفه‌ای',
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
