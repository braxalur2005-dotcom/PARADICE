const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const INITIAL_CATALOG = [
  {
    id: 1,
    title: 'Lavado profundo de Sala Esquinera',
    category: 'Salas',
    image: u('photo-1555041469-a586c61ea9bc'),
    gallery: [
      u('photo-1555041469-a586c61ea9bc'),
      u('photo-1586023492125-27b2c045efd7'),
      u('photo-1493663284031-b7e3aefcae8e'),
    ],
    description: 'Eliminación completa de manchas difíciles y ácaros en tela gamuzada.',
  },
  {
    id: 2,
    title: 'Desinfección de Colchón King Size',
    category: 'Colchones',
    image: u('photo-1505693416388-ac5ce068fe85'),
    gallery: [u('photo-1505693416388-ac5ce068fe85'), u('photo-1584132967334-10e028bd69f7')],
    description: 'Proceso de inyección-succión con vaporizador para eliminar alérgenos.',
  },
  {
    id: 3,
    title: 'Limpieza de Alfombra Residencial',
    category: 'Alfombras',
    image: u('photo-1600121848594-d8644e57abab'),
    gallery: [u('photo-1600121848594-d8644e57abab'), u('photo-1513694203232-719a280e022f')],
    description: 'Restauración de color y suavidad en fibras de lana natural.',
  },
  {
    id: 4,
    title: 'Lavado de Sala 3 Piezas',
    category: 'Salas',
    image: u('photo-1540518614846-7ede433c4ef0'),
    gallery: [u('photo-1540518614846-7ede433c4ef0')],
    description: 'Tratamiento especial para eliminar olores de mascotas y manchas de grasa.',
  },
];

export const INITIAL_REQUESTS = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    phone: '5512345678',
    email: 'carlos@mail.com',
    service: 'Salas',
    description: 'Mancha de café en sofá lino',
    date: '2026-10-08',
    status: 'Completado',
  },
  {
    id: 2,
    name: 'Ana Sofía',
    phone: '5587654321',
    email: 'ana@mail.com',
    service: 'Colchones',
    description: 'Limpieza profunda matrimonial',
    date: '2026-10-09',
    status: 'Pendiente',
  },
];

export const INITIAL_USERS = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@mail.com', role: 'user' },
  { id: 2, name: 'Administrador Principal', email: 'admin@limpieza.com', role: 'admin' },
];

export const REQUEST_STATUSES = ['Pendiente', 'En proceso', 'Completado'];
