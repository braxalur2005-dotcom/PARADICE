import { useState } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/modals/AuthModal';
import SuccessModal from './components/modals/SuccessModal';
import Lightbox from './components/modals/Lightbox';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import Location from './pages/Location';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import { INITIAL_CATALOG, INITIAL_REQUESTS, INITIAL_USERS } from './data/initialData';
import { ADMIN_AVATAR, DEFAULT_AVATAR, DEMO_ADMIN, SERVICE_CATEGORIES, SITE } from './config/site';

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
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [usersList, setUsersList] = useState(INITIAL_USERS);

  // UI
  const [lightbox, setLightbox] = useState(null); // { itemId, index }
  const [successModal, setSuccessModal] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

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

  /* ---------- Autenticación local (demo, sin backend) ---------- */
  const handleLogin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
      setCurrentUser({ name: 'Administrador', email: normalizedEmail, role: 'admin', photo: ADMIN_AVATAR });
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
    if (normalizedEmail === DEMO_ADMIN.email.toLowerCase()) return 'Ese correo está reservado para la cuenta de administrador.';
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

  const handleLogout = () => {
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
  const addWork = () => {
    const title = prompt('Título del trabajo:')?.trim();
    if (!title) return;
    const categoryInput = prompt(`Categoría (${SERVICE_CATEGORIES.join(', ')}):`, SERVICE_CATEGORIES[0])?.trim();
    const category = SERVICE_CATEGORIES.find((c) => c.toLowerCase() === categoryInput?.toLowerCase()) ?? SERVICE_CATEGORIES[0];
    const description = prompt('Descripción corta:')?.trim() ?? '';
    const image = prompt('URL de la imagen principal:')?.trim();
    if (!image) return;
    setCatalog((prev) => [...prev, { id: Date.now(), title, category, image, gallery: [image], description }]);
  };

  const editWork = (item) => {
    const title = prompt('Editar título:', item.title)?.trim();
    if (!title) return;
    const description = prompt('Editar descripción:', item.description)?.trim();
    setCatalog((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, title, description: description || c.description } : c))
    );
  };

  const deleteWork = (item) => {
    if (confirm(`¿Eliminar "${item.title}" del catálogo?`)) {
      setCatalog((prev) => prev.filter((c) => c.id !== item.id));
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
            onAddWork={addWork}
            onEditWork={editWork}
            onDeleteWork={deleteWork}
            onChangeRequestStatus={changeRequestStatus}
            onExit={() => toggleAdmin(false)}
          />
        ) : (
          <>
            {activeSection === 'home' && <Home onNavigate={navigate} />}
            {activeSection === 'catalog' && (
              <Catalog catalog={catalog} onOpen={(itemId) => setLightbox({ itemId, index: 0 })} />
            )}
            {activeSection === 'contact' && (
              <Contact initialService={preselectedService} currentUser={currentUser} onSubmit={handleRequestSubmit} />
            )}
            {activeSection === 'location' && <Location />}
            {activeSection === 'profile' && currentUser && (
              <Profile currentUser={currentUser} requests={myRequests} onUpdateUser={updateUser} onNavigate={navigate} />
            )}
          </>
        )}

        <Footer onNavigate={navigate} />
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
