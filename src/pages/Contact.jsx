import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact({ initialService = 'Salas', currentUser, onSubmit }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name ?? '',
    phone: '',
    email: currentUser?.email ?? '',
    service: initialService,
    description: '',
  });

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-12">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-brand/10" />

        <div className="mb-10 text-center">
          <span className="section-eyebrow">Reserva Fácil</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Solicita Tu Servicio</h1>
          <p className="mt-2 text-slate-600">Completa el formulario y nos pondremos en contacto contigo de inmediato.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Nombre Completo *">
              <input type="text" required value={formData.name} onChange={set('name')} placeholder="Ej. María González" className="input-field" />
            </Field>
            <Field label="Número de Teléfono *">
              <input type="tel" required value={formData.phone} onChange={set('phone')} placeholder="Ej. 55 1234 5678" className="input-field" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Correo Electrónico *">
              <input type="email" required value={formData.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" className="input-field" />
            </Field>
            <Field label="Tipo de Servicio *">
              <select value={formData.service} onChange={set('service')} className="input-field">
                <option value="Salas">Lavado de Salas</option>
                <option value="Colchones">Lavado de Colchones</option>
                <option value="Alfombras">Lavado de Alfombras</option>
                <option value="Otro">Otro servicio</option>
              </select>
            </Field>
          </div>

          <Field label="Descripción de la mancha o material (Ej. tela lino, terciopelo)">
            <textarea
              rows="4"
              value={formData.description}
              onChange={set('description')}
              placeholder="Describe los detalles de tus muebles o manchas..."
              className="input-field"
            />
          </Field>

          <div className="pt-4 text-center">
            <button type="submit" className="uiverse-btn mx-auto flex w-full items-center justify-center gap-2 px-10 py-4 text-base font-bold shadow-lg sm:w-auto">
              <Send size={18} /> Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
