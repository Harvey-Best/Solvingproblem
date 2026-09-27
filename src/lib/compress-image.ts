import imageCompression from "browser-image-compression";

/** Claude downsamples anything larger than ~1568px on the long edge anyway. */
const MAX_EDGE = 1568;
const MAX_MB = 1.4;

/**
 * Re-encodes a phone photo as a JPEG under 1.5MB. Re-encoding through a canvas
 * also applies EXIF rotation and strips metadata (including GPS location).
 */
export async function compressImage(file: File): Promise<File> {
  const blob = await imageCompression(file, {
    maxSizeMB: MAX_MB,
    maxWidthOrHeight: MAX_EDGE,
    initialQuality: 0.85,
    fileType: "image/jpeg",
    // The worker build loads the library from a CDN; main thread is fine for 1-3 photos.
    useWebWorker: false,
  });
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}
