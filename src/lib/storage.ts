import { supabase } from '@/lib/supabase';

export type BucketName = 'receipts' | 'reports';

/**
 * Laddar upp en fil till angiven bucket och returnerar signed URL.
 * Path: {bookingId}/{personnelId}-{timestamp}.{ext}
 */
export async function uploadFile(
  bucket: BucketName,
  file: File,
  bookingId: string,
  personnelId: string
): Promise<string> {
  if (!supabase) throw new Error('Supabase ej konfigurerad');
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${bookingId}/${personnelId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });
  if (error) throw error;

  // Privata buckets: returnera signed URL som håller 1 år
  const { data, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw signErr;
  return data.signedUrl;
}

/**
 * Skapa en ny signed URL för en redan uppladdad fil (om tidigare länk gått ut).
 */
export async function getSignedUrl(bucket: BucketName, path: string): Promise<string> {
  if (!supabase) throw new Error('Supabase ej konfigurerad');
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (error) throw error;
  return data.signedUrl;
}
