import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-charcoal-950 text-[#F6F3EC]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4">
        <div>
          <p className="font-display text-[20px] font-bold">EYG AUTO CARE</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#C8CDD4]">
            Change oil, PMS, wash, detailing. Presyong shop, walang tago. Record kept per plate number.
          </p>
        </div>
        <div>
          <p className="tnum text-[12px] uppercase tracking-widest text-[#C8CDD4]">Serbisyo</p>
          <ul className="mt-2 space-y-1 text-[14px]">
            <li>Change Oil / PMS</li>
            <li>Car Wash / Detailing</li>
            <li>Brake Service</li>
            <li>Undercoating</li>
          </ul>
        </div>
        <div>
          <p className="tnum text-[12px] uppercase tracking-widest text-[#C8CDD4]">Oras</p>
          <ul className="tnum mt-2 space-y-1 text-[14px]">
            <li>Mon–Sat: 8:00AM – 5:30PM</li>
            <li>Sun: Closed</li>
            <li>PMS cut-off: 3:30PM</li>
          </ul>
        </div>
        <div>
          <p className="tnum text-[12px] uppercase tracking-widest text-[#C8CDD4]">Contact</p>
          <ul className="mt-2 space-y-1 text-[14px]">
            <li>
              <a
                className="underline"
                href="https://www.facebook.com/profile.php?id=61582418828014"
                target="_blank"
                rel="noreferrer"
              >
                Facebook — EYG Auto Care Shop
              </a>
            </li>
            <li>
              <Link className="underline" href="/inventory">Parts price board</Link>
            </li>
            <li>
              <Link className="underline" href="/pos">Counter POS</Link>
            </li>
            <li>
              <Link className="underline" href="/admin">Admin ledger</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-700">
        <div className="tnum mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[12px] text-[#C8CDD4]">
          <span>EYG Auto Care Shop · Demo build v0.1</span>
          <span>Prices in PHP · Asia/Manila</span>
        </div>
      </div>
    </footer>
  );
}
