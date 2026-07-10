'use client';

import dynamic from 'next/dynamic';

const CMS = dynamic(
  () => import('decap-cms-app').then((mod) => {
    // Import config
    import('../../public/admin/config.yml');
    return mod.default;
  }),
  { ssr: false }
);

export default function AdminPage() {
  return <CMS />;
}