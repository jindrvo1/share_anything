import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  urgency: string;
  status: string;
  author: { name: string };
  createdAt: string;
}

const urgencyMap: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Nízká', color: 'bg-green-100 text-green-700' },
  NORMAL: { label: 'Normální', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'Vysoká', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgentní', color: 'bg-red-100 text-red-700' },
};

const categoryIcons: Record<string, string> = {
  'Doprava': '🚗',
  'Nákupy': '🛒',
  'Opravy': '🔧',
  'Doučování': '📚',
  'Péče': '❤️',
  'IT pomoc': '💻',
  'Přesuny': '📦',
  'Jiné': '💡',
};

export default function TaskCard({ task }: { task: Task }) {
  const urgency = urgencyMap[task.urgency] || { label: task.urgency, color: 'bg-gray-100 text-gray-700' };
  const icon = categoryIcons[task.category] || '💡';

  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {task.category}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgency.color}`}>
            {urgency.label}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {task.location && <span>📍 {task.location}</span>}
            <span>👤 {task.author?.name}</span>
          </div>
          <span>{new Date(task.createdAt).toLocaleDateString('cs-CZ')}</span>
        </div>
      </div>
    </Link>
  );
}
