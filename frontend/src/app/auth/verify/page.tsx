'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function VerifyContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); setMessage('Chybí ověřovací token'); return; }

    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => { setStatus('success'); setMessage(res.data.message); })
      .catch((e) => { setStatus('error'); setMessage(e.response?.data?.message || 'Ověření se nezdařilo'); });
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md text-center">
        {status === 'loading' && <><div className="text-5xl mb-4">⏳</div><p>Ověřuji email...</p></>}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Email ověřen!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link href="/auth/login" className="btn-primary inline-block">Přihlásit se</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ověření se nezdařilo</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link href="/" className="btn-secondary inline-block">Zpět domů</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense><VerifyContent /></Suspense>;
}
