'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import { getToken } from '@/lib/auth';

const CATEGORIES = ['Všechny', 'Doprava', 'Nákupy', 'Opravy', 'Doučování', 'Péče', 'IT pomoc', 'Přesuny', 'Jiné'];

function TasksContent() {
  const params = useSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('category') || '');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const q: any = { status: 'OPEN' };
      if (search) q.search = search;
      if (category && category !== 'Všechny') q.category = category;
      const res = await api.get('/tasks', { params: q });
      setTasks(res.data);
      setFetchError('');
    } catch (e: any) {
      setFetchError(e.response?.data?.message || 'Nepodařilo se načíst úkoly');
    }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Úkoly</h1>
          <p className="text-gray-500 mt-1">Přehled dostupných žádostí o pomoc</p>
        </div>
        {getToken() && (
          <Link href="/tasks/new" className="btn-primary inline-block">
            + Nový úkol
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Hledat úkoly..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTasks()}
            />
          </div>
          <button onClick={fetchTasks} className="btn-primary">Hledat</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'Všechny' ? '' : cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                (category === '' && cat === 'Všechny') || category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Načítám úkoly...</div>
      ) : fetchError ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{fetchError}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">Žádné úkoly nebyly nalezeny.</p>
          {getToken() && (
            <Link href="/tasks/new" className="btn-primary inline-block mt-4">Vytvořit první úkol</Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return <Suspense><TasksContent /></Suspense>;
}
