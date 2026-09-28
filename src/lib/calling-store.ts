import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export type LeadRecord = { name: string; company?: string; phone: string; source?: string; consent: true; consentAt: string; status?: string };

export async function saveLead(lead: LeadRecord) {
  const db = adminDb();
  if (!db) return { id: `demo-lead-${Date.now()}`, mode: "demo" as const };
  const ref = await db.collection("leads").add({ ...lead, status: lead.status ?? "queued", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return { id: ref.id, mode: "firebase" as const };
}

export async function saveCall(call: Record<string, unknown>) {
  const db = adminDb();
  if (!db) return;
  const id = typeof call.id === "string" ? call.id : undefined;
  const ref = id ? db.collection("calls").doc(id) : db.collection("calls").doc();
  await ref.set({ ...call, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
