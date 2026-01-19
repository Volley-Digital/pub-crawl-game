// lib/upload.ts
import { supabase } from "@/lib/supabase";

export type UploadStage =
  | "idle"
  | "processing"
  | "uploading"
  | "saving"
  | "done"
  | "error";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function friendlyUploadError(e: any): string {
  const msg = String(e?.message ?? e ?? "");

  if (/network|fetch/i.test(msg)) return "Network issue. Move to better signal and try again.";
  if (/413|payload too large/i.test(msg)) return "That photo is too large. Try again — we’ll compress it more.";
  if (/unauthorized|permission|rls/i.test(msg))
    return "Upload blocked by permissions. Check Storage policies for the 'proofs' bucket.";
  if (/decode|heic/i.test(msg))
    return "Your phone image format may not be supported (HEIC). Take a screenshot of the photo and upload the screenshot.";
  return "Upload failed. Try again in a moment.";
}

export async function uploadToPublicBucket(params: {
  bucket: "proofs";
  path: string;
  blob: Blob;
  onAttempt?: (attempt: number) => void;
}): Promise<string> {
  const { bucket, path, blob, onAttempt } = params;

  // Supabase upload expects File/Blob; provide contentType
  const contentType = "image/jpeg";

  let lastErr: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    onAttempt?.(attempt);

    const { error } = await supabase.storage.from(bucket).upload(path, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });

    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }

    lastErr = error;

    // Backoff: 0.5s, 1s, 1.5s
    await sleep(500 * attempt);
  }

  throw lastErr ?? new Error("Upload failed");
}
