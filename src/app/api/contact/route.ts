import { NextResponse } from "next/server";

// Sends briefs and talk invitations by email through Resend when RESEND_API_KEY is set.
// Without it the endpoint answers 503 and the site falls back to the visitor's mail app.

type Message = { subject?: string; text?: string; replyTo?: string };

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email is not configured" }, { status: 503 });

  const { subject, text, replyTo } = (await request.json().catch(() => ({}))) as Message;
  if (!subject || !text || subject.length > 200 || text.length > 8000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO || "qulamovsenan@gmail.com",
      subject,
      text,
      reply_to: replyTo && /^\S+@\S+\.\S+$/.test(replyTo) ? replyTo : undefined,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Could not send" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
