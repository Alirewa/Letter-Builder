'use client';

import { useState } from 'react';
import { Download, FolderOpen, RotateCcw, Loader2, FileText, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useLetterStore } from '@/store/letterStore';
import { exportLetterToPDF } from '@/lib/pdfExport';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function Navbar() {
  const { letter, toggleTemplatesPanel, resetLetter } = useLetterStore();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [exporting, setExporting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setExportError(null);
    try {
      await exportLetterToPDF(letter.letterNumber);
    } catch (e) {
      console.error(e);
      setExportError('خطا در PDF');
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <nav className="no-print flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-gray-900 dark:text-slate-100">نامه‌ساز</span>
            <span className="block text-xs text-gray-400 dark:text-slate-500 hidden sm:block">اپلای فا</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleDark}
            className="btn-ghost text-sm p-2"
            title={isDark ? 'حالت روشن' : 'حالت تاریک'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-0.5" />

          {/* Templates */}
          <button type="button" onClick={toggleTemplatesPanel} className="btn-ghost text-sm">
            <FolderOpen size={16} />
            <span className="hidden sm:inline">قالب‌ها</span>
          </button>

          {/* Reset */}
          <button type="button" onClick={() => setShowReset(true)} className="btn-ghost text-sm">
            <RotateCcw size={15} />
            <span className="hidden sm:inline">پاک کردن</span>
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-0.5" />

          {/* Export PDF */}
          <button type="button" onClick={handleExport} disabled={exporting} className="btn-primary text-sm">
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            <span className="hidden sm:inline">{exporting ? 'در حال تولید...' : 'دانلود PDF'}</span>
          </button>
        </div>
      </nav>

      {exportError && (
        <div className="no-print bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2 text-xs text-red-600 dark:text-red-400">
          {exportError}
        </div>
      )}

      {/* Reset confirmation modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>پاک کردن نامه</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  تمام اطلاعات وارد شده پاک خواهند شد. ادامه می‌دهید؟
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowReset(false)} className="btn-secondary text-sm">انصراف</button>
              <button
                type="button"
                onClick={() => { resetLetter(); setShowReset(false); }}
                className="btn-primary text-sm"
                style={{ backgroundColor: '#ef4444' }}
              >
                بله، پاک کن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
