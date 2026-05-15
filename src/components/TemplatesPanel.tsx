'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Save, FolderOpen, Trash2, Clock, CheckCircle, Upload, Download as DownloadIcon } from 'lucide-react';
import { useLetterStore } from '@/store/letterStore';
import type { LetterState, LetterTemplate } from '@/types/letter';
import { cn, downloadJSON, readJSONFile } from '@/lib/utils';

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return 'همین الان';
  if (mins < 60) return `${mins} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${days} روز پیش`;
}

export default function TemplatesPanel() {
  const { isTemplatesPanelOpen, toggleTemplatesPanel, saveTemplate, loadTemplate, deleteTemplate, listTemplates, updateLetter } =
    useLetterStore();

  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [saveName, setSaveName] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importOk, setImportOk]     = useState(false);
  const nameInputRef   = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTemplatesPanelOpen) {
      setTemplates(listTemplates());
      setTimeout(() => nameInputRef.current?.focus(), 150);
    }
  }, [isTemplatesPanelOpen, listTemplates]);

  function handleSave() {
    if (!saveName.trim()) return;
    saveTemplate(saveName.trim());
    setSaveName('');
    setSavedFeedback(true);
    setTemplates(listTemplates());
    setTimeout(() => setSavedFeedback(false), 2000);
  }

  function handleLoad(id: string) {
    loadTemplate(id);
    toggleTemplatesPanel();
  }

  function handleDelete(id: string) {
    deleteTemplate(id);
    setDeleteConfirm(null);
    setTemplates(listTemplates());
  }

  // ── JSON export: download current letter state ───────────────────────────
  function handleExportJSON() {
    const { letter } = useLetterStore.getState();
    downloadJSON(letter, `نامه-export-${Date.now()}.json`);
  }

  // ── JSON import: read file and load into live state ───────────────────────
  async function handleImportJSON(file: File) {
    setImportError(null);
    try {
      const parsed = await readJSONFile(file) as Partial<LetterState>;
      if (typeof parsed !== 'object' || parsed === null) throw new Error('ساختار نامعتبر');
      updateLetter(parsed);
      setImportOk(true);
      setTimeout(() => setImportOk(false), 2500);
      toggleTemplatesPanel();
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'خطا در خواندن فایل');
    }
  }

  if (!isTemplatesPanelOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={toggleTemplatesPanel} />

      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col"
        style={{ backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <FolderOpen size={18} className="text-blue-900" />
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>قالب‌های ذخیره‌شده</h2>
          </div>
          <button type="button" onClick={toggleTemplatesPanel} className="btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Save as template */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
          <label className="label">ذخیره وضعیت فعلی به عنوان قالب</label>
          <div className="flex gap-2">
            <input
              ref={nameInputRef}
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="نام قالب را وارد کنید..."
              className="input flex-1 text-sm"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!saveName.trim()}
              className={cn('btn-primary text-sm flex-shrink-0', savedFeedback && 'bg-green-600')}
            >
              {savedFeedback ? <CheckCircle size={15} /> : <Save size={15} />}
              {savedFeedback ? 'ذخیره شد' : 'ذخیره'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <FolderOpen size={36} style={{ color: 'var(--border)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>هنوز قالبی ذخیره نشده</p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} className="card p-3">
                  {deleteConfirm === t.id ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-red-500 font-semibold">حذف شود؟</span>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs py-1 px-2">خیر</button>
                        <button type="button" onClick={() => handleDelete(t.id)}
                          className="text-xs py-1 px-2 rounded-lg text-red-500 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          بله، حذف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{t.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{relativeTime(t.savedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button type="button" onClick={() => handleLoad(t.id)} className="btn-secondary text-xs py-1 px-2.5">بارگذاری</button>
                        <button type="button" onClick={() => setDeleteConfirm(t.id)} className="btn-danger p-1.5" title="حذف">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── JSON import / export ─────────────────────────────────── */}
        <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>درون‌ریزی / برون‌بری JSON</p>
          <div className="flex gap-2">
            {/* Export */}
            <button type="button" onClick={handleExportJSON}
              className="btn-ghost text-xs flex-1 py-1.5 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
              <DownloadIcon size={13} />
              برون‌بری
            </button>
            {/* Import */}
            <button type="button" onClick={() => importInputRef.current?.click()}
              className={cn(
                'btn-ghost text-xs flex-1 py-1.5 border border-dashed rounded-lg',
                importOk
                  ? 'border-green-400 text-green-600'
                  : 'border-gray-300 dark:border-slate-600'
              )}>
              {importOk ? <CheckCircle size={13} /> : <Upload size={13} />}
              {importOk ? 'بارگذاری شد' : 'درون‌ریزی'}
            </button>
            <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleImportJSON(e.target.files[0]); e.target.value = ''; }} />
          </div>
          {importError && <p className="text-xs text-red-500 mt-1">{importError}</p>}
        </div>

        {templates.length > 0 && (
          <div className="px-5 py-2 text-xs text-center" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {templates.length} قالب ذخیره‌شده
          </div>
        )}
      </div>
    </>
  );
}
