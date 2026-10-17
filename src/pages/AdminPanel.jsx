import { useEffect, useState } from 'react';
import { Shield, Eye, Image as ImageIcon, User, Send, Phone, Save } from 'lucide-react';
import { REQUEST_STATUSES } from '../data/initialData';

export default function AdminPanel({
  catalog,
  users,
  requests,
  siteSettings,
  siteSettingsError,
  onManageCatalog,
  onChangeRequestStatus,
  onSaveSiteSettings,
  onExit,
}) {
  const [phoneDisplay, setPhoneDisplay] = useState(siteSettings.phoneDisplay);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setPhoneDisplay(siteSettings.phoneDisplay);
  }, [siteSettings.phoneDisplay]);

  const saveSettings = async (event) => {
    event.preventDefault();
    const phone = phoneDisplay.trim();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setSettingsMessage('Escribe un número de WhatsApp válido con código de país.');
      return;
    }

    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const saved = await onSaveSiteSettings({ ...siteSettings, phoneDisplay: phone });
      setSettingsMessage(saved ? 'Número actualizado para todos los visitantes.' : '');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 font-semibold text-amber-600">
            <Shield size={20} /> Panel de Administración
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión General del Sistema</h1>
        </div>
        <button onClick={onExit} className="uiverse-btn flex items-center gap-2 px-6 py-2.5 text-sm">
          <Eye size={16} /> Ver Página Normal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={saveSettings} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Phone size={20} className="text-brand" /> Datos de contacto
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 text-sm font-medium text-slate-700">
              Número de WhatsApp
              <input
                type="tel"
                value={phoneDisplay}
                onChange={(event) => setPhoneDisplay(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
                placeholder="+52 55 1234 5678"
              />
            </label>
            <button
              type="submit"
              disabled={savingSettings}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70"
            >
              <Save size={16} /> {savingSettings ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Se actualizará el botón de WhatsApp para todos los visitantes.</p>
          {(siteSettingsError || settingsMessage) && (
            <p role={siteSettingsError ? 'alert' : 'status'} className={`mt-3 text-sm ${siteSettingsError ? 'text-rose-700' : 'text-emerald-700'}`}>
              {siteSettingsError || settingsMessage}
            </p>
          )}
        </form>

        {/* Catálogo */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <ImageIcon size={20} className="text-brand" /> Catálogo de Trabajos ({catalog.length})
            </h2>
            <button
              onClick={onManageCatalog}
              className="flex items-center gap-1 rounded-xl bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-all hover:bg-brand hover:text-white"
            >
              Administrar catálogo
            </button>
          </div>

          <p className="text-sm text-slate-600">
            Agrega y edita nombres, categorías y galerías de imágenes desde las pestañas de administración en la página del catálogo.
          </p>
        </div>

        {/* Usuarios y solicitudes */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <User size={20} className="text-brand" /> Usuarios ({users.length})
            </h2>
            <div className="max-h-[220px] space-y-3 overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{u.name}</p>
                    <p className="truncate text-xs text-slate-500">{u.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-brand'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Send size={20} className="text-brand" /> Solicitudes ({requests.length})
            </h2>
            <div className="max-h-[300px] space-y-3 overflow-y-auto">
              {requests.map((req) => (
                <div key={req.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{req.name}</span>
                    <span className="text-xs text-slate-400">{req.date}</span>
                  </div>
                  <p className="text-xs font-medium text-brand">Servicio: {req.service}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{req.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {req.phone} · {req.email}
                  </p>
                  <select
                    value={req.status}
                    onChange={(e) => onChangeRequestStatus(req.id, e.target.value)}
                    className="mt-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                  >
                    {REQUEST_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
