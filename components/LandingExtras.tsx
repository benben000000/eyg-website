'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { peso } from '@/lib/format';

export function StockTeaser() {
  const { db } = useStore();
  const low = useMemo(() => db.products.filter((p) => p.active && p.stock <= p.reorderPoint).length, [db]);
  const out = useMemo(() => db.products.filter((p) => p.active && p.stock === 0).length, [db]);
  return (
    <div className="tnum mt-3 flex items-center justify-between border-t hairline pt-3 text-[13px]">
      <span>
        Stock today: {db.products.filter((p) => p.active).length} items · {low} low · {out} out
      </span>
      <Link href="/inventory" prefetch className="font-bold underline">
        Check
      </Link>
    </div>
  );
}

export function PriceBoardStatic() {
  const { db } = useStore();
  const rows = db.products.filter((p) => p.active).slice(0, 8);
  return (
    <div className="ledger overflow-hidden">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="tnum border-b hairline bg-offwhite text-[12px] uppercase tracking-wider text-steel-500">
            <th className="px-3 py-2">SKU</th>
            <th className="px-3 py-2">Pyesa</th>
            <th className="px-3 py-2 text-right">Presyo</th>
            <th className="px-3 py-2 text-right">Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="tnum border-b hairline last:border-0">
              <td className="px-3 py-2">{p.sku}</td>
              <td className="px-3 py-2 font-sans font-semibold">{p.name}</td>
              <td className="px-3 py-2 text-right">{peso(p.price)}</td>
              <td className="px-3 py-2 text-right">
                {p.stock === 0 ? <span className="tag tag-out">Ubos</span> : p.stock <= p.reorderPoint ? <span className="tag tag-low">{p.stock} · Mababa</span> : <span>{p.stock}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
