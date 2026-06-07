'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { isUnlocked, checkLicense, unlock } from '@/lib/license';

interface Props {
  children: React.ReactNode;
}

// Auto-insert dashes in groups of 5: XXXXX-XXXXX-XXXXX-XXXXX
function formatCode(raw: string): string {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 20);
  return clean.match(/.{1,5}/g)?.join('-') ?? clean;
}

export default function LicenseGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [code, setCode]         = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUnlocked(isUnlocked());
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(formatCode(e.target.value));
    setError(null);
  }

  function handleActivate() {
    if (checkLicense(code)) {
      unlock();
      setSuccess(true);
      setTimeout(() => setUnlocked(true), 800);
    } else {
      setError('کد وارد شده معتبر نیست.');
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  const codeLength = code.replace(/-/g, '').length;
  const isReady    = codeLength >= 20;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      dir="rtl"
      style={{
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #dbeafe 0%, #f1f5f9 55%, #f8fafc 100%)',
      }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-sm flex flex-col items-center gap-7 rounded-2xl px-8 py-10"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 48px 0 rgba(25,118,210,0.13), 0 1px 4px 0 rgba(0,0,0,0.07)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-10 right-10 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #1976d2 40%, #1976d2 60%, transparent)' }}
        />

        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{ width: 68, height: 68, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', boxShadow: '0 4px 18px rgba(25,118,210,0.35)' }}
          >
            <FileText size={30} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: '#0d2444' }}>نامه‌ساز اختصاصی</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Letter Builder</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ backgroundColor: '#f1f5f9' }} />

        {/* Input group */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
            کد لایسنس ۲۰ رقمی خود را وارد کنید
          </p>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleInput}
              onKeyDown={(e) => e.key === 'Enter' && isReady && !success && handleActivate()}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
              maxLength={23}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              dir="ltr"
              className="w-full rounded-xl px-4 py-3 text-center font-mono text-sm tracking-widest outline-none transition-all"
              style={{
                border: error
                  ? '1.5px solid #ef4444'
                  : success
                  ? '1.5px solid #22c55e'
                  : '1.5px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                color: '#111827',
                letterSpacing: '0.12em',
                boxShadow: error
                  ? '0 0 0 3px rgba(239,68,68,0.1)'
                  : success
                  ? '0 0 0 3px rgba(34,197,94,0.1)'
                  : undefined,
              }}
            />
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#ef4444' }}>
              <XCircle size={13} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={13} />
              <span>لایسنس با موفقیت فعال شد!</span>
            </div>
          )}

          {/* Activate button */}
          <button
            type="button"
            onClick={handleActivate}
            disabled={!isReady || success}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-all"
            style={{
              backgroundColor: isReady && !success ? '#1976d2' : '#bfdbfe',
              color: isReady && !success ? '#ffffff' : '#93c5fd',
              cursor: isReady && !success ? 'pointer' : 'not-allowed',
              boxShadow: isReady && !success ? '0 2px 12px rgba(25,118,210,0.3)' : 'none',
            }}
          >
            {success ? 'در حال ورود...' : 'فعال‌سازی'}
            {!success && <ArrowLeft size={15} />}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs" style={{ color: '#d1d5db' }}>
          github.com/Alirewa
        </p>
      </div>
    </div>
  );
}
