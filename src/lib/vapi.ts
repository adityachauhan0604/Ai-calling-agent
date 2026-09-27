const VAPI_BASE_URL = "https://api.vapi.ai";
export type OutboundCallInput = { name: string; phone: string; company?: string; consent: boolean };

export async function createOutboundCall(input: OutboundCallInput) {
  const apiKey = process.env.VAPI_API_KEY;
  const assistantId = process.env.VAPI_ASSISTANT_ID;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  if (!apiKey || !assistantId || !phoneNumberId) return { mode: "demo" as const, id: `demo-${Date.now()}`, status: "queued" };
  const response = await fetch(`${VAPI_BASE_URL}/call/phone`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ assistantId, phoneNumberId, customer: { number: input.phone, name: input.name }, assistantOverrides: { variableValues: { leadName: input.name, companyName: input.company ?? "your business" } } }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Calling provider rejected the request (${response.status}).`);
  return { mode: "live" as const, ...(await response.json() as Record<string, unknown>) };
}
