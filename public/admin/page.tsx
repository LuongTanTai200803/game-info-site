'use client';

import dynamic from 'next/dynamic';

const CMS = dynamic(
  () => import('decap-cms-app').then((mod) => mod.default),
  { ssr: false }
);

export default function AdminPage() {
  return <CMS />;
}