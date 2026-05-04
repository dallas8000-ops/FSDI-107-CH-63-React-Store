/** API origin: empty uses same-origin `/api` (Vite dev proxy or reverse proxy in prod). */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  if (!path.startsWith('/')) return `${base}/${path}`;
  return base ? `${base}${path}` : path;
}
