'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getToken, setUser } from '@/lib/auth';

interface ProfileForm {
  name: string;
  bio: string;
  location: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileForm>();

  // router is stable from useRouter; run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!getToken()) { router.push('/auth/login'); return; }
    api.get('/users/me').then((res) => {
      setProfile(res.data);
      reset({ name: res.data.name, bio: res.data.bio || '', location: res.data.location || '', role: res.data.role });
    });
  }, []);

  const onSubmit = async (data: ProfileForm) => {
    try {
      setError(''); setSuccess('');
      const res = await api.patch('/users/me', { name: data.name, bio: data.bio, location: data.location, role: data.role });
      setProfile(res.data);
      setUser(res.data);
      window.dispatchEvent(new Event('storage'));
      setSuccess('Profil byl úspěšně uložen.');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Nepodařilo se uložit profil');
    }
  };

  if (!profile) return <div className="text-center py-16 text-gray-400">Načítám...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Můj profil</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
            {profile.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 inline-block">
              {profile.role === 'ADMIN' ? 'Admin' : profile.role === 'HELPER' ? 'Pomocník' : 'Uživatel'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-5">Upravit profil</h2>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Celé jméno</label>
            <input className="input-field" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O mně</label>
            <textarea className="input-field min-h-[100px] resize-y" placeholder="Napište něco o sobě..." {...register('bio')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
            <input className="input-field" placeholder="Praha, Brno..." {...register('location')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="input-field" {...register('role')}>
              <option value="USER">Uživatel – hledám pomoc</option>
              <option value="HELPER">Pomocník – chci pomáhat</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Ukládám...' : 'Uložit změny'}
          </button>
        </form>
      </div>
    </div>
  );
}
