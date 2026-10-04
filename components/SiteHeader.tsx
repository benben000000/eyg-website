'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Brand';
import { useStore } from '@/lib/store';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Parts' },
  { href: '/pos', label: 'POS' },
  { href: '/admin', label: 'Admin' },
];

export function SiteHeader() {
  const path = usePathname();
  const { cart, user } = useStore();
  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-paper">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="flex items-center gap-1 text-[14px] font-semibold" aria-label="Main">
          {NAV.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                prefetch
                className={`rounded px-2.5 py-1.5 ${active ? 'bg-charcoal-900 text-white' : 'text-charcoal-900 hover:bg-steel-100'}`}
              >
                {n.label}
                {n.href === '/pos' && count > 0 && (
                  <span className="tnum ml-1.5 border border-amberbrand-600 px-1 text-[11px]">{count}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="tnum text-[12px] text-steel-500">{user ? `${user.name} · ${user.role}` : 'Demo — no login'}</span>
          <a
            href="https://www.facebook.com/profile.php?id=61582418828014"
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-3 py-2 text-[13px]"
          >
            Book on Facebook
          </a>
        </div>
      </div>
    </header>
  );
}
