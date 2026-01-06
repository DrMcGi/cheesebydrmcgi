import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isOwnerEmail } from '@/lib/auth/owner';

export default async function VaultsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = isOwnerEmail(user?.email);

  if (isOwner) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
              Vaults (Owner)
            </div>
            <h1 className="text-4xl font-light tracking-tight text-zinc-50 sm:text-5xl">
              Owner access granted.
            </h1>
          </div>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          <p className="text-sm text-zinc-400">
            This project doesn’t implement “drops/points” yet — this is the admin bypass hook.
          </p>
          {user?.email ? (
            <p className="text-xs text-zinc-500">Signed in as: {user.email}</p>
          ) : null}
        </div>
      </div>
    );
  }

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
