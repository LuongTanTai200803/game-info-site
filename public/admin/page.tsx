'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [CMS, setCMS] = useState<any>(null);

  useEffect(() => {
    import('decap-cms-app').then((mod) => {
      setCMS(() => mod.default);
    });
  }, []);

  if (!CMS) {
    return <div className="p-8 text-center">Đang tải CMS...</div>;
  }

  return <CMS />;
}