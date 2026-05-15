// Pure presentational — no store, no Tailwind classes.
// ALL styles are inline so html2canvas captures them in the off-screen clone.

import React from 'react';
import type { LetterState } from '@/types/letter';
import { getContrastColor, parseBodyText } from '@/lib/utils';

interface LetterDocumentProps {
  letter: LetterState;
}

const UI_FONT  = "'B Nazanin', 'Vazirmatn', 'Tahoma', serif";

export default function LetterDocument({ letter }: LetterDocumentProps) {
  const accent   = letter.headerBgColor;
  const contrast = getContrastColor(accent);
  const dir      = letter.letterDirection ?? 'rtl';
  const isLTR    = dir === 'ltr';

  const bodyFont = letter.bodyFontFamily
    ? `'${letter.bodyFontFamily}', 'B Nazanin', 'Vazirmatn', 'Tahoma', serif`
    : UI_FONT;
  const bodySize   = letter.bodyFontSize   ?? 14;
  const bodyLH     = letter.bodyLineHeight ?? 2.2;

  const enabledSigs = letter.signatures.filter((s) => s.enabled);

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
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  HEADER — Modern two-strip design, logo directly on white         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <header style={{ fontFamily: UI_FONT, position: 'relative' }}>

        {/* ── Top accent strip ─────────────────────────────────────────── */}
        <div style={{ height: 6, backgroundColor: accent }} />

        {/* ── Main header row (white background) ───────────────────────── */}
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
          {/* RIGHT: Logo (direct on white, no card) + Brand Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flex: '0 0 auto',
              maxWidth: 220,
            }}
          >
            {letter.logoBase64 && (
              <img
                src={letter.logoBase64}
                alt="لوگو"
                style={{
                  width: 58,
                  height: 58,
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
            )}
            {letter.companyBrandName && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: accent,
                    lineHeight: 1.5,
                    fontFamily: UI_FONT,
                  }}
                >
                  {letter.companyBrandName}
                </span>
              </div>
            )}
          </div>

          {/* CENTER: بسمه تعالی */}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: UI_FONT,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1a1a1a',
                letterSpacing: 2,
                fontFamily: UI_FONT,
              }}
            >
              {letter.headerCenterText}
            </span>
          </div>

          {/* Date + Number in a subtle card */}
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isLTR ? 'flex-start' : 'flex-end',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: accent + '12', // very light tint
              border: `1px solid ${accent}30`,
              minWidth: 140,
            }}
          >
            {letter.letterDate && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  fontSize: 12,
                  fontFamily: UI_FONT,
                }}
              >
                <span style={{ color: '#6b7280' }}>تاریخ:</span>
                <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.letterDate}</span>
              </div>
            )}
            {letter.letterNumber && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  fontSize: 12,
                  fontFamily: UI_FONT,
                }}
              >
                <span style={{ color: '#6b7280' }}>شماره:</span>
                <span style={{ fontWeight: 'bold', color: '#111827', direction: 'ltr' }}>
                  {letter.letterNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom accent strip (slightly thicker, creates depth) ─────── */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${accent}44 0%, ${accent} 40%, ${accent} 60%, ${accent}44 100%)`,
          }}
        />

        {/* ── Thin separator line below the strip ──────────────────────── */}
        <div style={{ height: 1, backgroundColor: '#e5e7eb' }} />
      </header>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  BODY                                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <main
        style={{
          flex: 1,
          padding: '24px 40px 28px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: UI_FONT,
        }}
      >
        {/* Meta rows */}
        {(letter.fromCompany || letter.toRecipient || letter.subject) && (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                marginBottom: 14,
                fontSize: 14,
                fontFamily: UI_FONT,
              }}
            >
              {letter.fromCompany && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>از طرف:</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.fromCompany}</span>
                </div>
              )}
              {letter.toRecipient && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>خطاب به:</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.toRecipient}</span>
                </div>
              )}
              {letter.subject && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#6b7280', minWidth: 72, flexShrink: 0 }}>موضوع:</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{letter.subject}</span>
                </div>
              )}
            </div>
            <div style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 18 }} />
          </>
        )}

        {/* Body text */}
        <div
          style={{
            fontSize: bodySize,
            lineHeight: bodyLH,
            color: '#1f2937',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'justify',
            fontFamily: bodyFont,
            direction: dir,
          }}
        >
          {letter.bodyText
            ? parseBodyText(letter.bodyText).map((seg, i) =>
                seg.bold
                  ? <strong key={i} style={{ fontWeight: 'bold' }}>{seg.text}</strong>
                  : <React.Fragment key={i}>{seg.text}</React.Fragment>
              )
            : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>متن نامه...</span>
          }
        </div>

        {/* Signatures — directly below body text, left side (RTL flex-end) */}
        {enabledSigs.length > 0 && (
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 52,
              fontFamily: UI_FONT,
            }}
          >
            {enabledSigs.map((sig) => (
              <div
                key={sig.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 40,
                  fontFamily: UI_FONT,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#374151', fontFamily: UI_FONT }}>
                  {sig.label}
                </span>
                <div style={{ width: 110, height: 1, backgroundColor: '#9ca3af' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/*  FOOTER                                                           */}
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
              <span style={{ opacity: 0.75 }}>آدرس:</span>
              <span>{letter.companyAddress}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {letter.companyPhone && (
            <>
              <span style={{ opacity: 0.75 }}>تلفن:</span>
              <span style={{ direction: 'ltr' }}>{letter.companyPhone}</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
