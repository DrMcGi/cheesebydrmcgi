'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function GoogleSignInButton() {
  async function signIn() {
    const supabase = createSupabaseBrowserClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign-in failed:', error);
    }

    // If successful, Supabase will redirect the browser. `data` is kept for debugging.
    if (!data?.url && !error) {
      console.warn('Google sign-in did not return a redirect URL. Check Supabase provider setup and redirect URLs.');
    }
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
