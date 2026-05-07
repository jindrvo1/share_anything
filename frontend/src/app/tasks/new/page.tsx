'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';
import Link from 'next/link';

interface TaskForm {
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: string;
}

const CATEGORIES = ['Doprava', 'Nákupy', 'Opravy', 'Doučování', 'Péče', 'IT pomoc', 'Přesuny', 'Jiné'];
const URGENCIES = [
  { value: 'LOW', label: 'Nízká' },
  { value: 'NORMAL', label: 'Normální' },
  { value: 'HIGH', label: 'Vysoká' },
  { value: 'URGENT', label: 'Urgentní' },
];

export default function NewTaskPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskForm>({
    defaultValues: { urgency: 'NORMAL', category: 'Jiné' },
  });
  const [error, setError] = useState('');
  const router = useRouter();

  if (!getToken()) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-3">Přihlaste se</h2>
        <p className="text-gray-500 mb-6">Pro vytvoření úkolu se musíte přihlásit.</p>
        <Link href="/auth/login" className="btn-primary inline-block">Přihlásit se</Link>
      </div>
    );
  }

  const onSubmit = async (data: TaskForm) => {
    try {
      setError('');
      const res = await api.post('/tasks', data);
      router.push(`/tasks/${res.data.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Nepodařilo se vytvořit úkol');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tasks" className="text-orange-600 hover:underline text-sm">← Zpět na úkoly</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Nový úkol</h1>
        <p className="text-gray-500 mt-1">Popište svou žádost o pomoc</p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název úkolu *</label>
            <input
              className="input-field"
              placeholder="Např. Potřebuji odvézt na nákup"
              {...register('title', { required: 'Název je povinný' })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popis *</label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="Popište podrobněji co potřebujete, kdy a jakákoliv další informace..."
              {...register('description', { required: 'Popis je povinný' })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie *</label>
              <select className="input-field" {...register('category', { required: true })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naléhavost *</label>
              <select className="input-field" {...register('urgency', { required: true })}>
                {URGENCIES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
            <input
              className="input-field"
              placeholder="Např. Praha 5, Brno-střed..."
              {...register('location')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Odesílám...' : 'Vytvořit úkol'}
            </button>
            <Link href="/tasks" className="btn-secondary inline-block">Zrušit</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
