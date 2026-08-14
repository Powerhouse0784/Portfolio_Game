import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rateLimit";

// Where messages land once Brevo is configured. Matches the resume's contact email.
const OWNER_EMAIL = "saquibnadeem784@gmail.com";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many messages sent. Try again in ${Math.ceil(retryAfterMs / 1000)}s.` },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = sanitize(body.name ?? "");
  const email = sanitize(body.email ?? "");
  const message = sanitize(body.message ?? "");

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are all required." }, { status: 400 });
  }
  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "That doesn't look like a valid email address." }, { status: 400 });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    // No email service configured yet. Accept the submission and log it server-side
    // rather than silently dropping it, but tell the client honestly that delivery
    // isn't live — the UI shows a direct-email fallback when this happens.
    console.log("[contact] Received (BREVO_API_KEY not set, not delivered):", { name, email, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
      body: JSON.stringify({
        // This sender address must be a verified sender in your Brevo account
        // (same single-sender verification flow you already did for Intense Learners).
        sender: { name: "Portfolio Park", email: "saquibnadeem784@gmail.com" },
        to: [{ email: OWNER_EMAIL }],
        replyTo: { email, name },
        subject: `Portfolio contact from ${name}`,
        textContent: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Brevo send failed:", await res.text());
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Brevo send threw:", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
