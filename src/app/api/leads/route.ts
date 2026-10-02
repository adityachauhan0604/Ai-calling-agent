import { saveLead } from "@/lib/calling-store";
import { requireUser } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({ name: z.string().trim().min(2).max(100), company: z.string().trim().max(150).optional(), phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/), source: z.string().trim().max(100).optional(), consent: z.literal(true), consentAt: z.string().datetime() });
export async function POST(request: Request) {
  let user; try { user = await requireUser(request); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = leadSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Verifiable consent and valid lead data are required." }, { status: 400 });
  return NextResponse.json(await saveLead({ ...parsed.data, ownerId: user.uid }), { status: 201 });
}
