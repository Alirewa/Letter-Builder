import type { Metadata } from 'next';
import './globals.css';
import StoreHydrator from '@/components/layout/StoreHydrator';
import LicenseGate from '@/components/LicenseGate';

export const metadata: Metadata = {
  title: 'نامه‌ساز اختصاصی',
  description: 'سامانه تولید نامه‌های اداری و شرکتی با قالب‌های حرفه‌ای',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreHydrator />
        <LicenseGate>
          {children}
        </LicenseGate>
      </body>
    </html>
  );
}
