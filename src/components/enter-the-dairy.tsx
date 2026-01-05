import Link from 'next/link';

export function EnterTheDairy() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Cheese by Dr McGi</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Enter the Dairy</h1>
        <p className="max-w-2xl text-zinc-300">
          A cozy foundation for a cheese storefront—auth, payments, and multi-currency scaffolding included.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-5 py-3 text-sm font-medium text-zinc-950 no-underline"
          href="/login"
        >
          Sign in with Google
        </Link>
        <a
          className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-50 no-underline"
          href="#payments"
        >
          View payments scaffolding
        </a>
      </div>

      <div id="payments" className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold">Paystack</h2>
          <p className="mt-2 text-sm text-zinc-300">
            API route stubs are in <code className="text-zinc-200">/api/paystack/*</code>.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold">Currency</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Default is <strong>ZAR</strong>, with helpers to normalize and expand to multi-currency.
          </p>
        </div>
      </div>
    </section>
  );
}
