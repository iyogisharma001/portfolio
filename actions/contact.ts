"use server";

import { sendContactNotification } from "@/lib/email";
import { hasDatabase, prisma } from "@/lib/prisma";
import {
  contactSchema,
  type ContactField,
  type ContactInput,
  type ContactResult,
} from "@/lib/validations";
import { getVisitor } from "@/lib/visitor";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const SUCCESS: ContactResult = {
  ok: true,
  message: "Thanks for reaching out — I'll get back to you soon.",
};

/**
 * Handle a contact form submission: validate, rate limit, persist to
 * PostgreSQL, then notify by email. Never trusts the client — the same Zod
 * schema the form uses is re-run here.
 */
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    // A filled honeypot means a bot. Pretend it worked so it doesn't retry.
    if (parsed.error.issues.some((issue) => issue.path[0] === "website")) return SUCCESS;

    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const { name, email, subject, message } = parsed.data;
  const visitor = await getVisitor();

  let messageId: string | null = null;

  if (hasDatabase) {
    try {
      const recent = await prisma.message.count({
        where: {
          ipHash: visitor.hash,
          createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
        },
      });
      if (recent >= RATE_LIMIT_MAX) {
        return {
          ok: false,
          message: "You've sent several messages recently. Please try again in an hour.",
        };
      }

      const saved = await prisma.message.create({
        data: {
          name,
          email,
          subject,
          body: message,
          ipHash: visitor.hash,
          userAgent: visitor.userAgent,
        },
        select: { id: true },
      });
      messageId = saved.id;
    } catch (error) {
      console.error("[contact] Could not save message:", error);
    }
  } else {
    console.warn("[contact] DATABASE_URL is not set — message will not be stored.");
  }

  let delivered = false;
  try {
    ({ delivered } = await sendContactNotification({ name, email, subject, message }));
  } catch (error) {
    console.error("[contact] Notification email failed:", error);
  }

  if (messageId && delivered) {
    await prisma.message
      .update({ where: { id: messageId }, data: { notified: true } })
      .catch((error: unknown) => console.error("[contact] Could not flag message:", error));
  }

  // The message is safe if it reached the database or the inbox.
  if (messageId || delivered) return SUCCESS;

  return {
    ok: false,
    message: "Something went wrong on my end. Please email me directly instead.",
  };
}
