import type { Metadata } from 'next';
import './globals.css';
import StoreHydrator from '@/components/layout/StoreHydrator';
import LicenseGate from '@/components/LicenseGate';

export const metadata: Metadata = {
  title: 'Letter Builder — نامه‌ساز',
  description: 'Free Persian & English corporate letter builder — rich text editor, Jalali date, PDF export, RTL/LTR, dark mode. No backend, no sign-up.',
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
