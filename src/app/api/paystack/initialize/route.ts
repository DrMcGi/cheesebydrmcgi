import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDefaultCurrency, normalizeCurrency } from '@/lib/currency';

const BodySchema = z.object({
  email: z.string().email(),
  amount: z.number().int().positive(),
  currency: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const currency = normalizeCurrency(parsed.data.currency) ?? getDefaultCurrency();

  // NOTE: Stub only. Implement Paystack Initialize Transaction call here.
  // Paystack expects amount in kobo/cents depending on currency.

  return NextResponse.json({
    ok: true,
    stub: true,
    currency,
    hint: 'Implement Paystack initialize transaction API call using PAYSTACK_SECRET_KEY',
  });
}
