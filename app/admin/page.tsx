'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    import('decap-cms-app').then(({ default: CMS }) => {
      CMS.init();
    });
  }, []);

  return <div id="nc-root" />;
}