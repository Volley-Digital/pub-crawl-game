// lib/image.ts
export type CompressOptions = {
  maxDim?: number;      // max width/height
  quality?: number;     // 0..1 JPEG quality
  mimeType?: "image/jpeg"; // we standardize to JPEG for reliability
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Could not read image file."));
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}

async function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  const dataUrl = await blobToDataUrl(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error(
          "Couldn’t decode the image. If it’s HEIC, try taking a screenshot or change iPhone Camera settings to 'Most Compatible'."
        )
      );
    img.src = dataUrl;
  });
}

export async function compressToJpeg(
  file: File,
  opts: CompressOptions = {}
): Promise<Blob> {
  const maxDim = opts.maxDim ?? 1600;
  const quality = opts.quality ?? 0.78;

  // Some browsers struggle with HEIC directly; we rely on the browser decoder.
  const img = await loadImageFromBlob(file);

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  // Calculate target size
  let dstW = srcW;
  let dstH = srcH;
  const maxSide = Math.max(srcW, srcH);

  if (maxSide > maxDim) {
    const scale = maxDim / maxSide;
    dstW = Math.round(srcW * scale);
    dstH = Math.round(srcH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = dstW;
  canvas.height = dstH;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas not supported on this device.");

  // Draw resized
  ctx.drawImage(img, 0, 0, dstW, dstH);

  // Export JPEG
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Compression failed."))),
      "image/jpeg",
      quality
    );
  });

  return blob;
}
