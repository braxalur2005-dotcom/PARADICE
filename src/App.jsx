import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/modals/AuthModal';
import SuccessModal from './components/modals/SuccessModal';
import Lightbox from './components/modals/Lightbox';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import { INITIAL_CATALOG, INITIAL_REQUESTS, INITIAL_USERS } from './data/initialData';
import {
  loadCatalog,
  loadSiteSettings,
  saveCatalog as persistCatalog,
  saveSiteSettings as persistSiteSettings,
  subscribeToContent,
} from './data/catalogStorage';
import { ADMIN_AVATAR, DEFAULT_AVATAR, SITE } from './config/site';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const AUTH_STORAGE_KEY = 'paradise-registered-accounts';

function readRegisteredAccounts() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return [];

  const accounts = JSON.parse(stored);
  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        !account ||
        typeof account.email !== 'string' ||
        typeof account.name !== 'string' ||
        typeof account.passwordSalt !== 'string' ||
        typeof account.passwordHash !== 'string'
    )
  ) {
    throw new Error('Los datos de las cuentas guardadas no son válidos.');
  }

  return accounts;
}

function encodeBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('El navegador no permite verificar contraseñas de forma segura.');
  }

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    key,
    256
  );
  return encodeBase64(hash);
}

export default function App() {
  // Navegación y sesión
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { name, email, role, photo }
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [preselectedService, setPreselectedService] = useState('Salas');

  // Datos
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  const [siteSettings, setSiteSettings] = useState({ address: SITE.address, phoneDisplay: SITE.phoneDisplay });
  const [siteSettingsError, setSiteSettingsError] = useState('');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [usersList, setUsersList] = useState(INITIAL_USERS);

  // UI
  const [lightbox, setLightbox] = useState(null); // { itemId, index }
  const [successModal, setSuccessModal] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    let active = true;

    loadCatalog()
      .then((storedCatalog) => {
        if (active && Array.isArray(storedCatalog)) {
          setCatalog(storedCatalog);
          setCatalogError('');
        }
      })
      .catch((error) => {
        console.error('No se pudo cargar el catálogo guardado:', error);
        if (active) setCatalogError(`No se pudo cargar el catálogo compartido: ${error.message}`);
      })
      .finally(() => {
        if (active) setCatalogReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    loadSiteSettings()
      .then((storedSettings) => {
        if (
          active &&
          storedSettings &&
          typeof storedSettings.address === 'string' &&
          typeof storedSettings.phoneDisplay === 'string'
        ) {
          setSiteSettings(storedSettings);
          setSiteSettingsError('');
        }
      })
      .catch((error) => {
        console.error('No se pudieron cargar los datos de contacto:', error);
        if (active) setSiteSettingsError(`No se pudieron cargar los datos de contacto: ${error.message}`);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;

    let active = true;
    const applySession = async (session) => {
      if (!session) return;

      const { data: admin, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('No se pudo verificar el acceso de administrador:', error);
        if (active) setCatalogError(`No se pudo verificar el acceso de administrador: ${error.message}`);
        return;
      }

      if (admin && active) {
        const email = session.user.email ?? '';
        setCurrentUser({
          name: session.user.user_metadata?.full_name ?? email.split('@')[0],
          email,
          role: 'admin',
          photo: ADMIN_AVATAR,
          authProvider: 'supabase',
        });
      } else if (!admin) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error('No se pudo cerrar la sesión sin permisos de administrador:', signOutError);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser((user) => (user?.authProvider === 'supabase' ? null : user));
        setIsAdminView(false);
      } else if (session) {
        window.setTimeout(() => {
          applySession(session).catch((error) => {
            console.error('No se pudo comprobar la sesión de administrador:', error);
            if (active) setCatalogError(`No se pudo comprobar la sesión de administrador: ${error.message}`);
          });
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe;

    const refreshContent = async (key) => {
      try {
        if (key === 'catalog') {
          const updatedCatalog = await loadCatalog();
          if (active && Array.isArray(updatedCatalog)) {
            setCatalog(updatedCatalog);
            setCatalogError('');
          }
        } else if (key === 'site_settings') {
          const updatedSettings = await loadSiteSettings();
          if (active && updatedSettings && typeof updatedSettings.phoneDisplay === 'string') {
            setSiteSettings((current) => ({ ...current, ...updatedSettings }));
            setSiteSettingsError('');
          }
        }
      } catch (error) {
        console.error('No se pudo sincronizar el contenido compartido:', error);
        if (active) setCatalogError(`No se pudo sincronizar el contenido compartido: ${error.message}`);
      }
    };

    try {
      unsubscribe = subscribeToContent(
        (key) => refreshContent(key),
        (error) => {
          console.error('Se perdió la conexión en tiempo real:', error);
          if (active) setCatalogError(`No se pudo mantener la sincronización en tiempo real: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('No se pudo iniciar la sincronización en tiempo real:', error);
      setCatalogError(`No se pudo iniciar la sincronización en tiempo real: ${error.message}`);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  /* ---------- Navegación ---------- */
  const navigate = (section, options = {}) => {
    if (options.service) setPreselectedService(options.service);
    setActiveSection(section);
    setIsAdminView(false);
    window.scrollTo({ top: 0 });
  };

  const toggleAdmin = (forceValue) => {
    setIsAdminView(typeof forceValue === 'boolean' ? forceValue : !isAdminView);
    window.scrollTo({ top: 0 });
  };

  /* ---------- Autenticación ---------- */
  const handleLogin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) {
        console.error('No se pudo iniciar sesión en Supabase:', error);
        return `Supabase no aceptó el inicio de sesión: ${error.message}`;
      }

      if (!data.user) return 'Supabase no devolvió un usuario para esta sesión. Inténtalo de nuevo.';

      const { data: admin, error: roleError } = await supabase.rpc('is_admin');
      if (roleError) {
        console.error('No se pudo verificar el acceso de administrador:', roleError);
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error('No se pudo cerrar la sesión sin verificar permisos:', signOutError);
        return `No se pudo verificar el permiso de administrador: ${roleError.message}`;
      }

      if (!admin) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error('No se pudo cerrar la sesión sin permisos de administrador:', signOutError);
        return 'El inicio de sesión fue correcto, pero este usuario no está registrado como administrador. Ejecuta el bloque final de supabase/setup.sql con su correo.';
      }

      setCurrentUser({
        name: data.user.user_metadata?.full_name ?? normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'admin',
        photo: ADMIN_AVATAR,
        authProvider: 'supabase',
      });
      setIsAdminView(true);
      setAuthModal(null);
      return true;
    }

    let accounts;
    try {
      accounts = readRegisteredAccounts();
    } catch (error) {
      console.error('No se pudieron leer las cuentas guardadas:', error);
      return 'No se pudieron consultar las cuentas guardadas. Inténtalo de nuevo.';
    }

    const account = accounts.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!account) return 'No existe una cuenta con ese correo. Regístrate para crearla.';

    let passwordHash;
    try {
      const salt = Uint8Array.from(atob(account.passwordSalt), (character) => character.charCodeAt(0));
      passwordHash = await hashPassword(password, salt);
    } catch (error) {
      console.error('No se pudo verificar la contraseña:', error);
      return 'No se pudo verificar la contraseña. Inténtalo de nuevo.';
    }

    if (passwordHash !== account.passwordHash) return 'El correo o la contraseña son incorrectos.';

    setCurrentUser({ name: account.name, email: account.email, role: 'user', photo: DEFAULT_AVATAR });
    setAuthModal(null);
    return true;
  };

  const handleRegister = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) return 'Escribe tu nombre para crear la cuenta.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';

    let accounts;
    try {
      accounts = readRegisteredAccounts();
    } catch (error) {
      console.error('No se pudieron leer las cuentas guardadas:', error);
      return 'No se pudieron consultar las cuentas guardadas. Inténtalo de nuevo.';
    }

    if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      return 'Ya existe una cuenta con ese correo. Inicia sesión.';
    }

    let newAccount;
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      newAccount = {
        name: name.trim(),
        email: normalizedEmail,
        passwordSalt: encodeBase64(salt),
        passwordHash: await hashPassword(password, salt),
      };
    } catch (error) {
      console.error('No se pudo proteger la contraseña de la cuenta:', error);
      return 'No se pudo crear la cuenta de forma segura. Inténtalo de nuevo.';
    }

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify([...accounts, newAccount]));
    } catch (error) {
      console.error('No se pudo guardar la cuenta:', error);
      return 'No se pudo guardar la cuenta en este navegador.';
    }

    const newUser = { name: newAccount.name, email: normalizedEmail, role: 'user', photo: DEFAULT_AVATAR };
    setUsersList((prev) => [...prev, { id: Date.now(), name: newAccount.name, email: normalizedEmail, role: 'user' }]);
    setCurrentUser(newUser);
    setAuthModal(null);
    return true;
  };

  const handleLogout = async () => {
    if (currentUser?.authProvider === 'supabase' && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('No se pudo cerrar la sesión de administrador:', error);
          setCatalogError(`No se pudo cerrar la sesión: ${error.message}`);
          return;
        }
      } catch (error) {
        console.error('Falló el cierre de sesión de administrador:', error);
        setCatalogError(`No se pudo cerrar la sesión: ${error.message}`);
        return;
      }
    }
    setCurrentUser(null);
    setIsAdminView(false);
    if (activeSection === 'profile') setActiveSection('home');
  };

  const updateUser = (changes) => setCurrentUser((u) => ({ ...u, ...changes }));

  /* ---------- Solicitudes ---------- */
  const handleRequestSubmit = (formData) => {
    const newReq = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendiente',
    };
    setRequests((prev) => [newReq, ...prev]);
    setSuccessModal(true);

    // Envío real por correo en segundo plano (formsubmit.co).
    // La primera vez, FormSubmit enviará un correo para activar el formulario.
    fetch(`https://formsubmit.co/ajax/${SITE.formEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Nombre: formData.name,
        Teléfono: formData.phone,
        Correo: formData.email,
        Servicio: formData.service,
        Descripción: formData.description,
      }),
    }).catch((err) => console.warn('No se pudo enviar el correo:', err));
  };

  const changeRequestStatus = (id, status) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  /* ---------- Catálogo (admin) ---------- */
  const saveCatalogItem = async (item) => {
    const updatedCatalog = catalog.some((work) => work.id === item.id)
      ? catalog.map((work) => (work.id === item.id ? item : work))
      : [...catalog, item];

    try {
      const savedCatalog = await persistCatalog(updatedCatalog);
      setCatalog(savedCatalog);
      setCatalogError('');
      return true;
    } catch (error) {
      console.error('No se pudo guardar el catálogo:', error);
      setCatalogError(`No se pudo guardar el catálogo compartido: ${error.message}`);
      return false;
    }
  };

  const deleteCatalogItem = async (item) => {
    const updatedCatalog = catalog.filter((work) => work.id !== item.id);

    try {
      const savedCatalog = await persistCatalog(updatedCatalog);
      setCatalog(savedCatalog);
      setCatalogError('');
      return true;
    } catch (error) {
      console.error('No se pudo eliminar el trabajo del catálogo:', error);
      setCatalogError(`No se pudo guardar el cambio compartido: ${error.message}`);
      return false;
    }
  };

  const saveSiteSettings = async (settings) => {
    try {
      await persistSiteSettings(settings);
      setSiteSettings(settings);
      setSiteSettingsError('');
      return true;
    } catch (error) {
      console.error('No se pudieron guardar los datos de contacto:', error);
      setSiteSettingsError(`No se pudieron guardar los datos de contacto: ${error.message}`);
      return false;
    }
  };

  /* ---------- Derivados ---------- */
  const lightboxItem = lightbox ? catalog.find((c) => c.id === lightbox.itemId) : null;
  const myRequests = currentUser
    ? requests.filter((r) => isAdmin || r.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="min-h-screen">
      <Navbar
        currentUser={currentUser}
        activeSection={activeSection}
        isAdminView={isAdminView}
        onNavigate={navigate}
        onToggleAdmin={toggleAdmin}
        onOpenAuth={setAuthModal}
        onLogout={handleLogout}
      />

      <main className="relative z-0">
        {isAdminView && isAdmin ? (
          <AdminPanel
            catalog={catalog}
            users={usersList}
            requests={requests}
            siteSettings={siteSettings}
            siteSettingsError={siteSettingsError}
            onManageCatalog={() => navigate('catalog')}
            onChangeRequestStatus={changeRequestStatus}
            onSaveSiteSettings={saveSiteSettings}
            onExit={() => toggleAdmin(false)}
          />
        ) : (
          <>
            {activeSection === 'home' && <Home onNavigate={navigate} />}
            {activeSection === 'catalog' && (
              <Catalog
                catalog={catalog}
                isAdmin={isAdmin}
                catalogReady={catalogReady}
                catalogError={catalogError}
                onSave={saveCatalogItem}
                onDelete={deleteCatalogItem}
                onOpen={(itemId) => setLightbox({ itemId, index: 0 })}
              />
            )}
            {activeSection === 'contact' && (
              <Contact initialService={preselectedService} currentUser={currentUser} onSubmit={handleRequestSubmit} />
            )}
            {activeSection === 'profile' && currentUser && (
              <Profile currentUser={currentUser} requests={myRequests} onUpdateUser={updateUser} onNavigate={navigate} />
            )}
          </>
        )}

        <Footer
          onNavigate={navigate}
          whatsappUrl={`https://wa.me/${siteSettings.phoneDisplay.replace(/\D/g, '')}`}
        />
      </main>

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          index={Math.min(lightbox.index, lightboxItem.gallery.length - 1)}
          onChangeIndex={(index) => setLightbox({ ...lightbox, index })}
          onClose={() => setLightbox(null)}
        />
      )}

      {successModal && (
        <SuccessModal
          onClose={() => {
            setSuccessModal(false);
            navigate('home');
          }}
        />
      )}

      {authModal && (
        <AuthModal
          mode={authModal}
          onSwitch={setAuthModal}
          onClose={() => setAuthModal(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
