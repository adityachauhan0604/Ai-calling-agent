import { markLead } from "@/lib/calling-store";
import { requireUser } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ leadId: z.string().min(1), reason: z.string().max(200).default("Opted out") });
export async function POST(request: Request) { try { await requireUser(request); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 }); await markLead(parsed.data.leadId, { dnc: true, status: "do_not_call", dncReason: parsed.data.reason }); return NextResponse.json({ success: true }); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); } }
