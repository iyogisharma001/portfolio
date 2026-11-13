import { z } from "zod";

/**
 * Shared by the client form (React Hook Form) and the server action, so both
 * sides enforce exactly the same rules.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(254, "Email is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(120, "Subject must be 120 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
  /** Honeypot: hidden from people, tempting to bots. Must stay empty. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = "name" | "email" | "subject" | "message";

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<ContactField, string>> };
