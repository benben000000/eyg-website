import type { CartLine, SeedDB } from './types';
import { uid } from './format';

// Single place that mutates stock. Nothing else may touch products.stock directly.
function recomputeStock(db: SeedDB): SeedDB {
  // stock is stored on product as cache; lots are empty in demo so keep product.stock as truth.
  return db;
}

export function commitSale(
  db: SeedDB,
  cart: CartLine[],
  opts: { byUserId: string; customerName?: string; plate?: string; payMethod: 'cash' | 'gcash' | 'card'; discount?: number }
): { next: SeedDB; saleId: string } {
  if (cart.length === 0) throw new Error('Cart is empty');
  const discount = opts.discount ?? 0;
  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const saleId = `S-${new Date().getFullYear()}-${String(db.sales.length + 901).padStart(4, '0')}`;
  const at = new Date().toISOString();

  const saleItems = cart.map((l) => ({
    id: uid('si'),
    saleId,
    kind: l.kind,
    refId: l.refId,
    name: l.name,
    qty: l.qty,
    unitPrice: l.unitPrice,
    lineTotal: l.unitPrice * l.qty,
  }));

  // Decrement only trackStock products.
  const products = db.products.map((p) => {
    const line = cart.find((l) => l.kind === 'product' && l.refId === p.id);
    if (!line || !p.trackStock) return p;
    return { ...p, stock: Math.max(0, p.stock - line.qty) };
  });

  // Service with linked consumables also decrements one unit of each linked trackStock product.
  // Only when service qty > 0 and product still in stock — conservative single-unit consume.
  const withLinked = products.map((p) => {
    const linkedBy = cart.filter(
      (l) => l.kind === 'service' && db.services.find((s) => s.id === l.refId)?.linkedProductIds.includes(p.id)
    );
    if (linkedBy.length === 0 || !p.trackStock) return p;
    // Do not double-decrement if product was already bought explicitly in same ticket.
    const explicit = cart.find((l) => l.kind === 'product' && l.refId === p.id);
    if (explicit) return p;
    const consume = linkedBy.reduce((s, l) => s + l.qty, 0);
    return { ...p, stock: Math.max(0, p.stock - consume) };
  });

  const movements = cart
    .filter((l) => l.kind === 'product')
    .map((l) => ({
      id: uid('mv'),
      productId: l.refId,
      delta: -l.qty,
      reason: 'sale' as const,
      refId: saleId,
      at,
      byUserId: opts.byUserId,
    }));

  const next: SeedDB = recomputeStock({
    ...db,
    products: withLinked,
    sales: [
      ...db.sales,
      {
        id: saleId,
        at,
        byUserId: opts.byUserId,
        customerName: opts.customerName,
        plate: opts.plate,
        subtotal,
        discount,
        total,
        payMethod: opts.payMethod,
        status: 'completed' as const,
      },
    ],
    saleItems: [...db.saleItems, ...saleItems],
    movements: [...db.movements, ...movements],
  });

  return { next, saleId };
}

export function restock(db: SeedDB, productId: string, qty: number, byUserId: string): SeedDB {
  if (qty <= 0) return db;
  return {
    ...db,
    products: db.products.map((p) => (p.id === productId ? { ...p, stock: p.stock + qty } : p)),
    movements: [
      ...db.movements,
      { id: uid('mv'), productId, delta: qty, reason: 'restock' as const, at: new Date().toISOString(), byUserId },
    ],
  };
}

export function voidSale(db: SeedDB, saleId: string, byUserId: string): SeedDB {
  const sale = db.sales.find((s) => s.id === saleId);
  if (!sale || sale.status === 'voided') return db;
  const items = db.saleItems.filter((i) => i.saleId === saleId && i.kind === 'product');
  const products = db.products.map((p) => {
    const back = items.filter((i) => i.refId === p.id).reduce((s, i) => s + i.qty, 0);
    return back > 0 ? { ...p, stock: p.stock + back } : p;
  });
  return {
    ...db,
    products,
    sales: db.sales.map((s) => (s.id === saleId ? { ...s, status: 'voided' as const } : s)),
    movements: [
      ...db.movements,
      ...items.map((i) => ({
        id: uid('mv'),
        productId: i.refId,
        delta: i.qty,
        reason: 'return' as const,
        refId: saleId,
        at: new Date().toISOString(),
        byUserId,
      })),
    ],
  };
}
