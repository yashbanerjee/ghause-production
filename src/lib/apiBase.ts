/**
 * Normalized API origin/path for Vite. Trailing slashes on VITE_API_URL would
 * otherwise produce URLs like /api//products and break routing + CORS.
 */
export function getApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api';
  const stripped = raw.replace(/\/+$/, '');
  return stripped || '/api';
}
