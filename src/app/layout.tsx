import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HRFlow — HR Management Portal',
  description: 'Industry-ready HR portal to manage your organization — employees, leave, payroll, recruitment, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
