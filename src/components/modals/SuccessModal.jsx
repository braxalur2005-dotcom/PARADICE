import { CheckCircle } from 'lucide-react';

export default function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-900/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">¡Su Solicitud Fue Enviada Exitosamente!</h2>
        <p className="text-sm text-slate-600">
          Hemos recibido tus datos correctamente. Nuestro equipo se comunicará contigo a la brevedad para confirmar tu cita.
        </p>
        <button onClick={onClose} className="uiverse-btn w-full rounded-2xl !bg-emerald-600 py-3.5 font-bold text-white shadow-lg hover:!bg-emerald-700">
          Aceptar y Cerrar
        </button>
      </div>
    </div>
  );
}
