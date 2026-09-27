import { createOutboundCall } from "@/lib/vapi";
import { NextResponse } from "next/server";
import { z } from "zod";

const callSchema = z.object({ name: z.string().trim().min(2).max(100), company: z.string().trim().max(150).optional(), phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Use an E.164 phone number."), consent: z.literal(true) });
export async function POST(request: Request) {
  try {
    const parsed = callSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Valid recorded consent and lead details are required.", issues: parsed.error.flatten() }, { status: 400 });
    return NextResponse.json(await createOutboundCall(parsed.data), { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start call." }, { status: 502 });
  }
}
