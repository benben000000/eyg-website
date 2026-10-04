'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { peso, fmtDate } from '@/lib/format';
import { SectionKicker } from '@/components/Brand';
import { uid } from '@/lib/format';

type Tab = 'overview' | 'inventory' | 'services' | 'site' | 'sales';

export function AdminClient() {
  const { db, user, login, logout, restock, voidSale, updateProduct, addProduct, updateService, updateSiteBlock, doReset } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  const salesToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return db.sales.filter((s) => s.status === 'completed' && s.at.slice(0, 10) === today);
  }, [db]);
  const todayTotal = salesToday.reduce((s, x) => s + x.total, 0);
  const low = db.products.filter((p) => p.active && p.stock > 0 && p.stock <= p.reorderPoint);
  const out = db.products.filter((p) => p.active && p.stock === 0);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <SectionKicker>Admin — restricted</SectionKicker>
        <h1 className="font-display text-[36px] font-bold">SIGN IN WITH PIN</h1>
        <p className="mt-2 text-[14px]">Demo PINs — staff <span className="tnum font-bold">0000</span> (POS only), admin <span className="tnum font-bold">1234</span> (full access).</p>
        {err && <p className="mt-3 border border-danger px-3 py-2 text-[14px] text-danger">{err}</p>}
        <form
          className="ledger mt-4 flex gap-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            const u = login(pin);
            if (!u) setErr('Wrong PIN.');
          }}
        >
          <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN" inputMode="numeric" className="tnum flex-1 border hairline bg-offwhite px-3 py-2" aria-label="Admin PIN" />
          <button className="btn-primary px-4 py-2 text-[14px]" type="submit">Enter</button>
        </form>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SectionKicker>Admin ledger — controls the whole system</SectionKicker>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-[36px] font-bold leading-none">DASHBOARD</h1>
        <div className="tnum flex items-center gap-2 text-[13px]">
          <span>{user.name} · {user.role}</span>
          <button onClick={logout} className="btn-ghost px-2.5 py-1.5">Sign out</button>
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap gap-1.5" aria-label="Admin sections">
        {(['overview', 'inventory', 'services', 'site', 'sales'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary px-3 py-2 text-[13px]' : 'btn-ghost px-3 py-2 text-[13px]'}>
            {t === 'overview' ? 'Overview' : t === 'inventory' ? 'Inventory' : t === 'services' ? 'Services / POS items' : t === 'site' ? 'Landing content' : 'Sales'}
          </button>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="mt-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="ledger p-4">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Benta today</p>
              <p className="tnum mt-1 text-[24px] font-bold">{peso(todayTotal)}</p>
              <p className="tnum text-[12px] text-steel-500">{salesToday.length} tickets</p>
            </div>
            <div className="ledger p-4">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Low stock</p>
              <p className="tnum mt-1 text-[24px] font-bold">{low.length}</p>
              <p className="tnum text-[12px] text-steel-500">at or below reorder</p>
            </div>
            <div className="ledger p-4">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Out of stock</p>
              <p className="tnum mt-1 text-[24px] font-bold">{out.length}</p>
              <p className="tnum text-[12px] text-steel-500">shows UBOS</p>
            </div>
            <div className="ledger p-4">
              <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">Active items</p>
              <p className="tnum mt-1 text-[24px] font-bold">{db.products.filter((p) => p.active).length}</p>
              <p className="tnum text-[12px] text-steel-500">parts + consumables</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="ledger p-4">
              <p className="font-bold">Needs restock</p>
              {low.length === 0 && out.length === 0 ? <p className="mt-2 text-[14px]">All good. No low items.</p> : (
                <ul className="tnum mt-2 space-y-1 text-[13px]">
                  {[...out, ...low].slice(0, 6).map((p) => (
                    <li key={p.id} className="flex justify-between border-b hairline py-1.5 last:border-0">
                      <span>{p.sku} — {p.name}</span>
                      <span>{p.stock === 0 ? 'UBOS' : `${p.stock} left`}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setTab('inventory')} className="btn-ghost mt-3 px-3 py-1.5 text-[13px]">Open inventory</button>
            </div>
            <div className="ledger p-4">
              <p className="font-bold">Recent sales</p>
              <ul className="tnum mt-2 space-y-1 text-[13px]">
                {db.sales.slice(-5).reverse().map((s) => (
                  <li key={s.id} className="flex justify-between border-b hairline py-1.5 last:border-0">
                    <span>{s.id} · {s.status}</span>
                    <span>{peso(s.total)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <Link href="/pos" prefetch className="btn-ghost px-3 py-1.5 text-[13px]">Open POS</Link>
                <button onClick={() => setTab('sales')} className="btn-ghost px-3 py-1.5 text-[13px]">All sales</button>
              </div>
            </div>
          </div>
          {!isAdmin && <p className="tnum mt-3 border border-steel-300 bg-white px-3 py-2 text-[13px]">Staff view — restock, void, edit, and site content need admin PIN 1234.</p>}
        </div>
      )}

      {tab === 'inventory' && (
        <InventoryEditor isAdmin={isAdmin} />
      )}

      {tab === 'services' && (
        <div className="ledger mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[14px]">
            <thead>
              <tr className="tnum border-b hairline bg-offwhite text-[12px] uppercase text-steel-500">
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Labor</th>
                <th className="px-3 py-2">Linked parts</th>
                <th className="px-3 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {db.services.map((s) => (
                <tr key={s.id} className="border-b hairline last:border-0">
                  <td className="px-3 py-2"><span className="font-semibold">{s.name}</span><span className="block text-[12px] text-steel-500">{s.desc}</span></td>
                  <td className="tnum px-3 py-2">
                    {isAdmin ? (
                      <input type="number" defaultValue={s.basePrice} min={0} onBlur={(e) => updateService(s.id, { basePrice: Number(e.target.value) })} className="tnum w-24 border hairline px-2 py-1" aria-label={`${s.name} labor`} />
                    ) : peso(s.basePrice)}
                  </td>
                  <td className="tnum px-3 py-2 text-[13px]">{s.linkedProductIds.join(', ') || '—'}</td>
                  <td className="px-3 py-2">
                    {isAdmin ? (
                      <button onClick={() => updateService(s.id, { active: !s.active })} className="btn-ghost px-2.5 py-1 text-[12px]">{s.active ? 'Hide' : 'Show'}</button>
                    ) : <span className="tag tag-info">{s.active ? 'Shown' : 'Hidden'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tnum p-3 text-[12px] text-steel-500">Labor edits here show in POS and landing immediately. Parts themselves are edited in Inventory.</p>
        </div>
      )}

      {tab === 'site' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {db.siteBlocks.sort((a, b) => a.order - b.order).map((b) => (
            <SiteBlockEditor key={b.id} id={b.id} type={b.type} data={b.data} isAdmin={isAdmin} onSave={updateSiteBlock} />
          ))}
          {!isAdmin && <p className="tnum border border-steel-300 bg-white px-3 py-2 text-[13px]">Staff cannot edit landing content.</p>}
        </div>
      )}

      {tab === 'sales' && (
        <div className="ledger mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[14px]">
            <thead>
              <tr className="tnum border-b hairline bg-offwhite text-[12px] uppercase text-steel-500">
                <th className="px-3 py-2">Sale</th>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2">Status</th>
                {isAdmin && <th className="px-3 py-2 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {db.sales.slice().reverse().map((s) => (
                <tr key={s.id} className="tnum border-b hairline last:border-0">
                  <td className="px-3 py-2">{s.id}</td>
                  <td className="px-3 py-2">{fmtDate(s.at)}</td>
                  <td className="px-3 py-2 font-sans">{s.customerName ?? '—'} {s.plate ? `· ${s.plate}` : ''}</td>
                  <td className="px-3 py-2 text-right font-bold">{peso(s.total)}</td>
                  <td className="px-3 py-2">{s.status}</td>
                  {isAdmin && (
                    <td className="px-3 py-2 text-right">
                      {s.status === 'completed' ? (
                        <button onClick={() => voidSale(s.id)} className="btn-ghost px-2.5 py-1 text-[12px]">Void + return stock</button>
                      ) : <span className="text-[12px] text-steel-500">voided</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 flex items-center justify-between border-t hairline pt-4">
          <p className="tnum text-[12px] text-steel-500">Demo data lives in this browser only. Reset restores seed.</p>
          <button onClick={() => { if (confirm('Reset demo data?')) doReset(); }} className="btn-ghost px-3 py-1.5 text-[13px]">Reset demo</button>
        </div>
      )}
    </div>
  );
}

function InventoryEditor({ isAdmin }: { isAdmin: boolean }) {
  const { db, restock, updateProduct, addProduct } = useStore();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  return (
    <div className="mt-4">
      {isAdmin && (
        <form
          className="ledger flex flex-wrap items-end gap-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !price) return;
            const n = db.products.length + 1;
            addProduct({
              id: uid('p'),
              sku: `SKU-${String(n).padStart(4, '0')}`,
              name: name.trim(),
              brand: 'EYG Select',
              type: 'part',
              forVehicle: 'Universal',
              price: Number(price),
              cost: Number(price) * 0.65,
              unit: 'pc',
              trackStock: true,
              stock: Number(stock) || 0,
              reorderPoint: 5,
              active: true,
            });
            setName(''); setPrice(''); setStock('');
          }}
        >
          <label className="text-[13px] font-semibold">Add part
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spark Plug Iridium" className="mt-1 block w-56 border hairline bg-offwhite px-2.5 py-2 font-normal" />
          </label>
          <label className="text-[13px] font-semibold">Price PHP
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="450" className="tnum mt-1 block w-28 border hairline bg-offwhite px-2.5 py-2 font-normal" />
          </label>
          <label className="text-[13px] font-semibold">Opening stock
            <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" placeholder="10" className="tnum mt-1 block w-28 border hairline bg-offwhite px-2.5 py-2 font-normal" />
          </label>
          <button className="btn-primary px-4 py-2 text-[14px]" type="submit">Add to all (landing + POS)</button>
        </form>
      )}
      <div className="ledger mt-3 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-[14px]">
          <thead>
            <tr className="tnum border-b hairline bg-offwhite text-[12px] uppercase text-steel-500">
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Stock</th>
              <th className="px-3 py-2 text-right">{isAdmin ? 'Edit' : 'Note'}</th>
            </tr>
          </thead>
          <tbody>
            {db.products.map((p) => (
              <tr key={p.id} className="border-b hairline last:border-0">
                <td className="tnum px-3 py-2">{p.sku}</td>
                <td className="px-3 py-2 font-semibold">{p.name}</td>
                <td className="tnum px-3 py-2 text-right">
                  {isAdmin ? (
                    <input type="number" defaultValue={p.price} min={0} onBlur={(e) => updateProduct(p.id, { price: Number(e.target.value) })} className="tnum w-24 border hairline px-2 py-1 text-right" aria-label={`${p.name} price`} />
                  ) : peso(p.price)}
                </td>
                <td className="tnum px-3 py-2 text-right">{p.stock}</td>
                <td className="px-3 py-2 text-right">
                  {isAdmin ? (
                    <span className="inline-flex gap-1.5">
                      <button onClick={() => restock(p.id, 5)} className="btn-ghost px-2.5 py-1 text-[12px]">+5 restock</button>
                      <button onClick={() => updateProduct(p.id, { active: !p.active })} className="btn-ghost px-2.5 py-1 text-[12px]">{p.active ? 'Hide' : 'Show'}</button>
                    </span>
                  ) : <span className="tnum text-[12px] text-steel-500">admin only</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tnum mt-2 text-[12px] text-steel-500">One edit here updates landing price board, POS buttons, and stock flags everywhere.</p>
    </div>
  );
}

function SiteBlockEditor({ id, type, data, isAdmin, onSave }: { id: string; type: string; data: Record<string, string>; isAdmin: boolean; onSave: (id: string, d: Record<string, string>) => void }) {
  const [draft, setDraft] = useState(data);
  return (
    <div className="ledger p-4">
      <p className="tnum text-[12px] uppercase tracking-widest text-steel-500">{type} · {id}</p>
      <div className="mt-2 space-y-2">
        {Object.entries(draft).map(([k, v]) => (
          <label key={k} className="block text-[13px] font-semibold">{k}
            <input value={v} disabled={!isAdmin} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} className="mt-1 block w-full border hairline bg-offwhite px-2.5 py-2 font-normal" />
          </label>
        ))}
      </div>
      {isAdmin && (
        <button onClick={() => onSave(id, draft)} className="btn-primary mt-3 px-3 py-2 text-[13px]">Save — updates landing</button>
      )}
    </div>
  );
}
