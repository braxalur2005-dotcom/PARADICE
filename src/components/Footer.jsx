import { Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { SITE } from '../config/site';

const socialBtn =
  'flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition-all';

export default function Footer({ onNavigate, whatsappUrl }) {
  const quick = [
    ['home', 'Inicio'],
    ['catalog', 'Catálogo de Trabajos'],
    ['contact', 'Contacto y Cotización'],
  ];

  return (
    <footer className="mt-20 bg-slate-900 pb-12 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-slate-800 pb-12 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}logo-footer.jpg`}
                alt=""
                className="h-12 w-12 rounded-lg object-contain"
              />
              <span className="text-xl font-bold tracking-tight">{SITE.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Especialistas en lavado y desinfección profesional de salas, colchones y alfombras a domicilio. Tu hogar
              impecable y libre de ácaros.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {quick.map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => onNavigate(id)} className="transition-colors hover:text-white">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Servicios</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Lavado profundo de Salas</li>
              <li>Desinfección de Colchones</li>
              <li>Limpieza de Alfombras</li>
              <li>Eliminación de ácaros y olores</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Redes Sociales y Contacto</h4>
            <p className="mb-4 text-sm text-slate-400">Síguenos en nuestras redes o escríbenos directamente.</p>
            <div className="flex items-center gap-3">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${snippet('hover:bg-brand')}`}>
                <Instagram size={18} />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${snippet('hover:bg-brand')}`}>
                <Facebook size={18} />
              </a>
              <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={`${snippet('hover:bg-brand')}`}>
                <MessageCircle size={18} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`${snippet('hover:bg-emerald-600')}`}>
                <Phone size={18} />
              </a>
              <button onClick={() => onNavigate('contact')} title="Enviar solicitud" aria-label="Enviar solicitud" className={`${snippet('hover:bg-brand')}`}>
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} Limpieza Profesional de Salas, Colchones y Alfombras. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0">Diseñado con excelencia para pequeñas empresas.</p>
        </div>
      </div>
    </footer>
  );
}

function snippet(hover) {
  return `${socialBtn} ${hover}`;
}
