import { isSupabaseConfigured, supabase } from '../lib/supabase';

const CONTENT_TABLE = 'app_content';
const CATALOG_KEY = 'catalog';
const SITE_SETTINGS_KEY = 'site_settings';
const IMAGE_BUCKET = 'catalog-images';

function client() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para conectar Supabase.');
  }

  return supabase;
}

async function loadContent(key) {
  const { data, error } = await client()
    .from(CONTENT_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) throw error;
  return data?.value ?? null;
}

async function saveContent(key, value) {
  const { error } = await client().from(CONTENT_TABLE).upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}

async function uploadImage(image) {
  if (!image.startsWith('data:image/')) return image;

  const imageBlob = await (await fetch(image)).blob();
  const extension = imageBlob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
  const path = `${crypto.randomUUID()}.${extension}`;
  const storage = client().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(path, imageBlob, {
    cacheControl: '31536000',
    contentType: imageBlob.type,
    upsert: false,
  });

  if (error) throw error;
  return storage.getPublicUrl(path).data.publicUrl;
}

export async function loadCatalog() {
  return loadContent(CATALOG_KEY);
}

export async function saveCatalog(catalog) {
  const uploadedCatalog = await Promise.all(
    catalog.map(async (item) => {
      const gallery = await Promise.all((item.gallery ?? []).map(uploadImage));
      return { ...item, image: gallery[0] ?? item.image, gallery };
    })
  );

  await saveContent(CATALOG_KEY, uploadedCatalog);
  return uploadedCatalog;
}

export async function loadSiteSettings() {
  return loadContent(SITE_SETTINGS_KEY);
}

export async function saveSiteSettings(settings) {
  await saveContent(SITE_SETTINGS_KEY, settings);
}

export function subscribeToContent(onChange, onError) {
  const channel = client()
    .channel('shared-site-content')
    .on('postgres_changes', { event: '*', schema: 'public', table: CONTENT_TABLE }, (payload) => {
      const key = payload.new?.key ?? payload.old?.key;
      if (key) onChange(key);
    })
    .subscribe((status, error) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        onError(error ?? new Error(`La suscripción en tiempo real falló: ${status}.`));
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
