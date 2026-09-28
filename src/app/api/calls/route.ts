import { createOutboundCall } from "@/lib/vapi";
import { saveCall } from "@/lib/calling-store";
import { NextResponse } from "next/server";
import { z } from "zod";

const callSchema = z.object({ name: z.string().trim().min(2).max(100), company: z.string().trim().max(150).optional(), phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Use an E.164 phone number."), consent: z.literal(true) });
export async function POST(request: Request) {
  try {
    const parsed = callSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Valid recorded consent and lead details are required.", issues: parsed.error.flatten() }, { status: 400 });
    const result = await createOutboundCall(parsed.data);
    await saveCall({ ...result, leadName: parsed.data.name, company: parsed.data.company ?? null, phoneLast4: parsed.data.phone.slice(-4), consentVerified: true, direction: "outbound" });
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start call." }, { status: 502 });
  }
}
