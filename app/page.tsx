import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Wrench, Droplets, Sparkles, Disc3, ShieldCheck, Phone } from 'lucide-react';
import seed from '@/data/seed.json';
import { peso } from '@/lib/format';
import { SectionKicker } from '@/components/Brand';
import { StockTeaser, PriceBoardStatic } from '@/components/LandingExtras';

export const revalidate = 3600;

const SERVICE_ICONS = [Droplets, Wrench, Sparkles, Sparkles, ShieldCheck, Disc3];

export default function Home() {
  const blocks = Object.fromEntries(seed.siteBlocks.map((b) => [b.id, b.data])) as unknown as Record<string, Record<string, string>>;
  const hero = blocks['b-hero'];
  const notice = blocks['b-notice'];
  const hours = blocks['b-hours'];
  const contact = blocks['b-contact'];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Notice strip — flat, no glow */}
      <p className="tnum mt-4 border border-steel-300 bg-white px-3 py-2 text-[13px] text-charcoal-900">
        {notice.text}
      </p>

      {/* Hero — asymmetric 7/5, left aligned */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="tnum text-[12px] font-semibold uppercase tracking-[0.16em] text-steel-500">
            {hero.kicker}
          </p>
          <h1 className="font-display mt-2 text-[44px] font-bold leading-[0.95] sm:text-[56px]">{hero.title}</h1>
          <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed">{hero.sub}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={contact.facebook}
              target="_blank"
              rel="noreferrer"
              className="btn-amber px-4 py-2.5 text-[14px]"
            >
              {hero.cta1}
            </a>
            <a href="#presyo" className="btn-ghost px-4 py-2.5 text-[14px]">
              {hero.cta2}
            </a>
          </div>
          <dl className="tnum mt-6 grid max-w-md grid-cols-3 border hairline bg-white text-center text-[13px]">
            <div className="border-r hairline px-2 py-3">
              <dt className="text-steel-500">Change oil</dt>
              <dd className="mt-1 font-bold">{peso(1950)}+</dd>
            </div>
            <div className="border-r hairline px-2 py-3">
              <dt className="text-steel-500">PMS</dt>
              <dd className="mt-1 font-bold">{peso(1200)} labor</dd>
            </div>
            <div className="px-2 py-3">
              <dt className="text-steel-500">Wash</dt>
              <dd className="mt-1 font-bold">{peso(250)}</dd>
            </div>
          </dl>
        </div>

        <aside className="lg:col-span-5">
          <div className="ledger overflow-hidden">
            <div className="relative aspect-[4/3] bg-steel-100">
              <Image
                src="/assets/shop-bay.svg"
                alt="EYG bay 1 — change oil"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
            <div className="border-t hairline p-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-[20px] font-bold">BAY 1 — TODAY</p>
                <span className="tag tag-info">Walk-in</span>
              </div>
              <ul className="tnum mt-2 space-y-1 text-[13px]">
                <li className="flex items-center gap-2">
                  <Clock size={15} /> {hours.weekdays}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={15} /> {contact.address}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={15} /> {contact.phone}
                </li>
              </ul>
              <StockTeaser />
            </div>
          </div>
        </aside>
      </div>

      {/* Services — rows, not 3-col tinted cards */}
      <section className="mt-12" aria-label="Serbisyo">
        <SectionKicker>Serbisyo — price + time, no surprises</SectionKicker>
        <h2 className="font-display text-[32px] font-bold">WHAT WE DO IN THE SHOP</h2>
        <div className="mt-4 border-t hairline">
          {seed.services
            .filter((s) => s.active)
            .map((s, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <div key={s.id} className="grid gap-2 border-b hairline bg-white px-3 py-3 sm:grid-cols-12 sm:items-center">
                  <div className="flex items-center gap-3 sm:col-span-5">
                    <span className="flex h-9 w-9 items-center justify-center border hairline">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-[15px] font-bold">{s.name}</p>
                      <p className="text-[13px] text-steel-500">{s.desc}</p>
                    </div>
                  </div>
                  <p className="tnum text-[13px] sm:col-span-3">{s.laborMins} min · labor {s.basePrice ? peso(s.basePrice) : 'by parts'}</p>
                  <p className="tnum text-[13px] sm:col-span-2">
                    {s.linkedProductIds.length > 0 ? `${s.linkedProductIds.length} parts linked` : 'No parts'}
                  </p>
                  <div className="sm:col-span-2 sm:text-right">
                    <Link href="/pos" prefetch className="btn-ghost inline-block px-3 py-1.5 text-[13px]">
                      Add in POS
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Price board */}
      <section id="presyo" className="mt-12 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionKicker>Paalala</SectionKicker>
          <h2 className="font-display text-[32px] font-bold">PRICE BOARD</h2>
          <p className="mt-2 text-[14px] leading-relaxed">
            Same prices here, in the shop, and at the counter. POS and inventory read from one list — no
            double entry. Stock counts update when the counter sells.
          </p>
          <p className="tnum mt-3 border border-steel-300 bg-warningbg px-3 py-2 text-[13px]">
            Out-of-stock items show UBOS. Ask counter for restock day or reserve.
          </p>
          <Link href="/inventory" prefetch className="btn-primary mt-4 inline-block px-4 py-2.5 text-[14px]">
            Open full parts list
          </Link>
        </div>
        <div className="lg:col-span-8">
          <PriceBoardStatic />
        </div>
      </section>

      {/* Visit */}
      <section className="mt-12 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionKicker>Punta sa shop</SectionKicker>
          <h2 className="font-display text-[32px] font-bold">HOURS AND CONTACT</h2>
          <div className="ledger mt-4 grid sm:grid-cols-2">
            <div className="border-b hairline p-4 sm:border-b-0 sm:border-r">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Oras</p>
              <p className="tnum mt-2 text-[15px] font-bold">{hours.weekdays}</p>
              <p className="tnum text-[15px]">{hours.sunday}</p>
              <p className="mt-2 text-[13px] text-steel-500">{hours.note}</p>
            </div>
            <div className="p-4">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Contact</p>
              <p className="mt-2 text-[14px]">{contact.address}</p>
              <p className="tnum mt-1 text-[14px]">{contact.phone}</p>
              <a href={contact.facebook} target="_blank" rel="noreferrer" className="btn-amber mt-3 inline-block px-4 py-2 text-[13px]">
                Message on Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <SectionKicker>How it connects</SectionKicker>
          <ol className="ledger list-decimal space-y-2 p-4 pl-8 text-[14px] leading-relaxed">
            <li>Admin edits price or photo once — landing, POS, and inventory update together.</li>
            <li>Counter sells in POS — stock drops in inventory, sale appears in admin.</li>
            <li>Low stock flags MABABA / UBOS everywhere, same rule.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
