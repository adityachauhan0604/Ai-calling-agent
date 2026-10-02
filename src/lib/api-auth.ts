import { clientAuth } from "@/lib/firebase-client";
export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await clientAuth()?.currentUser?.getIdToken();
  return fetch(path, { ...init, headers: { ...init.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
}
