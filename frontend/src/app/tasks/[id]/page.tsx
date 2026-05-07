'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';

const urgencyMap: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Nízká', color: 'bg-green-100 text-green-700' },
  NORMAL: { label: 'Normální', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'Vysoká', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgentní', color: 'bg-red-100 text-red-700' },
};

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Otevřený', color: 'bg-green-100 text-green-700' },
  IN_PROGRESS: { label: 'Probíhá', color: 'bg-blue-100 text-blue-700' },
  FULFILLED: { label: 'Splněný', color: 'bg-gray-100 text-gray-500' },
  CANCELLED: { label: 'Zrušený', color: 'bg-red-100 text-red-500' },
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    api.get(`/tasks/${id}`)
      .then((r) => setTask(r.data))
      .catch(() => router.push('/tasks'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRespond = async () => {
    if (!getToken()) { router.push('/auth/login'); return; }
    setActionLoading(true);
    try {
      const res = await api.post(`/tasks/${id}/respond`);
      setTask(res.data);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Nepodařilo se reagovat na úkol');
    }
    setActionLoading(false);
  };

  const handleFulfill = async () => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/tasks/${id}/fulfill`);
      setTask(res.data);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Nepodařilo se označit jako splněný');
    }
    setActionLoading(false);
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Načítám...</div>;
  if (!task) return null;

  const urgency = urgencyMap[task.urgency] || { label: task.urgency, color: 'bg-gray-100 text-gray-600' };
  const status = statusMap[task.status] || { label: task.status, color: 'bg-gray-100 text-gray-600' };
  const isAuthor = user?.id === task.author?.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/tasks" className="text-orange-600 hover:underline text-sm">← Zpět na úkoly</Link>

      <div className="card mt-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${urgency.color}`}>{urgency.label}</span>
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">{task.category}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h1>
        <p className="text-gray-600 whitespace-pre-wrap mb-6">{task.description}</p>

        <div className="border-t border-gray-100 pt-5 grid sm:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <div className="font-medium text-gray-700 mb-1">Autor</div>
            <div>{task.author?.name}</div>
          </div>
          {task.location && (
            <div>
              <div className="font-medium text-gray-700 mb-1">Lokalita</div>
              <div>📍 {task.location}</div>
            </div>
          )}
          {task.helper && (
            <div>
              <div className="font-medium text-gray-700 mb-1">Pomocník</div>
              <div>🤝 {task.helper.name}</div>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-700 mb-1">Vytvořeno</div>
            <div>{new Date(task.createdAt).toLocaleDateString('cs-CZ')}</div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          {task.status === 'OPEN' && !isAuthor && (
            <button onClick={handleRespond} disabled={actionLoading} className="btn-primary">
              {actionLoading ? 'Odesílám...' : '🤝 Chci pomoci'}
            </button>
          )}
          {isAuthor && task.status === 'IN_PROGRESS' && (
            <button onClick={handleFulfill} disabled={actionLoading} className="btn-primary">
              {actionLoading ? 'Označuji...' : '✅ Označit jako splněný'}
            </button>
          )}
          {!getToken() && task.status === 'OPEN' && (
            <Link href="/auth/login" className="btn-primary inline-block">Přihlaste se a pomozte</Link>
          )}
        </div>
      </div>
    </div>
  );
}
