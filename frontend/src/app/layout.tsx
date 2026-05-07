import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pomoc Teď – Místní pomoc na dosah',
  description: 'Platforma pro rychlou vzájemnou pomoc mezi lidmi v okolí.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
