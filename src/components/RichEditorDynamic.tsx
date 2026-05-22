'use client';
// SSR-safe wrapper — TipTap must not run on the server.

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type RichEditorType from './RichEditor';

const RichEditor = dynamic(() => import('./RichEditor'), {
  ssr: false,
  loading: () => (
    <div
      className="border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center"
      style={{ minHeight: 180 }}
    >
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>در حال بارگذاری ویرایشگر...</span>
    </div>
  ),
});

export default RichEditor as React.ComponentType<ComponentProps<typeof RichEditorType>>;
