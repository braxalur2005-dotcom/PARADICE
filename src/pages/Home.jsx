import {
  ArrowRight,
  ClipboardList,
  Eye,
  FileBarChart,
  Headset,
  Target,
  TrendingUp,
} from 'lucide-react';
import { HERO_IMAGE } from '../config/site';

const SERVICES = [
  {
    key: 'gestion-operativa',
    icon: ClipboardList,
    title: 'Gestión Operativa',
    details: [
      'Check-in y check-out personalizado.',
      'Limpieza profesional y mantenimiento constante.',
      'Supervisión periódica de las unidades.',
    ],
  },
  {
    key: 'maximizacion-ingresos',
    icon: TrendingUp,
    title: 'Maximización de Ingresos',
    details: [
      'Estrategias de precios competitivos en tiempo real.',
      'Publicación en plataformas como Airbnb, Booking, y más.',
    ],
  },
  {
    key: 'atencion-cliente',
    icon: Headset,
    title: 'Atención al Cliente',
    details: [
      'Servicio al huésped 24/7.',
      'Resolución rápida de incidencias.',
      'Recomendaciones locales personalizadas para mejorar la experiencia.',
    ],
  },
  {
    key: 'reporte-transparencia',
    icon: FileBarChart,
    title: 'Reporte y Transparencia',
    details: [
      'Informes mensuales detallados sobre ingresos y gastos.',
      'Actualizaciones constantes sobre el estado de la propiedad.',
      'Gestiones claras y sin sorpresas.',
    ],
  },
];

export default function Home({ onNavigate }) {
  return (
    <>
      <section className="w-full bg-[#FCF1DB] pt-20">
        <img src={HERO_IMAGE} alt="Tu espacio también merece estar en el paraíso" className="block h-auto w-full object-contain" />
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

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="glass-card group mx-auto max-w-5xl animate-rise-in rounded-3xl border border-white/80 px-6 py-10 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl motion-reduce:animate-none motion-reduce:transition-none sm:px-12 sm:py-14">
          <span className="section-eyebrow">Paradise on the Beach</span>
          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">¿Quiénes somos?</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            En Paradise on the Beach somos especialistas en la administración integral de propiedades para alquiler vacacional y residencial. Con sede en Tulum, nuestro compromiso es brindar soluciones personalizadas que maximicen el rendimiento de tu inversión y garanticen la satisfacción de tus huéspedes o arrendatarios.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <article
            className="glass-card group animate-rise-in rounded-3xl border border-white/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl motion-reduce:animate-none motion-reduce:transition-none sm:p-10"
            style={{ animationDelay: '150ms' }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
              <Target size={28} />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">Nuestra Misión</h2>
            <p className="leading-relaxed text-slate-600">
              Facilitar a los propietarios la gestión de sus inmuebles mediante servicios profesionales y eficientes, asegurando una experiencia inolvidable para los huéspedes y arrendatarios, mientras cuidamos cada detalle de tus unidades.
            </p>
          </article>

          <article
            className="glass-card group animate-rise-in rounded-3xl border border-white/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl motion-reduce:animate-none motion-reduce:transition-none sm:p-10"
            style={{ animationDelay: '300ms' }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
              <Eye size={28} />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">Nuestra Visión</h2>
            <p className="leading-relaxed text-slate-600">
              Convertirnos en líderes en la administración de propiedades al ser reconocidos por nuestra excelencia, innovación y compromiso con la calidad en cada aspecto del servicio.
            </p>
          </article>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-eyebrow">Nuestros Servicios</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Lo que ofrecemos</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(({ key, icon: Icon, title, details }, index) => (
            <div
              key={key}
              className="glass-card group animate-rise-in rounded-3xl border border-white/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl motion-reduce:animate-none motion-reduce:transition-none"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
                <Icon size={30} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
              <ul className="mt-5 space-y-3 text-left text-slate-600">
                {details.map((detail) => (
                  <li key={detail} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
