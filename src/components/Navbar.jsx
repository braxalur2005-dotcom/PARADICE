import { useEffect, useRef, useState } from 'react';
import { User, Shield, LogOut, X, Menu } from 'lucide-react';
import Logo from './Logo';
import { SITE } from '../config/site';

const LINKS = [
  { id: 'home', label: 'Inicio' },
  { id: 'catalog', label: 'Catálogo' },
  { id: 'contact', label: 'Contacto' },
];

export default function Navbar({
  currentUser,
  activeSection,
  isAdminView,
  onNavigate,
  onToggleAdmin,
  onOpenAuth,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);
  const isAdmin = currentUser?.role === 'admin';

  // Cerrar el menú de perfil al hacer clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (section) => {
    onNavigate(section);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav
      className="fixed left-0 top-0 z-50 w-full shadow-md"
      style={{ backgroundColor: '#FCF1DB' }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button type="button" className="flex items-center gap-3 text-left" onClick={() => go('home')}>
          <Logo />
          <div>
            <span className="block text-lg font-bold uppercase leading-none tracking-tight text-brand">{SITE.name}</span>
            <span className="text-xs font-medium text-slate-600">{SITE.tagline}</span>
          </div>
        </button>

        {/* Links escritorio */}
        <div className="hidden items-center gap-8 font-medium text-slate-700 md:flex">
          {LINKS.map((l) => {
            const active = activeSection === l.id && !isAdminView;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`transition-colors hover:text-brand ${
                  active ? 'border-b-2 border-brand font-semibold text-brand' : ''
                }`}
              >
                {l.label}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={onToggleAdmin}
              className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700"
            >
              <Shield size={16} /> {isAdminView ? 'Ver Página' : 'Panel Admin'}
            </button>
          )}
        </div>

        {/* Perfil / login */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition-all hover:shadow"
              >
                <img
                  src={currentUser.photo}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full border-2 border-brand object-cover"
                />
                <span className="hidden pr-2 text-sm font-medium text-slate-700 sm:inline">{currentUser.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-3 w-64 animate-slide-down rounded-2xl border border-slate-100 bg-white py-3 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 pb-3">
                    <img src={currentUser.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => go('profile')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} className="text-brand" /> Mi Perfil e Historial
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          onToggleAdmin(true);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-amber-700 hover:bg-amber-50"
                      >
                        <Shield size={16} /> Panel de Administrador
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="mt-1 flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => onOpenAuth('login')} className="uiverse-btn flex items-center gap-2 px-5 py-2 text-sm shadow-md">
              <User size={16} />
              <span className="hidden sm:inline">Iniciar Sesión / Registrarse</span>
              <span className="sm:hidden">Entrar</span>
            </button>
          )}

          <button onClick={() => setMobileOpen((v) => !v)} className="p-2 text-slate-700 md:hidden" aria-label="Menú">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="space-y-1 border-b border-slate-200 bg-[#FCF1DB] px-6 py-4 shadow-lg backdrop-blur-md md:hidden">
          {LINKS.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="block w-full py-2 text-left font-medium text-slate-700">
              {l.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                setMobileOpen(false);
                onToggleAdmin(true);
              }}
              className="block w-full py-2 text-left font-semibold text-amber-700"
            >
              Panel Admin
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
