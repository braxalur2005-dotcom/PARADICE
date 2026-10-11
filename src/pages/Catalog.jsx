import { useState } from 'react';
import { SERVICE_CATEGORIES } from '../config/site';

export default function Catalog({ catalog, onOpen }) {
  const [category, setCategory] = useState('Todos');
  const filtered = catalog.filter((i) => category === 'Todos' || i.category === category);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <span className="section-eyebrow">Portafolio</span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl">Catálogo de Trabajos Terminados</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          Haz clic en cualquier imagen para ver los detalles y la galería completa de resultados.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Todos', ...SERVICE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                category === cat ? 'bg-brand text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-500">Aún no hay trabajos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpen(item.id)}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white text-left shadow-md transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand backdrop-blur-md">
                  {item.category}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-white/80">
                    {item.gallery.length} foto{item.gallery.length !== 1 ? 's' : ''} disponible
                    {item.gallery.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
