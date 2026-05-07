'use client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import api from '@/lib/api';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setSuccess('Registrace proběhla úspěšně! Zkontrolujte svůj email a ověřte účet.');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registrace se nezdařila');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="card w-full max-w-md text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Zkontrolujte email</h2>
          <p className="text-gray-500 mb-6">{success}</p>
          <Link href="/auth/login" className="btn-primary inline-block">
            Přejít na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold text-gray-900">Vytvořit účet</h1>
          <p className="text-gray-500 mt-1">Připojte se ke komunitě Pomoc Teď</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Celé jméno</label>
            <input
              type="text"
              className="input-field"
              placeholder="Jan Novák"
              {...register('name', { required: 'Jméno je povinné' })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

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
              placeholder="Minimálně 6 znaků"
              {...register('password', { required: 'Heslo je povinné', minLength: { value: 6, message: 'Heslo musí mít alespoň 6 znaků' } })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Potvrdit heslo</label>
            <input
              type="password"
              className="input-field"
              placeholder="Zopakujte heslo"
              {...register('confirmPassword', {
                required: 'Potvrzení hesla je povinné',
                validate: (v) => v === watch('password') || 'Hesla se neshodují',
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Registrace...' : 'Zaregistrovat se'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Již máte účet?{' '}
          <Link href="/auth/login" className="text-orange-600 hover:underline font-medium">
            Přihlaste se
          </Link>
        </p>
      </div>
    </div>
  );
}
