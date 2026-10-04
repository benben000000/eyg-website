'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const POSClient = dynamic(() => import('@/components/POSClient').then((m) => m.POSClient), {
  ssr: false,
  loading: () => <POSSkeleton />,
});

function POSSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="skeleton h-9 w-56" />
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="skeleton h-11 w-full" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-20" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="skeleton h-72 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function POSPage() {
  return (
    <Suspense fallback={<POSSkeleton />}>
      <POSClient />
    </Suspense>
  );
}
