// Built-in letter templates — seeded into localStorage on first run.
// These IDs are stable so they can be detected/refreshed safely.

import type { LetterTemplate, LetterState } from '@/types/letter';

export const BUILTIN_IDS = {
  corporate: 'builtin-corporate-v1',
  formal:    'builtin-formal-v1',
} as const;

// ── Corporate (RTL / Persian) ─────────────────────────────────────────────────
const CORPORATE_STATE: LetterState = {
  letterDirection: 'rtl',
  logoBase64: null,
  companyBrandName: 'نام شرکت',
  headerCenterText: 'بسمه تعالی',
  letterDate: '',
  letterNumber: '',
  headerBgColor: '#1976d2',
  fromCompany: 'نام شرکت',
  toRecipient: '',
  subject: '',
  bodyText: '',
  bodyFontFamily: 'B Nazanin',
  bodyFontSize: 14,
  bodyLineHeight: 2.2,
  signatures: [{ id: 'sig-corp-1', label: 'مدیرعامل', enabled: true }],
  companyAddress: '',
  companyPhone: '',
};

// ── Formal (RTL / Persian) ────────────────────────────────────────────────────
const FORMAL_STATE: LetterState = {
  letterDirection: 'rtl',
  logoBase64: null,
  companyBrandName: '',
  headerCenterText: 'بسمه تعالی',
  letterDate: '',
  letterNumber: '',
  headerBgColor: '#1e3a5f',
  fromCompany: '',
  toRecipient: '',
  subject: '',
  bodyText: '',
  bodyFontFamily: 'B Nazanin',
  bodyFontSize: 14,
  bodyLineHeight: 2.2,
  signatures: [{ id: 'sig-formal-1', label: 'امضا مدیرعامل', enabled: true }],
  companyAddress: '',
  companyPhone: '',
};

export const BUILTIN_TEMPLATES: LetterTemplate[] = [
  {
    id: BUILTIN_IDS.corporate,
    name: 'قالب شرکتی',
    savedAt: 0,
    state: CORPORATE_STATE,
  },
  {
    id: BUILTIN_IDS.formal,
    name: 'قالب رسمی ساده',
    savedAt: 0,
    state: FORMAL_STATE,
  },
];
