'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/auth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      window.dispatchEvent(new Event('storage'));
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Přihlášení se nezdařilo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold text-gray-900">Přihlásit se</h1>
          <p className="text-gray-500 mt-1">Vítejte zpět na Pomoc Teď</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="vas@email.cz"
              {...register('email', { required: 'Email je povinný' })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heslo</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              {...register('password', { required: 'Heslo je povinné' })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Nemáte účet?{' '}
          <Link href="/auth/register" className="text-orange-600 hover:underline font-medium">
            Zaregistrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}
