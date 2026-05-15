'use client';

import { useState } from 'react';
import { Settings, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ControlPanel from '@/components/ControlPanel';
import LetterPreview from '@/components/LetterPreview';
import TemplatesPanel from '@/components/TemplatesPanel';
import { cn } from '@/lib/utils';

type ActiveTab = 'form' | 'preview';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      {/* Top navbar */}
      <Navbar />

      {/* Mobile tab bar — hidden on lg+ */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors border-b-2',
            activeTab === 'form'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          )}
        >
          <Settings size={15} />
          فرم
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors border-b-2',
            activeTab === 'preview'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          )}
        >
          <Eye size={15} />
          پیش‌نمایش
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">

        {/* RIGHT column (RTL): Control Panel */}
        <aside
          className={cn(
            'flex flex-col border-l border-gray-200 dark:border-slate-700 overflow-y-auto scrollbar-thin',
            'bg-gray-50 dark:bg-slate-900',
            'w-full lg:w-[420px] xl:w-[460px] flex-shrink-0',
            activeTab === 'form' ? 'flex' : 'hidden lg:flex'
          )}
        >
          <div className="flex-1">
            <ControlPanel />
          </div>

          {/* Copyright footer */}
          <footer className="no-print px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              نامه‌ساز اختصاصی
              <br />
              طراحی شده با ❤️ توسط{' '}
              <a
                href="https://github.com/Alirewa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
                style={{ color: 'var(--text)' }}
              >
                @alirewa
              </a>
            </p>
          </footer>
        </aside>

        {/* Vertical divider — desktop only */}
        <div className="hidden lg:block w-px bg-gray-200 dark:bg-slate-700 flex-shrink-0" />

        {/* LEFT column (RTL): Live A4 Preview */}
        <section
          className={cn(
            'flex-1 min-w-0 min-h-0 flex flex-col bg-slate-100 dark:bg-slate-800',
            activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
          )}
        >
          <LetterPreview />
        </section>
      </main>

      {/* Templates slide-in panel (overlay) */}
      <TemplatesPanel />
    </div>
  );
}
