/**
 * Sends a message through /api/contact. Returns false when email delivery
 * is not configured, so the caller can fall back to opening the mail app.
 */
export async function sendMessage(message: { subject: string; text: string; replyTo?: string }) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    return res.ok;
  } catch {
    return false;
  }
}
