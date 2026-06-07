'use client';

import { useRef, useState } from 'react';
import {
  Building2, Palette, FileText, PenLine, MapPin,
  ImagePlus, Trash2, Check, Settings2,
} from 'lucide-react';
import { useLetterStore } from '@/store/letterStore';
import SectionCard from '@/components/ui/SectionCard';
import { fileToBase64, validateImageFile, cn } from '@/lib/utils';
import RichEditorDynamic from '@/components/RichEditorDynamic';
import DatePickerInput from '@/components/DatePickerInput';

const PRESET_COLORS = ['#1976d2', '#1e3a5f', '#0f4c75', '#6b2d5e', '#2d6a4f', '#b5451b', '#374151'];

export default function ControlPanel() {
  const letter = useLetterStore((s) => s.letter);
  const { updateLetter, updateSignature } = useLetterStore();

  const logoInputRef  = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError]       = useState<string | null>(null);
  const [logoDragging, setLogoDragging] = useState(false);

  // ── Logo handling ──────────────────────────────────────────────────────────
  async function handleLogoFile(file: File) {
    setLogoError(null);
    const err = validateImageFile(file);
    if (err) { setLogoError(err); return; }
    try {
      const base64 = await fileToBase64(file);
      updateLetter({ logoBase64: base64 });
    } catch { setLogoError('خطا در بارگذاری فایل.'); }
  }

  function handleLogoDrop(e: React.DragEvent) {
    e.preventDefault();
    setLogoDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoFile(file);
  }

  const sig0 = letter.signatures[0];

  return (
    <div className="p-4">

      {/* ── 0. تنظیمات نامه ─────────────────────────────────────────────── */}
      <SectionCard title="تنظیمات نامه" icon={<Settings2 size={16} />}>
        <div>
          <label className="label">جهت نامه</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const patch: Record<string, string> = { letterDirection: 'rtl' };
                if (letter.headerCenterText === 'Letter') patch.headerCenterText = 'بسمه تعالی';
                updateLetter(patch);
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                letter.letterDirection !== 'ltr'
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-900'
              )}
              style={{ color: letter.letterDirection !== 'ltr' ? '#fff' : 'var(--text)' }}
            >
              <span>فارسی</span>
              <span className="opacity-75 text-xs">RTL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const patch: Record<string, string> = { letterDirection: 'ltr' };
                if (letter.headerCenterText === 'بسمه تعالی') patch.headerCenterText = 'Letter';
                updateLetter(patch);
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                letter.letterDirection === 'ltr'
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-900'
              )}
              style={{ color: letter.letterDirection === 'ltr' ? '#fff' : 'var(--text)' }}
            >
              <span>English</span>
              <span className="opacity-75 text-xs">LTR</span>
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── 1. سربرگ ────────────────────────────────────────────────────── */}
      <SectionCard title="سربرگ (هدر)" icon={<Building2 size={16} />}>
        {/* Logo upload */}
        <div className="mb-4">
          <label className="label">لوگوی شرکت</label>
          {letter.logoBase64 ? (
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800">
              <img src={letter.logoBase64} alt="لوگو" className="w-12 h-12 object-contain rounded" />
              <p className="text-xs flex-1" style={{ color: 'var(--text-muted)' }}>لوگو بارگذاری شد</p>
              <button type="button" onClick={() => updateLetter({ logoBase64: null })} className="btn-danger p-1.5"><Trash2 size={14} /></button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
              onDragLeave={() => setLogoDragging(false)}
              onDrop={handleLogoDrop}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                logoDragging
                  ? 'border-blue-900 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-slate-600 hover:border-blue-900 hover:bg-gray-50 dark:hover:bg-slate-800'
              )}
            >
              <ImagePlus size={22} className="text-gray-400" />
              <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                کلیک کنید یا فایل را رها کنید
                <br /><span className="opacity-60">(JPG، PNG، WebP، SVG — حداکثر ۲ مگابایت)</span>
              </span>
            </div>
          )}
          <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleLogoFile(e.target.files[0]); }} />
          {logoError && <p className="text-xs text-red-500 mt-1">{logoError}</p>}
        </div>

        <div className="mb-3">
          <label className="label">نام برند / شرکت</label>
          <input type="text" value={letter.companyBrandName} onChange={(e) => updateLetter({ companyBrandName: e.target.value })}
            placeholder="شرکت فناوری اطلاعات نوین" className="input" />
        </div>
        <div className="mb-3">
          <label className="label">متن مرکزی سربرگ</label>
          <input type="text" value={letter.headerCenterText} onChange={(e) => updateLetter({ headerCenterText: e.target.value })}
            placeholder="بسمه تعالی" className="input" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Date picker */}
          <div>
            <label className="label">تاریخ نامه</label>
            <DatePickerInput
              value={letter.letterDate}
              onChange={(val) => updateLetter({ letterDate: val })}
            />
          </div>
          <div>
            <label className="label">شماره نامه</label>
            <input type="text" value={letter.letterNumber} onChange={(e) => updateLetter({ letterNumber: e.target.value })}
              placeholder="1405/آ/01" className="input text-left" dir="ltr" />
          </div>
        </div>
      </SectionCard>

      {/* ── 2. رنگ سربرگ ────────────────────────────────────────────────── */}
      <SectionCard title="رنگ سربرگ و پاورقی" icon={<Palette size={16} />}>
        <label className="label">رنگ اصلی</label>
        <div className="flex items-center gap-3 mb-3">
          <input type="color" value={letter.headerBgColor}
            onChange={(e) => updateLetter({ headerBgColor: e.target.value })}
            className="w-12 h-10 rounded-lg border border-gray-200 dark:border-slate-600 cursor-pointer p-0.5 bg-transparent" />
          <div className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center px-3"
            style={{ backgroundColor: letter.headerBgColor + '22' }}>
            <span className="text-sm font-mono" style={{ color: 'var(--text)' }}>{letter.headerBgColor}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button key={color} type="button" onClick={() => updateLetter({ headerBgColor: color })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color, borderColor: letter.headerBgColor === color ? '#fff' : 'transparent',
                outline: letter.headerBgColor === color ? `2px solid ${color}` : 'none', outlineOffset: 2 }}>
              {letter.headerBgColor === color && <Check size={12} color="#fff" />}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── 3. متن نامه ─────────────────────────────────────────────────── */}
      <SectionCard title="متن نامه" icon={<FileText size={16} />}>
        <div className="space-y-3">
          <div>
            <label className="label">از طرف (فرستنده)</label>
            <input type="text" value={letter.fromCompany} onChange={(e) => updateLetter({ fromCompany: e.target.value })}
              placeholder="نام شرکت یا سازمان" className="input" />
          </div>
          <div>
            <label className="label">خطاب به (گیرنده)</label>
            <input type="text" value={letter.toRecipient} onChange={(e) => updateLetter({ toRecipient: e.target.value })}
              placeholder="مدیرعامل محترم شرکت ..." className="input" />
          </div>
          <div>
            <label className="label">موضوع نامه</label>
            <input type="text" value={letter.subject} onChange={(e) => updateLetter({ subject: e.target.value })}
              placeholder="موضوع نامه را وارد کنید" className="input" />
          </div>

          {/* Rich text editor */}
          <RichEditorDynamic
            value={letter.bodyText}
            onChange={(html) => updateLetter({ bodyText: html })}
            fontFamily={letter.bodyFontFamily ?? 'B Nazanin'}
            fontSize={letter.bodyFontSize ?? 14}
            lineHeight={letter.bodyLineHeight ?? 2.2}
            direction={letter.letterDirection ?? 'rtl'}
            placeholder={letter.letterDirection === 'ltr' ? 'Write the letter body here...' : 'متن کامل نامه را اینجا بنویسید...'}
          />
        </div>
      </SectionCard>

      {/* ── 4. امضا ─────────────────────────────────────────────────────── */}
      <SectionCard title="امضا" icon={<PenLine size={16} />}>
        {sig0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateSignature(sig0.id, { enabled: !sig0.enabled })}
              className={cn(
                'flex-shrink-0 w-9 h-5 rounded-full transition-colors relative',
                sig0.enabled ? 'bg-blue-900' : 'bg-gray-300 dark:bg-slate-600'
              )}
              title={sig0.enabled ? 'غیرفعال کردن امضا' : 'فعال کردن امضا'}
            >
              <span className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
                sig0.enabled ? 'right-0.5' : 'left-0.5'
              )} />
            </button>
            <input
              type="text"
              value={sig0.label}
              onChange={(e) => updateSignature(sig0.id, { label: e.target.value })}
              disabled={!sig0.enabled}
              placeholder="عنوان امضا"
              className={cn('input flex-1', !sig0.enabled && 'opacity-40')}
            />
          </div>
        )}
      </SectionCard>

      {/* ── 5. پاورقی ───────────────────────────────────────────────────── */}
      <SectionCard title="پاورقی" icon={<MapPin size={16} />}>
        <div className="space-y-3">
          <div>
            <label className="label">آدرس شرکت</label>
            <input type="text" value={letter.companyAddress} onChange={(e) => updateLetter({ companyAddress: e.target.value })}
              placeholder="تهران، خیابان ..." className="input" />
          </div>
          <div>
            <label className="label">شماره تلفن</label>
            <input type="text" value={letter.companyPhone} onChange={(e) => updateLetter({ companyPhone: e.target.value })}
              placeholder="09123456789" className="input" dir="ltr" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
