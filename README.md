# Dialora — AI Calling Agent

Consent-first outbound sales workspace for website and automation services. The dashboard imports opted-in leads, tracks live campaign activity, and includes a server-side Vapi calling adapter.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Vapi keys the calling API intentionally returns demo-mode results.

## CSV format

```csv
name,company,phone,source,consent
Rohan Mehta,Northstar Dental,+919800000000,Website form,true
```

Only rows with an explicit `true`, `yes`, `1`, or `opt-in` consent value are imported. This guard does not replace maintaining valid, verifiable consent records and following applicable telecom rules.

## Live calling

Create a Vapi assistant and phone number, then set the server-only values shown in `.env.example`. `POST /api/calls` accepts a single consent-verified lead. `POST /api/vapi/webhook` is ready for signed provider events and later CRM/Supabase persistence.

## Production checklist

- Use an India-compatible registered telephony route and verify current TRAI/TCCCPR obligations.
- Retain consent source and timestamp for every lead.
- Enforce calling windows, opt-outs, suppression lists, retries, and concurrency server-side.
- Disclose that the caller is an AI assistant.
- Encrypt recordings/transcripts, apply retention limits, and restrict workspace access.
- Add authentication and durable storage before using real customer data.
