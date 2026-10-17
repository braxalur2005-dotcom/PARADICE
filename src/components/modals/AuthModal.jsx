import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none';
const labelCls = 'mb-1 block text-xs font-semibold text-slate-600';

export default function AuthModal({ mode, onSwitch, onClose, onLogin, onRegister }) {
  const isLogin = mode === 'login';
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setError('');
    setIsSubmitting(true);
    try {
      const result = isLogin
        ? await onLogin(data.email.trim(), data.password)
        : await onRegister(data.name.trim(), data.email.trim(), data.password);
      if (result !== true) setError(result || 'No se pudo completar la operación.');
    } catch (err) {
      console.error('Error durante la autenticación:', err);
      setError('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="relative w-full max-w-md animate-zoom-in rounded-3xl bg-white p-8 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          <p className="mt-1 text-xs text-slate-500">Accede para gestionar tus solicitudes</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={labelCls}>Nombre Completo</label>
              <input type="text" name="name" required placeholder="Tu Nombre" className={inputCls} />
            </div>
          )}
          <div>
            <label className={labelCls}>Correo Electrónico</label>
            <input type="email" name="email" required placeholder="tu@correo.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={isLogin ? undefined : 6}
                placeholder="••••••••"
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="uiverse-btn w-full py-3 text-sm font-semibold shadow-md disabled:cursor-wait disabled:opacity-70">
            {isSubmitting ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>

          <div className="pt-2 text-center">
            <button type="button" onClick={() => onSwitch(isLogin ? 'register' : 'login')} className="text-xs font-medium text-brand hover:underline">
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
