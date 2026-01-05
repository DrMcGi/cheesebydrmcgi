export default function VaultsPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
            Vaults
          </div>
          <h1 className="text-4xl font-light tracking-tight text-zinc-50 sm:text-5xl">
            You don&apos;t have enough Cheese to see this.
          </h1>
        </div>
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <p className="text-sm text-zinc-400">
          Access restricted to those with sufficient holdings.
        </p>
      </div>
    </div>
  );
}
