import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Pomoc Teď – Místní pomoc na dosah',
  description: 'Platforma pro rychlou vzájemnou pomoc mezi lidmi v okolí.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="font-sans bg-gray-50 min-h-screen">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
