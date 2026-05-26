const BASE = "https://functions.poehali.dev/8636b128-5f4c-4d28-9ecf-cf64e3cac45b";

export interface Teaser {
  id: number;
  user_id: number | null;
  title: string;
  description: string;
  image_url: string;
  target_url: string;
  category: string;
  is_active: boolean;
  is_approved: boolean;
  views: number;
  clicks: number;
  views_limit?: number;
  views_used?: number;
  created_at: string;
  ctr?: number;
}

function headers(token?: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["X-User-Id"] = token;
  return h;
}

export async function getTeasers(params?: { category?: string; limit?: number; offset?: number }) {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== "all") qs.set("category", params.category);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const res = await fetch(`${BASE}/?${qs}`, { headers: headers() });
  return res.json() as Promise<{ teasers: Teaser[]; total: number }>;
}

export async function getMyTeasers(token: string) {
  const res = await fetch(`${BASE}/my`, { headers: headers(token) });
  return res.json() as Promise<{ teasers: Teaser[] }>;
}

export async function createTeaser(token: string, data: Partial<Teaser>) {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTeaser(token: string, id: number, data: Partial<Teaser>) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function recordClick(id: number) {
  const res = await fetch(`${BASE}/click/${id}`, { method: "POST", headers: headers() });
  return res.json() as Promise<{ target_url: string }>;
}

export async function recordView(id: number) {
  await fetch(`${BASE}/view/${id}`, { method: "POST", headers: headers() });
}

export async function getTeaserStats(token: string, id: number) {
  const res = await fetch(`${BASE}/stats/${id}`, { headers: headers(token) });
  return res.json();
}