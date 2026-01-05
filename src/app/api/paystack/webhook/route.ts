import crypto from 'crypto';
import { NextResponse } from 'next/server';

function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  // TODO: Parse event and handle e.g. charge.success
  const event = JSON.parse(rawBody);

  return NextResponse.json({ ok: true, received: true, event: event?.event ?? null, stub: true });
}
