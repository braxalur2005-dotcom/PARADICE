import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ item, index, onChangeIndex, onClose }) {
  const total = item.gallery.length;
  const prev = () => onChangeIndex((index - 1 + total) % total);
  const next = () => onChangeIndex((index + 1) % total);

  // Teclado: Esc cierra, flechas navegan
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Bloquear scroll del fondo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-between bg-black/90 p-4 backdrop-blur-md animate-fade-in sm:p-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-white">
        <div>
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase">{item.category}</span>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">{item.title}</h2>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      <div className="relative mx-auto my-4 flex w-full max-w-5xl flex-1 items-center justify-center">
        {total > 1 && (
          <button onClick={prev} aria-label="Anterior" className="absolute left-4 z-10 hidden rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-black/80 sm:flex">
            <ChevronLeft size={28} />
          </button>
        )}
        <img src={item.gallery[index]} alt={item.title} className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-2xl" />
        {total > 1 && (
          <button onClick={next} aria-label="Siguiente" className="absolute right-4 z-10 hidden rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-black/80 sm:flex">
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      <div className="mx-auto max-w-xl text-center text-white">
        <p className="mb-4 text-sm text-slate-300">{item.description}</p>
        {total > 1 && (
          <div className="flex justify-center gap-3">
            {item.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => onChangeIndex(i)}
                className={`h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                  index === i ? 'scale-110 border-brand' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
