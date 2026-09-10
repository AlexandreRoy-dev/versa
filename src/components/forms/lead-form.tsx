"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "demo" | "error";
type FieldErrors = Partial<
  Record<"name" | "email" | "phone", string | undefined>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Set by next.config.ts on the static export, which has no API route. */
const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function LeadForm({
  dict,
  tone = "light",
}: {
  dict: Dictionary;
  tone?: "light" | "dark";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [amount, setAmount] = useState("");
  const [service, setService] = useState("");
  const isDark = tone === "dark";
  const t = dict.form;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = t.required;
    if (!phone) nextErrors.phone = t.required;
    if (!email) {
      nextErrors.email = t.required;
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = t.invalidEmail;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    // The GitHub Pages build has no API route to post to, so stop at
    // validation rather than firing a request that would 404.
    if (IS_STATIC_DEMO) {
      setStatus("demo");
      form.reset();
      setAmount("");
      setService("");
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: String(data.get("company") ?? ""),
          comments: String(data.get("comments") ?? ""),
          amount,
          service,
          locale: dict.locale,
        }),
      });

      if (!response.ok) throw new Error("request_failed");

      setStatus("success");
      form.reset();
      setAmount("");
      setService("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" || status === "demo") {
    return (
      <div
        className={cn(
          "rounded-2xl border p-8 text-center md:p-10",
          isDark
            ? "border-white/15 bg-white/5"
            : "border-border bg-white",
        )}
      >
        <span className="bg-brand-500 text-navy-950 mx-auto flex size-12 items-center justify-center rounded-full">
          <Check className="size-6" aria-hidden />
        </span>
        <h3
          className={cn(
            "font-heading mt-6 text-2xl font-semibold",
            isDark ? "text-white" : "text-navy-900",
          )}
        >
          {t.successTitle}
        </h3>
        <p
          className={cn(
            "text-pretty-vc mx-auto mt-3 max-w-md text-sm leading-relaxed",
            isDark ? "text-white/60" : "text-muted-foreground",
          )}
        >
          {status === "demo" ? t.demoBody : t.successBody}
        </p>
        <Button
          variant="outline"
          className={cn(
            "mt-7",
            isDark &&
              "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
          )}
          onClick={() => setStatus("idle")}
        >
          {t.successAgain}
        </Button>
      </div>
    );
  }

  const labelClass = cn(
    "text-sm font-medium",
    isDark ? "text-white/85" : "text-navy-900",
  );
  const fieldClass = cn(
    "h-11",
    isDark &&
      "border-white/20 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-brand-400",
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.name} htmlFor="name" error={errors.name} className={labelClass} isDark={isDark}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label={t.company} htmlFor="company" className={labelClass} isDark={isDark}>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            className={fieldClass}
          />
        </Field>
        <Field label={t.email} htmlFor="email" error={errors.email} className={labelClass} isDark={isDark}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label={t.phone} htmlFor="phone" error={errors.phone} className={labelClass} isDark={isDark}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className={labelClass}>{t.amount}</Label>
          <Select value={amount} onValueChange={setAmount}>
            <SelectTrigger className={cn("w-full", fieldClass)}>
              <SelectValue placeholder={t.amountPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {t.amountRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>{t.service}</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className={cn("w-full", fieldClass)}>
              <SelectValue placeholder={t.servicePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {dict.products.items.map((product) => (
                <SelectItem key={product.slug} value={product.name}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Field label={t.comments} htmlFor="comments" className={labelClass} isDark={isDark}>
        <Textarea
          id="comments"
          name="comments"
          rows={4}
          placeholder={t.commentsPlaceholder}
          className={cn(
            isDark &&
              "border-white/20 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-brand-400",
          )}
        />
      </Field>

      {status === "error" ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
          role="alert"
        >
          <TriangleAlert
            className="text-destructive mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <div>
            <p className="text-destructive text-sm font-medium">
              {t.errorTitle}
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                isDark ? "text-white/60" : "text-muted-foreground",
              )}
            >
              {t.errorBody}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="bg-brand-500 text-navy-950 hover:bg-brand-400 group h-12 px-6"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" aria-hidden />
              {t.submitting}
            </>
          ) : (
            <>
              {t.submit}
              <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
            </>
          )}
        </Button>
        <p
          className={cn(
            "max-w-xs text-xs leading-relaxed",
            isDark ? "text-white/40" : "text-muted-foreground",
          )}
        >
          {t.privacy}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
  isDark,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className={className}>
        {label}
      </Label>
      {children}
      {error ? (
        <p
          className={cn(
            "text-xs",
            isDark ? "text-red-300" : "text-destructive",
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
