/**
 * Upload paths in the private "uploads" bucket:
 *   u/<userId>/<uuid>.<ext>   signed-in uploads
 *   a/<anonId>/<uuid>.<ext>   anonymous uploads
 * The owner prefix lets the server verify that a path handed back by the
 * client actually belongs to the caller before reading it.
 */
const PATH_RE =
  /^(u|a)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type AllowedImageType = keyof typeof ALLOWED_IMAGE_TYPES;

export function isAllowedImageType(type: string): type is AllowedImageType {
  return type in ALLOWED_IMAGE_TYPES;
}

export type Owner = { userId: string | null; anonId: string | null };

export function uploadPrefix(owner: Owner): string | null {
  if (owner.userId) return `u/${owner.userId}`;
  if (owner.anonId) return `a/${owner.anonId}`;
  return null;
}

export function buildUploadPath(owner: Owner, contentType: AllowedImageType): string | null {
  const prefix = uploadPrefix(owner);
  if (!prefix) return null;
  return `${prefix}/${crypto.randomUUID()}.${ALLOWED_IMAGE_TYPES[contentType]}`;
}

/**
 * A path belongs to the caller if it's under their user prefix, or under the
 * anonymous prefix of the cookie they're holding (covers "uploaded, then
 * signed in mid-flow").
 */
export function pathBelongsTo(path: string, owner: Owner): boolean {
  const match = PATH_RE.exec(path);
  if (!match) return false;
  const [, kind, id] = match;
  if (kind === "u") return owner.userId === id;
  return owner.anonId === id;
}

export function mediaTypeForPath(path: string): AllowedImageType {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
