import { Shield, Eye, Image as ImageIcon, Plus, Edit2, Trash2, User, Send } from 'lucide-react';
import { REQUEST_STATUSES } from '../data/initialData';

export default function AdminPanel({
  catalog,
  users,
  requests,
  onAddWork,
  onEditWork,
  onDeleteWork,
  onChangeRequestStatus,
  onExit,
}) {
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
        {/* Catálogo */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <ImageIcon size={20} className="text-brand" /> Catálogo de Trabajos ({catalog.length})
            </h2>
            <button
              onClick={onAddWork}
              className="flex items-center gap-1 rounded-xl bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-all hover:bg-brand hover:text-white"
            >
              <Plus size={16} /> Agregar Trabajo
            </button>
          </div>

          <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
            {catalog.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No hay trabajos en el catálogo.</p>}
            {catalog.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-slate-100/50">
                <div className="flex min-w-0 items-center gap-4">
                  <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">{item.category}</span>
                    <h4 className="truncate font-semibold text-slate-800">{item.title}</h4>
                    <p className="line-clamp-1 text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => onEditWork(item)} aria-label="Editar" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-brand">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDeleteWork(item)} aria-label="Eliminar" className="rounded-xl border border-slate-200 bg-white p-2 text-rose-600 hover:bg-rose-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
