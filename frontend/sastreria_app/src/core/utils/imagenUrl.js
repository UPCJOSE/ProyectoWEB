const API_BASE = "http://localhost:5000";

/** Resuelve URL local (/uploads/...) o enlace externo (https://...) */
export const resolverImagenUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${API_BASE}${trimmed}`;
  return `${API_BASE}/${trimmed}`;
};

export { API_BASE };
