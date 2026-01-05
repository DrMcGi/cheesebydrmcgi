import Link from 'next/link';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="font-semibold tracking-tight">Cheese by Dr McGi</div>
          <nav className="flex items-center gap-4 text-sm text-zinc-200">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-400">
          © {new Date().getFullYear()} Cheese by Dr McGi
        </div>
      </footer>
    </div>
  );
}
