'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { peso } from '@/lib/format';
import { SectionKicker } from '@/components/Brand';

export default function InventoryPage() {
  const { db, user } = useStore();
  const [q, setQ] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const isAdmin = user?.role === 'admin';

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return db.products
      .filter((p) => p.active)
      .filter((p) => (lowOnly ? p.stock <= p.reorderPoint : true))
      .filter((p) =>
        needle
          ? `${p.sku} ${p.name} ${p.brand} ${p.forVehicle}`.toLowerCase().includes(needle)
          : true
      );
  }, [db, q, lowOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SectionKicker>Parts — one list for shop, POS, and admin</SectionKicker>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[36px] font-bold leading-none">PARTS PRICE BOARD</h1>
        <p className="tnum text-[13px] text-steel-500">
          {rows.length} items · prices in PHP · {isAdmin ? 'cost visible (admin)' : 'login as admin (1234) to see cost'}
        </p>
      </div>

      <div className="ledger mt-4 flex flex-wrap items-center gap-2 p-3">
        <label className="flex flex-1 items-center gap-2 border hairline bg-offwhite px-2.5 py-2" style={{ minWidth: 220 }}>
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search SKU / pyesa / brand — Vios, filter…"
            className="tnum w-full bg-transparent text-[14px] outline-none"
            aria-label="Search parts"
          />
        </label>
        <button
          onClick={() => setLowOnly((v) => !v)}
          className={lowOnly ? 'btn-primary px-3 py-2 text-[13px]' : 'btn-ghost px-3 py-2 text-[13px]'}
          aria-pressed={lowOnly}
        >
          Low stock only
        </button>
        <Link href="/pos" prefetch className="btn-amber px-3 py-2 text-[13px]">
          Sell in POS
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="ledger mt-4 flex items-center gap-3 p-8">
          <span className="flex h-11 w-11 items-center justify-center border hairline">
            <Package size={20} />
          </span>
          <div>
            <p className="font-bold">Walang nahanap.</p>
            <p className="text-[13px] text-steel-500">Try ibang spelling o tanong sa counter.</p>
          </div>
        </div>
      ) : (
        <div className="ledger mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[14px]">
            <thead>
              <tr className="tnum border-b hairline bg-offwhite text-[12px] uppercase tracking-wider text-steel-500">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Pyesa</th>
                <th className="px-3 py-2">Para sa</th>
                <th className="px-3 py-2 text-right">Stock</th>
                <th className="px-3 py-2 text-right">Presyo</th>
                {isAdmin && <th className="px-3 py-2 text-right">Cost</th>}
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={`border-b hairline last:border-0 ${p.stock === 0 ? '' : p.stock <= p.reorderPoint ? 'bg-warningbg' : ''}`}>
                  <td className="tnum px-3 py-2">{p.sku}</td>
                  <td className="px-3 py-2">
                    <span className="font-semibold">{p.name}</span>
                    <span className="block text-[12px] text-steel-500">{p.brand} · {p.unit}</span>
                  </td>
                  <td className="px-3 py-2 text-[13px]">{p.forVehicle}</td>
                  <td className="tnum px-3 py-2 text-right">
                    {p.stock === 0 ? (
                      <span className="tag tag-out">Ubos</span>
                    ) : p.stock <= p.reorderPoint ? (
                      <span className="tag tag-low">{p.stock} · Mababa</span>
                    ) : (
                      <span>{p.stock}</span>
                    )}
                  </td>
                  <td className="tnum px-3 py-2 text-right font-bold">{peso(p.price)}</td>
                  {isAdmin && <td className="tnum px-3 py-2 text-right text-steel-500">{peso(p.cost)}</td>}
                  <td className="px-3 py-2 text-right">
                    <Link href="/pos" prefetch className="btn-ghost inline-block px-2.5 py-1 text-[12px]">
                      Sell
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="tnum mt-3 text-[12px] text-steel-500">
        Same list the counter sells from. Restock only in Admin — no double entry.
      </p>
    </div>
  );
}
