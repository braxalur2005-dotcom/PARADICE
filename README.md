# Limpieza Pro

Sitio web para un negocio de lavado de salas, colchones y alfombras.
React 18 + Vite + Tailwind CSS 3 + lucide-react.

## Uso

```bash
npm install
npm run dev       # desarrollo → http://localhost:5173
npm run build     # producción (carpeta dist/)
npm run preview   # probar el build
```

## Estructura

```
src/
├── main.jsx                 Punto de entrada
├── App.jsx                  Estado global y navegación entre secciones
├── index.css                Tailwind + estilos propios (botón, glass-card…)
├── config/site.js           Datos del negocio: teléfono, dirección, mapa, correo, redes
├── data/initialData.js      Catálogo, solicitudes y usuarios de ejemplo
├── hooks/useScrollFade.js   Desvanecido del hero al hacer scroll
├── components/
│   ├── Navbar.jsx · Footer.jsx · Logo.jsx
│   └── modals/ AuthModal · SuccessModal · Lightbox
└── pages/
    Home · Catalog · Contact · Location · Profile · AdminPanel
```

## Personalización

- **Datos del negocio**: `src/config/site.js` (cambia `formEmail` por tu correo real).
- **Logo**: coloca `logo.png` en la carpeta `public/`. Si no existe, se muestran las iniciales "LP".
- **Colores**: `tailwind.config.js` → `brand` y `cream`.

## Cuenta de administrador (demo)

`admin@limpieza.com` / `admin123`

> ⚠️ Es solo una demostración: login, usuarios, catálogo y solicitudes viven en memoria
> (se pierden al recargar) y las credenciales están visibles en el código.
> Para producción necesitas un backend real (por ejemplo Supabase o Firebase) con autenticación y base de datos.

## Envío de correos

El formulario usa [formsubmit.co](https://formsubmit.co). La primera vez que se envíe una
solicitud, FormSubmit mandará un correo de activación a la dirección configurada en `formEmail`.
