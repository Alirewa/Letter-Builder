// Pure presentational — no store, no Tailwind classes.
// ALL styles are inline so html2canvas captures them in the off-screen clone.

import React from 'react';
import type { LetterState } from '@/types/letter';
import { getContrastColor } from '@/lib/utils';

interface LetterDocumentProps {
  letter: LetterState;
}

const UI_FONT = "'B Nazanin', 'Vazirmatn', 'Tahoma', serif";

// Label map — switches to English in LTR mode
function labels(isLTR: boolean) {
  return {
    from:    isLTR ? 'From:'    : 'از طرف:',
    to:      isLTR ? 'To:'      : 'خطاب به:',
    subject: isLTR ? 'Subject:' : 'موضوع:',
    date:    isLTR ? 'Date:'    : 'تاریخ:',
    number:  isLTR ? 'No.:'     : 'شماره:',
    address: isLTR ? 'Address:' : 'آدرس:',
    phone:   isLTR ? 'Phone:'   : 'تلفن:',
  };
}

export default function LetterDocument({ letter }: LetterDocumentProps) {
  const accent   = letter.headerBgColor;
  const contrast = getContrastColor(accent);
  const dir      = letter.letterDirection ?? 'rtl';
  const isLTR    = dir === 'ltr';
  const L        = labels(isLTR);

  const bodyFont = letter.bodyFontFamily
    ? `'${letter.bodyFontFamily}', 'B Nazanin', 'Vazirmatn', 'Tahoma', serif`
    : UI_FONT;
  const bodySize = letter.bodyFontSize   ?? 14;
  const bodyLH   = letter.bodyLineHeight ?? 2.2;

  const enabledSigs = letter.signatures.filter((s) => s.enabled);

  // Detect if bodyText is HTML (from TipTap) or legacy plain text
  const isHTML = letter.bodyText?.trimStart().startsWith('<');

  return (
    <div
      id="letter-print-root"
      style={{
        width: 794,
        minHeight: 1123,
        backgroundColor: '#ffffff',
        direction: dir,
        fontFamily: UI_FONT,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.13)',
        position: 'relative',
      }}
    >
      {/* Inline styles for rich content (tables, images, lists) captured by html2canvas */}
      <style>{`
        #letter-print-root table { border-collapse: collapse; width: 100%; margin: 8px 0; }
        #letter-print-root td, #letter-print-root th { border: 1px solid #cbd5e1; padding: 6px 10px; font-family: ${bodyFont}; font-size: ${bodySize}px; }
        #letter-print-root th { background-color: #f1f5f9; font-weight: bold; }
        #letter-print-root ul { padding-${isLTR ? 'left' : 'right'}: 1.5em; margin: 6px 0; }
        #letter-print-root ol { padding-${isLTR ? 'left' : 'right'}: 1.5em; margin: 6px 0; }
        #letter-print-root li { margin-bottom: 3px; }
        #letter-print-root img { max-width: 100%; height: auto; display: block; margin: 8px 0; }
        #letter-print-root h1 { font-size: 20px; font-weight: bold; margin: 10px 0 6px; }
        #letter-print-root h2 { font-size: 17px; font-weight: bold; margin: 8px 0 5px; }
        #letter-print-root blockquote { border-${isLTR ? 'left' : 'right'}: 3px solid #cbd5e1; padding-${isLTR ? 'left' : 'right'}: 12px; margin: 6px 0; color: #6b7280; }
        #letter-print-root p { margin: 0 0 4px; }
        #letter-print-root hr { border: none; border-top: 1px solid #e5e7eb; margin: 10px 0; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  HEADER                                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <header style={{ fontFamily: UI_FONT, position: 'relative' }}>

        {/* Top accent strip */}
        <div style={{ height: 6, backgroundColor: accent }} />

        {/* Main header row */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '18px 28px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo + Brand Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto', maxWidth: 220 }}>
            {letter.logoBase64 && (
              <img
                src={letter.logoBase64}
                alt="لوگو"
                style={{ width: 58, height: 58, objectFit: 'contain', display: 'block', flexShrink: 0 }}
              />
            )}
            {letter.companyBrandName && (
              <span style={{ fontSize: 15, fontWeight: 'bold', color: accent, lineHeight: 1.5, fontFamily: UI_FONT, direction: isLTR ? 'ltr' : 'rtl', unicodeBidi: 'embed' }}>
                {letter.companyBrandName}
              </span>
            )}
          </div>

          {/* Center text */}
          <div style={{ flex: 1, textAlign: 'center', fontFamily: UI_FONT }}>
            <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', letterSpacing: 2, fontFamily: UI_FONT }}>
              {letter.headerCenterText}
            </span>
          </div>

          {/* Date + Number card */}
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isLTR ? 'flex-start' : 'flex-end',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: accent + '12',
              border: `1px solid ${accent}30`,
              minWidth: 140,
            }}
          >
            {letter.letterDate && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontFamily: UI_FONT }}>
                <span style={{ color: '#6b7280' }}>{L.date}</span>
                <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.letterDate}</span>
              </div>
            )}
            {letter.letterNumber && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontFamily: UI_FONT }}>
                <span style={{ color: '#6b7280' }}>{L.number}</span>
                <span style={{ fontWeight: 'bold', color: '#111827', direction: 'ltr' }}>{letter.letterNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom accent strip */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}44 0%, ${accent} 40%, ${accent} 60%, ${accent}44 100%)` }} />
        <div style={{ height: 1, backgroundColor: '#e5e7eb' }} />
      </header>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  BODY                                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, padding: '24px 40px 28px', display: 'flex', flexDirection: 'column', fontFamily: UI_FONT }}>

        {/* Meta rows */}
        {(letter.fromCompany || letter.toRecipient || letter.subject) && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14, fontSize: 14, fontFamily: UI_FONT }}>
              {letter.fromCompany && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>{L.from}</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.fromCompany}</span>
                </div>
              )}
              {letter.toRecipient && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>{L.to}</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.toRecipient}</span>
                </div>
              )}
              {letter.subject && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>{L.subject}</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.subject}</span>
                </div>
              )}
            </div>
            <div style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 18 }} />
          </>
        )}

        {/* Body text — HTML (TipTap) or plain text fallback */}
        {isHTML ? (
          <div
            style={{ fontSize: bodySize, lineHeight: bodyLH, color: '#1f2937', fontFamily: bodyFont, direction: dir, wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: letter.bodyText }}
          />
        ) : (
          <div
            style={{ fontSize: bodySize, lineHeight: bodyLH, color: '#1f2937', whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'justify', fontFamily: bodyFont, direction: dir }}
          >
            {letter.bodyText
              ? letter.bodyText
              : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>متن نامه...</span>
            }
          </div>
        )}

        {/* Signatures */}
        {enabledSigs.length > 0 && (
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', gap: 52, fontFamily: UI_FONT }}>
            {enabledSigs.map((sig) => (
              <div key={sig.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, fontFamily: UI_FONT }}>
                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#374151', fontFamily: UI_FONT }}>{sig.label}</span>
                <div style={{ width: 110, height: 1, backgroundColor: '#9ca3af' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  FOOTER                                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          backgroundColor: accent,
          color: contrast,
          padding: '10px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          gap: 16,
          fontFamily: UI_FONT,
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {letter.companyAddress && (
            <>
              <span style={{ opacity: 0.75 }}>{L.address}</span>
              <span>{letter.companyAddress}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {letter.companyPhone && (
            <>
              <span style={{ opacity: 0.75 }}>{L.phone}</span>
              <span style={{ direction: 'ltr' }}>{letter.companyPhone}</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
