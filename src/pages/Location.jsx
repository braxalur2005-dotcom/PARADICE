import { MapPin, Phone, Navigation } from 'lucide-react';
import { SITE } from '../config/site';

export default function Location() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <span className="section-eyebrow">Sucursal Principal</span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl">Encuéntranos</h1>
        <p className="mt-2 text-slate-600">Visítanos o contáctanos para servicio a domicilio en toda la zona metropolitana.</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-10 lg:grid-cols-3">
        <div className="h-[400px] overflow-hidden rounded-2xl border border-slate-200 shadow-inner lg:col-span-2">
          <iframe
            title="Mapa de ubicación"
            src={SITE.mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-6">
          <InfoRow icon={MapPin} title="Dirección" text={SITE.address} />
          <InfoRow icon={Phone} title="Teléfono / WhatsApp" text={SITE.phoneDisplay} />
          <div className="pt-4">
            <a
              href={SITE.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uiverse-btn flex w-full items-center justify-center gap-2 px-6 py-3.5 text-center font-bold shadow-md"
            >
              <Navigation size={18} /> ¿Cómo llego?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-800">{title}</h4>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
