import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Pomoc Teď
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Místní platforma pro rychlou vzájemnou pomoc.
          </p>
          <p className="text-lg text-gray-500 mb-10">
            Potřebujete pomoc nebo chcete pomoci druhým? Spojujeme lidi v okolí,
            kteří si dokáží vzájemně pomoci s každodenními úkoly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tasks/new" className="btn-primary text-center text-lg px-8 py-3 inline-block rounded-xl">
              Vytvořit úkol
            </Link>
            <Link href="/tasks" className="btn-secondary text-center text-lg px-8 py-3 inline-block rounded-xl">
              Prohlédnout úkoly
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Jak to funguje?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✍️', title: 'Popište úkol', desc: 'Vytvořte žádost o pomoc – uveďte co potřebujete, kde a jak urgentní to je.' },
              { icon: '🔍', title: 'Najděte pomocníka', desc: 'Lidé ve vašem okolí uvidí váš úkol a mohou se přihlásit k pomoci.' },
              { icon: '✅', title: 'Získejte pomoc', desc: 'Spojte se s pomocníkem a po splnění označte úkol jako vyřešený.' },
            ].map((step, i) => (
              <div key={i} className="card text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-orange-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Kategorie pomoci</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🚗', name: 'Doprava' },
              { icon: '🛒', name: 'Nákupy' },
              { icon: '🔧', name: 'Opravy' },
              { icon: '📚', name: 'Doučování' },
              { icon: '❤️', name: 'Péče' },
              { icon: '💻', name: 'IT pomoc' },
              { icon: '📦', name: 'Přesuny' },
              { icon: '💡', name: 'Jiné' },
            ].map((cat) => (
              <Link key={cat.name} href={`/tasks?category=${encodeURIComponent(cat.name)}`}>
                <div className="bg-white rounded-xl p-4 text-center hover:shadow-md hover:border-orange-300 border border-transparent transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Připojte se dnes</h2>
          <p className="text-gray-500 mb-8">
            Zaregistrujte se zdarma a staňte se součástí komunity vzájemné pomoci.
          </p>
          <Link href="/auth/register" className="btn-primary text-lg px-10 py-3 inline-block rounded-xl">
            Zaregistrovat se zdarma
          </Link>
        </div>
      </section>
    </div>
  );
}
