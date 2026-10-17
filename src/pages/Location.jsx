import { useEffect, useState } from 'react';
import { MapPin, Phone, Navigation, Save } from 'lucide-react';

export default function Location({ isAdmin, settings, settingsReady, settingsError, onSaveSettings }) {
  const [draft, setDraft] = useState(settings);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const mapAddress = encodeURIComponent(settings.address);
  const mapUrl = `https://maps.google.com/maps?q=${mapAddress}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`;

  const saveSettings = async (event) => {
    event.preventDefault();
    const updatedSettings = {
      address: draft.address.trim(),
      phoneDisplay: draft.phoneDisplay.trim(),
    };
    if (!updatedSettings.address || !updatedSettings.phoneDisplay.replace(/\D/g, '').length) {
      setFormError('La dirección y un número de teléfono válido son obligatorios.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      if (await onSaveSettings(updatedSettings)) setFormError('Cambios guardados correctamente.');
    } finally {
      setSaving(false);
    }
  };

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
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-6">
          <InfoRow icon={MapPin} title="Dirección" text={settings.address} />
          <InfoRow icon={Phone} title="Teléfono / WhatsApp" text={settings.phoneDisplay} />
          <div className="pt-4">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uiverse-btn flex w-full items-center justify-center gap-2 px-6 py-3.5 text-center font-bold shadow-md"
            >
              <Navigation size={18} /> ¿Cómo llego?
            </a>
          </div>
        </div>
      </div>

      {isAdmin && (
        <form onSubmit={saveSettings} className="mx-auto mt-8 max-w-3xl space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Editar ubicación y teléfono</h2>
            <p className="mt-1 text-sm text-slate-500">Al guardar, se actualizan la dirección y el mapa para todos los visitantes.</p>
          </div>

          {!settingsReady && <p className="text-sm text-amber-700">Cargando datos guardados...</p>}

          <label className="block text-sm font-medium text-slate-700">
            Dirección
            <textarea
              required
              rows={3}
              value={draft.address}
              onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Número de teléfono
            <input
              type="tel"
              required
              value={draft.phoneDisplay}
              onChange={(event) => setDraft((current) => ({ ...current, phoneDisplay: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
              placeholder="+52 55 1234 5678"
            />
          </label>

          {settingsError && <p role="alert" className="text-sm text-rose-600">{settingsError}</p>}
          {formError && (
            <p role={formError.startsWith('Cambios guardados') ? 'status' : 'alert'} className={`text-sm ${formError.startsWith('Cambios guardados') ? 'text-emerald-700' : 'text-rose-600'}`}>
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!settingsReady || saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
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
