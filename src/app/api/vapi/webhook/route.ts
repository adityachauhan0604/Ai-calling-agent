import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

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
  return NextResponse.json({ received: true });
}
