'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadDB, saveDB, resetDB, getSessionUserId, setSessionUserId } from './db';
import { commitSale as commitSaleCore, restock as restockCore, voidSale as voidSaleCore } from './inventory';
import type { CartLine, SeedDB, User } from './types';

interface StoreCtx {
  db: SeedDB;
  user: User | null;
  cart: CartLine[];
  login: (pin: string) => User | null;
  logout: () => void;
  addToCart: (line: CartLine) => void;
  setQty: (refId: string, kind: string, qty: number) => void;
  clearCart: () => void;
  checkout: (info: { customerName?: string; plate?: string; payMethod: 'cash' | 'gcash' | 'card'; discount?: number }) => string;
  restock: (productId: string, qty: number) => void;
  voidSale: (saleId: string) => void;
  updateProduct: (id: string, patch: Partial<SeedDB['products'][number]>) => void;
  addProduct: (p: SeedDB['products'][number]) => void;
  updateService: (id: string, patch: Partial<SeedDB['services'][number]>) => void;
  updateSiteBlock: (id: string, data: Record<string, string>) => void;
  doReset: () => void;
  refresh: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SeedDB>(() => loadDB());
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const saveT = useRef<number | null>(null);

  useEffect(() => {
    setUserId(getSessionUserId());
    try {
      const c = sessionStorage.getItem('eyg_cart_v1');
      if (c) setCart(JSON.parse(c));
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((next: SeedDB) => {
    setDb(next);
    if (saveT.current) window.clearTimeout(saveT.current);
    saveT.current = window.setTimeout(() => saveDB(next), 250);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('eyg_cart_v1', JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart]);

  const user = useMemo(() => db.users.find((u) => u.id === userId && u.active) ?? null, [db, userId]);

  const login = useCallback(
    (pin: string) => {
      const found = db.users.find((u) => u.pin === pin && u.active) ?? null;
      setUserId(found ? found.id : null);
      setSessionUserId(found ? found.id : null);
      return found;
    },
    [db]
  );

  const logout = useCallback(() => {
    setUserId(null);
    setSessionUserId(null);
  }, []);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.refId === line.refId && l.kind === line.kind);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + line.qty };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const setQty = useCallback((refId: string, kind: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.refId === refId && l.kind === kind))
        : prev.map((l) => (l.refId === refId && l.kind === kind ? { ...l, qty } : l))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback(
    (info: { customerName?: string; plate?: string; payMethod: 'cash' | 'gcash' | 'card'; discount?: number }) => {
      const actor = user?.id ?? 'u-staff';
      const { next, saleId } = commitSaleCore(db, cart, {
        byUserId: actor,
        customerName: info.customerName,
        plate: info.plate?.toUpperCase(),
        payMethod: info.payMethod,
        discount: info.discount ?? 0,
      });
      persist(next);
      setCart([]);
      return saleId;
    },
    [db, cart, persist, user]
  );

  const restock = useCallback(
    (productId: string, qty: number) => {
      if (user && user.role !== 'admin') return;
      persist(restockCore(db, productId, qty, user?.id ?? 'u-admin'));
    },
    [db, persist, user]
  );

  const voidSale = useCallback(
    (saleId: string) => {
      if (user && user.role !== 'admin') return;
      persist(voidSaleCore(db, saleId, user?.id ?? 'u-admin'));
    },
    [db, persist, user]
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<SeedDB['products'][number]>) => {
      const next: SeedDB = {
        ...db,
        products: db.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      };
      persist(next);
    },
    [db, persist]
  );

  const addProduct = useCallback(
    (p: SeedDB['products'][number]) => {
      persist({ ...db, products: [...db.products, p] });
    },
    [db, persist]
  );

  const updateService = useCallback(
    (id: string, patch: Partial<SeedDB['services'][number]>) => {
      const next: SeedDB = {
        ...db,
        services: db.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      };
      persist(next);
    },
    [db, persist]
  );

  const updateSiteBlock = useCallback(
    (id: string, data: Record<string, string>) => {
      const next: SeedDB = {
        ...db,
        siteBlocks: db.siteBlocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)),
      };
      persist(next);
    },
    [db, persist]
  );

  const doReset = useCallback(() => {
    setDb(resetDB());
    setCart([]);
  }, []);

  const refresh = useCallback(() => setDb(loadDB()), []);

  const value: StoreCtx = {
    db,
    user,
    cart,
    login,
    logout,
    addToCart,
    setQty,
    clearCart,
    checkout,
    restock,
    voidSale,
    updateProduct,
    addProduct,
    updateService,
    updateSiteBlock,
    doReset,
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside provider');
  return v;
}
