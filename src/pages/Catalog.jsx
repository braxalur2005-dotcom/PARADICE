import { useState } from 'react';
import { Eye, ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../config/site';

const createEmptyForm = () => ({
  id: null,
  title: '',
  category: SERVICE_CATEGORIES[0],
  description: '',
  gallery: [],
  imageUrl: '',
});

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error ?? new Error(`No se pudo leer ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function Catalog({
  catalog,
  isAdmin,
  catalogReady,
  catalogError,
  onSave,
  onDelete,
  onOpen,
}) {
  const [category, setCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState('gallery');
  const [form, setForm] = useState(createEmptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const filtered = catalog.filter((item) => category === 'Todos' || item.category === category);
  const editing = form.id !== null;

  const resetForm = () => {
    setForm(createEmptyForm());
    setFormError('');
  };

  const editItem = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description ?? '',
      gallery: item.gallery?.length ? [...item.gallery] : item.image ? [item.image] : [],
      imageUrl: '',
    });
    setFormError('');
    setActiveTab('manage');
  };

  const addImageUrl = () => {
    const imageUrl = form.imageUrl.trim();
    if (!imageUrl) return;
    setForm((current) => ({ ...current, gallery: [...current.gallery, imageUrl], imageUrl: '' }));
    setFormError('');
  };

  const addImageFiles = async (event) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (files.some((file) => !supportedTypes.includes(file.type))) {
      setFormError('Selecciona imágenes JPG, PNG, WEBP o GIF.');
      return;
    }
    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      setFormError('Cada imagen debe pesar menos de 10 MB.');
      return;
    }

    try {
      const images = await Promise.all(files.map(readImageFile));
      setForm((current) => ({ ...current, gallery: [...current.gallery, ...images] }));
      setFormError('');
    } catch (error) {
      console.error('No se pudo leer una imagen del catálogo:', error);
      setFormError('No se pudo leer uno de los archivos seleccionados.');
    }
  };

  const saveItem = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setFormError('Escribe el nombre del trabajo.');
      return;
    }
    if (!form.gallery.length) {
      setFormError('Agrega al menos una imagen mediante URL o archivo.');
      return;
    }

    setSaving(true);
    setFormError('');
    const item = {
      id: form.id ?? `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      category: form.category,
      image: form.gallery[0],
      gallery: [...form.gallery],
      description: form.description.trim(),
    };

    try {
      if (await onSave(item)) resetForm();
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.title}" del catálogo?`)) return;
    if (await onDelete(item) && form.id === item.id) resetForm();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="section-eyebrow">Portafolio</span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl">Catálogo de Trabajos Terminados</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          Haz clic en cualquier imagen para ver los detalles y la galería completa de resultados.
        </p>
      </div>

      {isAdmin && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Secciones del catálogo">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'gallery' ? 'bg-brand text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye size={16} /> Ver catálogo
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'manage'}
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'manage' ? 'bg-brand text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Pencil size={16} /> Administrar catálogo
          </button>
        </div>
      )}

      {catalogError && (
        <p role="alert" className="mx-auto mb-6 max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {catalogError}
        </p>
      )}

      {isAdmin && activeTab === 'manage' ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveItem} className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editing ? 'Editar trabajo' : 'Agregar trabajo'}</h2>
                <p className="mt-1 text-sm text-slate-500">Los cambios se guardan y se sincronizan para todos los visitantes.</p>
              </div>
              {editing && (
                <button type="button" onClick={resetForm} aria-label="Cancelar edición" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <X size={20} />
                </button>
              )}
            </div>

            {!catalogReady && <p className="text-sm text-amber-700">Cargando el catálogo guardado...</p>}

            <label className="block text-sm font-medium text-slate-700">
              Nombre del trabajo
              <input
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
                placeholder="Ej. Lavado profundo de sala"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Categoría
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand"
              >
                {SERVICE_CATEGORIES.map((serviceCategory) => (
                  <option key={serviceCategory} value={serviceCategory}>{serviceCategory}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Descripción
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={3}
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
                placeholder="Describe brevemente el trabajo"
              />
            </label>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-800">Imágenes de la galería</legend>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  aria-label="URL de imagen"
                />
                <button type="button" onClick={addImageUrl} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                  Agregar URL
                </button>
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-4 text-sm font-semibold text-brand transition-colors hover:bg-brand/10">
                <ImagePlus size={18} /> Seleccionar una o varias imágenes
                <input type="file" accept="image/*" multiple onChange={addImageFiles} className="sr-only" />
              </label>

              {form.gallery.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {form.gallery.map((image, index) => (
                    <li key={`${index}-${image.slice(0, 32)}`} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                      <img src={image} alt={`Imagen ${index + 1} de la galería`} className="h-full w-full object-cover" />
                      <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-xs font-semibold text-white">
                        {index === 0 ? 'Principal' : `Imagen ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, gallery: current.gallery.filter((_, imageIndex) => imageIndex !== index) }))}
                        aria-label={`Quitar imagen ${index + 1}`}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-rose-600 shadow hover:bg-white"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>

            {formError && <p role="alert" className="text-sm text-rose-600">{formError}</p>}

            <button
              type="submit"
              disabled={!catalogReady || saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar al catálogo'}
            </button>
          </form>

          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-xl font-bold text-slate-900">Trabajos del catálogo ({catalog.length})</h2>
            {catalog.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">Todavía no hay trabajos. Agrega el primero con el formulario.</p>
            ) : (
              <ul className="max-h-[800px] space-y-3 overflow-y-auto pr-1">
                {catalog.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-wide text-brand">{item.category}</p>
                      <p className="truncate font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.gallery?.length ?? 1} imágenes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => editItem(item)}
                      aria-label={`Editar ${item.title}`}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-brand"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      aria-label={`Eliminar ${item.title}`}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {['Todos', ...SERVICE_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  category === cat ? 'bg-brand text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-slate-500">Aún no hay trabajos en esta categoría.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onOpen(item.id)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white text-left shadow-md transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand backdrop-blur-md">
                      {item.category}
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/80">
                        {item.gallery.length} foto{item.gallery.length !== 1 ? 's' : ''} disponible
                        {item.gallery.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
