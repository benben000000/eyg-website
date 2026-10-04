'use client';
import { useMemo, useState } from 'react';
import { Minus, Plus, Printer, Receipt, Search, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { peso } from '@/lib/format';
import { SectionKicker } from '@/components/Brand';

export function POSClient() {
  const { db, cart, addToCart, setQty, clearCart, checkout, user, login } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | 'service' | 'part'>('all');
  const [pin, setPin] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [plate, setPlate] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'gcash' | 'card'>('cash');
  const [lastSale, setLastSale] = useState<string | null>(null);
  const [err, setErr] = useState('');

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const prods = db.products
      .filter((p) => p.active)
      .filter((p) => (cat === 'all' || cat === 'part' ? true : false))
      .filter((p) => (needle ? `${p.sku} ${p.name}`.toLowerCase().includes(needle) : true))
      .map((p) => ({ kind: 'product' as const, refId: p.id, name: p.name, unitPrice: p.price, stock: p.stock }));
    const servs = db.services
      .filter((s) => s.active)
      .filter(() => cat === 'all' || cat === 'service')
      .filter((s) => (needle ? s.name.toLowerCase().includes(needle) : true))
      .map((s) => ({ kind: 'service' as const, refId: s.id, name: s.name, unitPrice: s.basePrice, stock: 99 }));
    return [...servs, ...prods];
  }, [db, q, cat]);

  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  const doCheckout = () => {
    setErr('');
    if (cart.length === 0) {
      setErr('Ticket is empty. Add at least one item.');
      return;
    }
    // Block oversell
    for (const l of cart) {
      if (l.kind === 'product') {
        const p = db.products.find((x) => x.id === l.refId);
        if (p && p.trackStock && l.qty > p.stock) {
          setErr(`${p.name}: only ${p.stock} in stock. Reduce qty or restock in Admin.`);
          return;
        }
      }
    }
    try {
      const id = checkout({ customerName: customerName || undefined, plate: plate || undefined, payMethod });
      setLastSale(id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Checkout failed');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SectionKicker>Counter — sells from the same stock list</SectionKicker>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-[36px] font-bold leading-none">POS TICKET</h1>
        {!user ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const u = login(pin);
              if (!u) setErr('Wrong PIN. Try 0000 (staff) or 1234 (admin).');
              else setErr('');
            }}
          >
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN: 0000 / 1234"
              inputMode="numeric"
              className="tnum w-36 border hairline bg-white px-2.5 py-2 text-[14px]"
              aria-label="Staff PIN"
            />
            <button className="btn-primary px-3 py-2 text-[13px]" type="submit">
              Clock in
            </button>
          </form>
        ) : (
          <p className="tnum text-[13px] text-steel-500">
            {user.name} · {user.role}
          </p>
        )}
      </div>

      {err && <p className="mt-3 border border-danger bg-white px-3 py-2 text-[14px] text-danger">{err}</p>}
      {lastSale && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-steel-300 bg-white px-3 py-2">
          <p className="tnum text-[14px]">
            Paid — <strong>{lastSale}</strong> · Total {peso(db.sales.find((s) => s.id === lastSale)?.total ?? 0)}
          </p>
          <button className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-[13px]" onClick={() => window.print()}>
            <Printer size={15} /> Print receipt
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="ledger flex flex-wrap items-center gap-2 p-3">
            <label className="flex min-w-[200px] flex-1 items-center gap-2 border hairline bg-offwhite px-2.5 py-2">
              <Search size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search service or part…"
                className="w-full bg-transparent text-[14px] outline-none"
                aria-label="Search items"
              />
            </label>
            {(['all', 'service', 'part'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cat === c ? 'btn-primary px-3 py-2 text-[13px]' : 'btn-ghost px-3 py-2 text-[13px]'}
              >
                {c === 'all' ? 'All' : c === 'service' ? 'Services' : 'Parts'}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((it) => (
              <button
                key={`${it.kind}-${it.refId}`}
                disabled={it.kind === 'product' && it.stock === 0}
                onClick={() => addToCart({ kind: it.kind, refId: it.refId, name: it.name, unitPrice: it.unitPrice, qty: 1 })}
                className="ledger min-h-[48px] p-3 text-left hover:border-charcoal-900 disabled:opacity-50"
              >
                <span className="block text-[14px] font-bold leading-tight">{it.name}</span>
                <span className="tnum mt-1 flex items-center justify-between text-[13px]">
                  <span>{it.kind === 'service' && it.unitPrice === 0 ? 'price by parts' : peso(it.unitPrice)}</span>
                  {it.kind === 'product' && <span>{it.stock === 0 ? 'UBOS' : `${it.stock} left`}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="ledger no-print sticky top-[72px] p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-[22px] font-bold">TICKET</p>
              <button onClick={clearCart} className="btn-ghost flex items-center gap-1 px-2.5 py-1.5 text-[12px]">
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                className="border hairline bg-offwhite px-2.5 py-2 text-[14px]"
                aria-label="Customer name"
              />
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Plate — NCA 1234"
                className="tnum border hairline bg-offwhite px-2.5 py-2 text-[14px]"
                aria-label="Plate number"
              />
            </div>
            {cart.length === 0 ? (
              <p className="mt-4 flex items-center gap-2 border border-dashed hairline p-4 text-[14px] text-steel-500">
                <Receipt size={16} /> No items yet. Tap a service or part to add.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-steel-100 border-y hairline">
                {cart.map((l) => (
                  <li key={`${l.kind}-${l.refId}`} className="flex items-center justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold">{l.name}</p>
                      <p className="tnum text-[12px] text-steel-500">
                        {peso(l.unitPrice)} each
                      </p>
                    </div>
                    <div className="tnum flex items-center gap-1.5">
                      <button onClick={() => setQty(l.refId, l.kind, l.qty - 1)} className="btn-ghost px-2 py-1" aria-label="Decrease">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center">{l.qty}</span>
                      <button onClick={() => setQty(l.refId, l.kind, l.qty + 1)} className="btn-ghost px-2 py-1" aria-label="Increase">
                        <Plus size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="tnum mt-3 space-y-1 text-[14px]">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{peso(subtotal)}</span>
              </p>
              <p className="flex justify-between text-[20px] font-bold">
                <span>Total</span>
                <span>{peso(subtotal)}</span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(['cash', 'gcash', 'card'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={payMethod === m ? 'btn-primary px-2 py-2 text-[13px]' : 'btn-ghost px-2 py-2 text-[13px]'}
                >
                  {m === 'cash' ? 'Cash' : m === 'gcash' ? 'GCash' : 'Card'}
                </button>
              ))}
            </div>
            <button onClick={doCheckout} className="btn-amber mt-3 w-full py-3 text-[15px]">
              Charge {peso(subtotal)} — {payMethod.toUpperCase()}
            </button>
            <p className="tnum mt-2 text-[12px] text-steel-500">
              Sale deducts stock and appears in Admin ledger. Same list, no re-typing.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
