import "server-only";
import { Resend } from "resend";
import { profile } from "@/lib/data";

type ContactEmail = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type EmailResult = { delivered: boolean; mocked: boolean };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Notify the site owner about a new contact message.
 *
 * With `RESEND_API_KEY` set, the email is sent through Resend. Without it the
 * notification is mocked: logged to the server console so local development
 * works with no email provider.
 */
export async function sendContactNotification(input: ContactEmail): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(
      `[email:mock] New message for ${to}\n  From: ${input.name} <${input.email}>\n  Subject: ${input.subject}\n  ${input.message.replaceAll("\n", "\n  ")}`,
    );
    return { delivered: false, mocked: true };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Portfolio: ${input.subject}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
  <p><strong>${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt; sent a message from your portfolio.</p>
  <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
  <p style="white-space:pre-wrap;border-left:3px solid #6366f1;padding-left:12px">${escapeHtml(input.message)}</p>
</div>`,
  });

  if (error) {
    console.error("[email] Resend rejected the notification:", error.message);
    return { delivered: false, mocked: false };
  }
  return { delivered: true, mocked: false };
}
