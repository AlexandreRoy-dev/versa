import { NextResponse } from "next/server";

/*
  Prototype endpoint. It validates the payload and logs it so the flow can be
  demonstrated end to end without credentials. Wiring this to email, a CRM, or
  the client's existing inbox is a follow-up once they choose a destination.
*/
export type LeadPayload = {
  name: string;
  company?: string;
  email: string;
  phone: string;
  amount?: string;
  service?: string;
  comments?: string;
  locale?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const errors: Record<string, string> = {};

  if (!body.name?.trim()) errors.name = "required";
  if (!body.phone?.trim()) errors.phone = "required";
  if (!body.email?.trim()) {
    errors.email = "required";
  } else if (!EMAIL_PATTERN.test(body.email.trim())) {
    errors.email = "invalid";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  console.info("[versa] financing request received", {
    name: body.name,
    company: body.company ?? null,
    email: body.email,
    phone: body.phone,
    amount: body.amount ?? null,
    service: body.service ?? null,
    locale: body.locale ?? null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
