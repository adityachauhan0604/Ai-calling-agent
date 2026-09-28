import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { saveCall } from "@/lib/calling-store";

function validSignature(rawBody: string, signature: string | null) {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "");
  return expected.length === provided.length && timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!validSignature(rawBody, request.headers.get("x-vapi-signature"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const message = (payload.message ?? payload) as Record<string, unknown>;
  const call = (message.call ?? {}) as Record<string, unknown>;
  await saveCall({ id: call.id, type: message.type, status: call.status, endedReason: message.endedReason, analysis: message.analysis, transcript: message.transcript });
  return NextResponse.json({ received: true });
}
