'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function GoogleSignInButton() {
  async function signIn() {
    const supabase = createSupabaseBrowserClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={signIn}
      className="inline-flex w-fit items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50"
    >
      Continue with Google
    </button>
  );
}
