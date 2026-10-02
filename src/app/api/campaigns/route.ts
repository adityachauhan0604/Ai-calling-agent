import { createCampaign } from "@/lib/calling-store";
import { requireUser } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ name: z.string().min(3).max(100), language: z.enum(["hi", "en", "hinglish"]), pitch: z.string().min(20).max(4000), dailyLimit: z.number().int().min(1).max(500), concurrency: z.number().int().min(1).max(10), timezone: z.string().default("Asia/Kolkata"), startHour: z.number().int().min(8).max(20), endHour: z.number().int().min(9).max(21) }).refine((v) => v.endHour > v.startHour);
export async function POST(request: Request) { try { const user = await requireUser(request); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid campaign settings", issues: parsed.error.flatten() }, { status: 400 }); return NextResponse.json(await createCampaign({ ...parsed.data, ownerId: user.uid }), { status: 201 }); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); } }
