'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, removeToken } from '@/lib/auth';
import type { User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
    const handleStorage = () => setUser(getUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <span className="font-bold text-xl text-orange-600">Pomoc Teď</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/tasks" className="text-gray-600 hover:text-orange-600 transition-colors">
            Úkoly
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-600 transition-colors">
                Dashboard
              </Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-gray-600 hover:text-orange-600 transition-colors">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-200 transition-colors"
              >
                Odhlásit
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-orange-600 transition-colors">
                Přihlásit
              </Link>
              <Link
                href="/auth/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                Registrovat
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
