import { Edit2, Send } from 'lucide-react';

const STATUS_STYLES = {
  Pendiente: 'bg-amber-100 text-amber-800',
  'En proceso': 'bg-sky-100 text-sky-800',
  Completado: 'bg-emerald-100 text-emerald-800',
};

export default function Profile({ currentUser, requests, onUpdateUser, onNavigate }) {
  const editPhoto = () => {
    const url = prompt('URL de nueva foto de perfil:', currentUser.photo);
    if (url) onUpdateUser({ photo: url });
  };
  const editName = () => {
    const name = prompt('Nuevo nombre:', currentUser.name);
    if (name?.trim()) onUpdateUser({ name: name.trim() });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-12">
        <div className="flex flex-col items-center gap-6 border-b border-slate-100 pb-8 sm:flex-row">
          <div className="relative">
            <img src={currentUser.photo} alt="" className="h-24 w-24 rounded-full border-4 border-brand object-cover" />
            <button
              onClick={editPhoto}
              aria-label="Cambiar foto"
              className="absolute bottom-0 right-0 rounded-full bg-brand p-2 text-white shadow-md hover:bg-brand-dark"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
              <button onClick={editName} aria-label="Cambiar nombre" className="text-slate-400 hover:text-brand">
                <Edit2 size={16} />
              </button>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{currentUser.email}</p>
            <span className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase text-brand">
              {currentUser.role === 'admin' ? 'Administrador' : 'Cliente Registrado'}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Send size={20} className="text-brand" /> Historial de Solicitudes
          </h3>

          {requests.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <p className="text-slate-600">Aún no tienes solicitudes registradas con este correo.</p>
              <button onClick={() => onNavigate('contact')} className="uiverse-btn mt-4 px-6 py-2.5 text-sm">
                Solicitar un servicio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand">{req.service}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[req.status] ?? STATUS_STYLES.Pendiente}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{req.description || 'Sin descripción'}</p>
                    <p className="mt-1 text-xs text-slate-400">Fecha: {req.date}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('contact', { service: req.service })}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                  >
                    Solicitar de nuevo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
