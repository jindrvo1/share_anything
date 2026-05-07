'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';
import TaskCard from '@/components/TaskCard';

export default function DashboardPage() {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getUser() : null;
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [helpingTasks, setHelpingTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // router is stable from useRouter; run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!getToken()) { router.push('/auth/login'); return; }
    Promise.all([
      api.get('/tasks', { params: { status: 'OPEN' } }),
      api.get('/tasks', { params: { status: 'IN_PROGRESS' } }),
      api.get('/tasks', { params: { status: 'FULFILLED' } }),
    ]).then(([open, inProgress, fulfilled]) => {
      const all = [...open.data, ...inProgress.data, ...fulfilled.data];
      const uid = getUser()?.id;
      setMyTasks(all.filter((t: any) => t.author?.id === uid));
      setHelpingTasks(all.filter((t: any) => t.helper?.id === uid));
    }).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vítejte zpět, {user.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Moje úkoly', value: myTasks.length, icon: '📋' },
          { label: 'Pomáhám', value: helpingTasks.length, icon: '🤝' },
          { label: 'Splněné', value: myTasks.filter((t) => t.status === 'FULFILLED').length, icon: '✅' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <Link href="/tasks/new" className="btn-primary">+ Nový úkol</Link>
      </div>

      {/* My Tasks */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Moje úkoly</h2>
        {loading ? (
          <p className="text-gray-400">Načítám...</p>
        ) : myTasks.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-400">Zatím nemáte žádné úkoly.</p>
            <Link href="/tasks/new" className="btn-primary inline-block mt-4">Vytvořit úkol</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {myTasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </section>

      {/* Tasks I'm helping */}
      {helpingTasks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pomáhám s</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {helpingTasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        </section>
      )}
    </div>
  );
}
