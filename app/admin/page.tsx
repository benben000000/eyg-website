'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AdminClient = dynamic(() => import('@/components/AdminClient').then((m) => m.AdminClient), {
  ssr: false,
  loading: () => <div className="mx-auto max-w-6xl px-4 py-6"><div className="skeleton h-9 w-56" /><div className="skeleton mt-4 h-64 w-full" /></div>,
});

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-6">Loading admin…</div>}>
      <AdminClient />
    </Suspense>
  );
}
