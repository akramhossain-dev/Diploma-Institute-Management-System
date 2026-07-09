import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'MRIST — Dr. Mahbubur Rahman Mollah Institute of Science and Technology',
    template: '%s | MRIST',
  },
  description:
    'MRIST is one of the best polytechnic institutes in Dhaka, Bangladesh. Affiliated with BTEB, offering 4-Year Diploma in Engineering across CST, ET, CT, MT, and AT departments.',
  keywords: [
    'MRIST', 'polytechnic', 'diploma engineering', 'Dhaka', 'BTEB',
    'CST', 'Electrical Technology', 'Civil Technology', 'Mechanical Technology',
  ],
  openGraph: {
    title: 'MRIST — Dr. Mahbubur Rahman Mollah Institute of Science and Technology',
    description: 'Developing skilled engineers and entrepreneurs in Bangladesh since 2021.',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
