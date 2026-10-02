import { markLead, nextQueuedLeads, saveCall } from "@/lib/calling-store";
import { createOutboundCall } from "@/lib/vapi";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(new Date()));
  if (hour < 10 || hour >= 18) return NextResponse.json({ skipped: "Outside calling window" });
  const leads = await nextQueuedLeads(Number(process.env.CALL_CONCURRENCY ?? 2));
  const results = await Promise.allSettled(leads.map(async (lead) => {
    await markLead(lead.id, { status: "calling", attempts: (lead.attempts ?? 0) + 1 });
    try { const call = await createOutboundCall(lead); await saveCall({ ...call, ownerId: lead.ownerId, leadId: lead.id, consentVerified: true }); await markLead(lead.id, { status: "called", lastCallId: call.id }); return call; }
    catch (error) { await markLead(lead.id, { status: (lead.attempts ?? 0) >= 2 ? "failed" : "queued", lastError: error instanceof Error ? error.message : "Call failed" }); throw error; }
  }));
  return NextResponse.json({ processed: leads.length, succeeded: results.filter((r) => r.status === "fulfilled").length });
}
