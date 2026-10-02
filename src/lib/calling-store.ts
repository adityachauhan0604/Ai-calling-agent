import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
export type LeadRecord = { name: string; company?: string; phone: string; source?: string; consent: true; consentAt: string; status?: string; ownerId?: string };
export type CampaignRecord = { name: string; language: "hi" | "en" | "hinglish"; pitch: string; dailyLimit: number; concurrency: number; timezone: string; startHour: number; endHour: number; ownerId: string };
export async function saveLead(lead: LeadRecord) {
  const db = adminDb(); if (!db) return { id: `demo-lead-${Date.now()}`, mode: "demo" as const };
  const normalizedPhone = lead.phone.replace(/\D/g, "");
  const duplicate = await db.collection("leads").where("normalizedPhone", "==", normalizedPhone).limit(1).get();
  if (!duplicate.empty) return { id: duplicate.docs[0].id, mode: "firebase" as const, duplicate: true };
  const ref = await db.collection("leads").add({ ...lead, normalizedPhone, status: lead.status ?? "queued", dnc: false, attempts: 0, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return { id: ref.id, mode: "firebase" as const, duplicate: false };
}
export async function createCampaign(campaign: CampaignRecord) {
  const db = adminDb(); if (!db) return { id: `demo-campaign-${Date.now()}`, mode: "demo" as const };
  const ref = await db.collection("campaigns").add({ ...campaign, status: "paused", callsToday: 0, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return { id: ref.id, mode: "firebase" as const };
}
export async function listWorkspace(ownerId: string) {
  const db = adminDb(); if (!db) return { mode: "demo", leads: [], campaigns: [], calls: [] };
  const [leads, campaigns, calls] = await Promise.all([db.collection("leads").where("ownerId", "==", ownerId).limit(100).get(), db.collection("campaigns").where("ownerId", "==", ownerId).limit(20).get(), db.collection("calls").where("ownerId", "==", ownerId).limit(100).get()]);
  const rows = (snap: typeof leads) => snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return { mode: "firebase", leads: rows(leads), campaigns: rows(campaigns), calls: rows(calls) };
}
export async function nextQueuedLeads(limit = 2) { const db = adminDb(); if (!db) return []; const snap = await db.collection("leads").where("status", "==", "queued").where("dnc", "==", false).limit(Math.min(limit, 10)).get(); return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<LeadRecord & { id: string; attempts?: number }>; }
export async function markLead(id: string, values: Record<string, unknown>) { const db = adminDb(); if (db) await db.collection("leads").doc(id).set({ ...values, updatedAt: FieldValue.serverTimestamp() }, { merge: true }); }
export async function saveCall(call: Record<string, unknown>) { const db = adminDb(); if (!db) return; const id = typeof call.id === "string" ? call.id : undefined; const ref = id ? db.collection("calls").doc(id) : db.collection("calls").doc(); await ref.set({ ...call, updatedAt: FieldValue.serverTimestamp(), retentionUntil: Timestamp.fromMillis(Date.now() + 90 * 86400000) }, { merge: true }); }
