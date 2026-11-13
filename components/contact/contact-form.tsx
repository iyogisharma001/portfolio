"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { submitContact } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactField, type ContactInput } from "@/lib/validations";

const inputClasses =
  "w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-[0.95rem] text-zinc-100 transition-colors outline-none placeholder:text-zinc-600 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10";

function fieldBorder(hasError: boolean) {
  return hasError ? "border-rose-400/60" : "border-white/10 hover:border-white/20";
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
};

function Field({ label, error, hint, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
        {hint}
      </div>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const textFields: {
  name: Exclude<ContactField, "message">;
  label: string;
  props: InputHTMLAttributes<HTMLInputElement>;
}[] = [
  { name: "name", label: "Name", props: { autoComplete: "name", placeholder: "Ada Lovelace" } },
  {
    name: "email",
    label: "Email",
    props: { type: "email", autoComplete: "email", placeholder: "ada@example.com", inputMode: "email" },
  },
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  async function onSubmit(values: ContactInput) {
    try {
      const result = await submitContact(values);
      if (result.ok) {
        toast.success("Message sent", { description: result.message });
        reset();
        return;
      }

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as ContactField, { type: "server", message });
      }
      toast.error("Couldn't send your message", { description: result.message });
    } catch {
      toast.error("Network error", {
        description: "Your message wasn't sent. Check your connection and try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {textFields.map(({ name, label, props }) => (
          <Field key={name} label={label} error={errors[name]?.message}>
            {(aria) => (
              <input
                {...aria}
                {...props}
                {...register(name)}
                className={cn(inputClasses, fieldBorder(Boolean(errors[name])))}
              />
            )}
          </Field>
        ))}
      </div>

      <Field label="Subject" error={errors.subject?.message}>
        {(aria) => (
          <input
            {...aria}
            {...register("subject")}
            placeholder="Internship opportunity at …"
            className={cn(inputClasses, fieldBorder(Boolean(errors.subject)))}
          />
        )}
      </Field>

      <Field
        label="Message"
        error={errors.message?.message}
        hint={
          <span
            className={cn(
              "font-mono text-xs tabular-nums",
              messageLength > 2000 ? "text-rose-300" : "text-zinc-600",
            )}
          >
            {messageLength}/2000
          </span>
        }
      >
        {(aria) => (
          <textarea
            {...aria}
            {...register("message")}
            rows={6}
            placeholder="Tell me a little about the role or project…"
            className={cn(inputClasses, "resize-y", fieldBorder(Boolean(errors.message)))}
          />
        )}
      </Field>

      {/* Honeypot: invisible to people and assistive tech, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <p className="text-xs text-zinc-500">I usually reply within a day or two.</p>
        <Button type="submit" disabled={isSubmitting} className="min-w-40">
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
