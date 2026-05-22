'use client';

import { useState, useEffect, useRef } from 'react';
import { KeyRound, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { isUnlocked, checkLicense, unlock } from '@/lib/license';

interface Props {
  children: React.ReactNode;
}

// Auto-insert dashes: XXXX-XXXX-XXXX-XXXX-XXXX (total 24 chars with dashes, 20 real)
function formatCode(raw: string): string {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 20);
  return clean.match(/.{1,4}/g)?.join('-') ?? clean;
}

export default function LicenseGate({ children }: Props) {
  const [unlocked, setUnlocked]   = useState<boolean | null>(null); // null = checking
  const [code, setCode]           = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);

  // Check on mount (client only)
  useEffect(() => {
    setUnlocked(isUnlocked());
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
    setError(null);
  }

  function handleActivate() {
    if (checkLicense(code)) {
      unlock();
      setSuccess(true);
      setTimeout(() => setUnlocked(true), 900);
    } else {
      setError('کد لایسنس نادرست است. لطفاً دوباره بررسی کنید.');
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleActivate();
  }

  // Still checking localStorage
  if (unlocked === null) return null;

  // Already unlocked — render app
  if (unlocked) return <>{children}</>;

  // ── License screen ──────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4"
      dir="rtl"
    >
      <div
        className="card w-full max-w-md p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{ borderTop: '4px solid #1976d2' }}
      >
        {/* Logo placeholder / brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#1976d2' }}
          >
            <KeyRound size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>نامه‌ساز اختصاصی</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>گروه بیم فا</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          برای استفاده از نرم‌افزار، کد لایسنس ۲۰ رقمی خود را وارد کنید.
        </p>

        {/* Input */}
        <div className="w-full space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
            maxLength={24}
            autoFocus
            className="input w-full text-center tracking-widest font-mono text-base"
            dir="ltr"
            style={{
              letterSpacing: '0.15em',
              borderColor: error ? '#ef4444' : undefined,
            }}
          />

          {/* Error / success */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500">
              <XCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 size={14} />
              <span>لایسنس با موفقیت فعال شد!</span>
            </div>
          )}

          {/* Activate button */}
          <button
            type="button"
            onClick={handleActivate}
            disabled={code.replace(/-/g, '').length < 20 || success}
            className="btn-primary w-full py-2.5 text-sm font-semibold justify-center"
            style={{ backgroundColor: '#1976d2', borderColor: '#1976d2' }}
          >
            {success ? 'در حال ورود...' : 'فعال‌سازی لایسنس'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          <a
            href="https://bimfaa.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: '#1976d2' }}
          >
            bimfaa.ir
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
