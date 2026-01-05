import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GoogleSignInButton } from '@/components/google-sign-in-button';

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-zinc-300">Use Google to continue.</p>
      <GoogleSignInButton />
      <p className="text-xs text-zinc-400">
        We only scaffold authentication. Customize onboarding + profiles as needed.
      </p>
    </div>
  );
}
