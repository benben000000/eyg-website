import Link from 'next/link';

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="EYG Auto Care home">
      <span
        className="font-display flex h-9 w-9 items-center justify-center text-[19px] font-bold"
        style={{ background: dark ? '#F6F3EC' : '#1C1E22', color: dark ? '#1C1E22' : '#F6F3EC' }}
      >
        EYG
      </span>
      <span className="leading-none">
        <span className="font-display block text-[18px] font-bold tracking-wide">EYG AUTO CARE</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-500">
          Shop ledger
        </span>
      </span>
    </Link>
  );
}

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="tnum text-[12px] font-semibold uppercase tracking-[0.14em] text-steel-500">{children}</span>
      <span className="h-px flex-1 bg-steel-300" aria-hidden />
    </div>
  );
}
