'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'tasks'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!getToken() || user?.role !== 'ADMIN') { router.push('/'); return; }
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/tasks'),
    ]).then(([usersRes, tasksRes]) => {
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const roleLabel = (role: string) => ({ USER: 'Uživatel', HELPER: 'Pomocník', ADMIN: 'Admin' }[role] || role);
  const statusLabel = (s: string) => ({ OPEN: 'Otevřený', IN_PROGRESS: 'Probíhá', FULFILLED: 'Splněný', CANCELLED: 'Zrušený' }[s] || s);

  if (loading) return <div className="text-center py-16 text-gray-400">Načítám...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin panel</h1>
      <p className="text-gray-500 mb-8">Správa uživatelů a úkolů</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-orange-50'}`}
        >
          👥 Uživatelé ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${activeTab === 'tasks' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-orange-50'}`}
        >
          📋 Úkoly ({tasks.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 pr-4">Jméno</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Email ověřen</th>
                <th className="pb-3">Registrován</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{roleLabel(u.role)}</span>
                  </td>
                  <td className="py-3 pr-4">{u.isEmailVerified ? '✅' : '❌'}</td>
                  <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('cs-CZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 pr-4">Název</th>
                <th className="pb-3 pr-4">Kategorie</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Autor</th>
                <th className="pb-3">Vytvořeno</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium max-w-xs truncate">{t.title}</td>
                  <td className="py-3 pr-4 text-gray-500">{t.category}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{statusLabel(t.status)}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{t.author?.name || '—'}</td>
                  <td className="py-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString('cs-CZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
