import { Sparkles, Layers, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../config/site';

const SERVICES = [
  {
    key: 'Salas',
    icon: Sparkles,
    title: 'Lavado de Salas',
    cta: 'Cotizar sala',
    text: 'Devolvemos la vida a tus muebles eliminando manchas profundas, ácaros y malos olores con tecnología de inyección-succión y productos biodegradables.',
  },
  {
    key: 'Colchones',
    icon: Layers,
    title: 'Lavado de Colchones',
    cta: 'Cotizar colchón',
    text: 'Desinfección profunda antibacteriana para garantizar un descanso saludable, eliminando polvo acumulado, alérgenos y manchas de sudor o humedad.',
  },
  {
    key: 'Alfombras',
    icon: ImageIcon,
    title: 'Lavado de Alfombras',
    cta: 'Cotizar alfombra',
    text: 'Tratamiento especializado para alfombras residenciales y de oficina, recuperando la textura suave, los colores originales y eliminando partículas nocivas.',
  },
];

export default function Home({ onNavigate }) {
  return (
    <>
      <section className="w-full bg-[#FCF1DB]">
        <img src={HERO_IMAGE} alt="Tu espacio también merece estar en el paraíso" className="block h-auto w-full" />
        <div className="flex flex-wrap justify-center gap-4 px-4 py-6 sm:py-8">
          <button onClick={() => onNavigate('contact')} className="uiverse-btn flex items-center gap-3 px-8 py-3 text-base shadow-xl">
            Solicitar Cotización <ArrowRight size={20} />
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="rounded-full border-2 border-brand bg-[#FCF1DB] px-8 py-3 font-semibold text-brand shadow-md transition-colors hover:bg-brand hover:text-white"
          >
            Ver Trabajos
          </button>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-eyebrow">Nuestros Servicios</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Lo que ofrecemos para tu hogar</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {SERVICES.map(({ key, icon: Icon, title, text, cta }) => (
            <div
              key={key}
              className="glass-card group rounded-3xl border border-white/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg transition-transform group-hover:scale-110">
                <Icon size={32} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-800">{title}</h3>
              <p className="mb-6 leading-relaxed text-slate-600">{text}</p>
              <button
                onClick={() => onNavigate('contact', { service: key })}
                className="flex items-center gap-2 font-semibold text-brand transition-transform group-hover:translate-x-1"
              >
                {cta} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
