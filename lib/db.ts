import seed from '@/data/seed.json';
import type { SeedDB } from './types';

const KEY = 'eyg_db_v3';
const SESSION_USER = 'eyg_user_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function loadDB(): SeedDB {
  if (!isBrowser()) return deepClone(seed as unknown as SeedDB);
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = deepClone(seed as unknown as SeedDB);
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw) as SeedDB;
    if (parsed.version !== (seed as unknown as SeedDB).version) {
      const fresh = deepClone(seed as unknown as SeedDB);
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return parsed;
  } catch {
    return deepClone(seed as unknown as SeedDB);
  }
}

export function saveDB(db: SeedDB): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // storage full — ignore for demo
  }
}

export function resetDB(): SeedDB {
  const fresh = deepClone(seed as unknown as SeedDB);
  if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

export function getSessionUserId(): string | null {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(SESSION_USER);
}

export function setSessionUserId(id: string | null): void {
  if (!isBrowser()) return;
  if (id) window.sessionStorage.setItem(SESSION_USER, id);
  else window.sessionStorage.removeItem(SESSION_USER);
}
