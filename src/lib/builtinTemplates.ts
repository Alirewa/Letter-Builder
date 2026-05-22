// Built-in letter templates — seeded into localStorage on first run.
// These IDs are stable so they can be detected/refreshed safely.

import type { LetterTemplate, LetterState } from '@/types/letter';

export const BUILTIN_IDS = {
  bimfa:  'builtin-bimfa-v1',
  formal: 'builtin-formal-v1',
} as const;

// ── قالب بیم فا ───────────────────────────────────────────────────────────────
const BIMFA_STATE: LetterState = {
  letterDirection: 'rtl',
  logoBase64: null,               // filled at runtime from /bimfa-logo.png
  companyBrandName: 'گروه بیم فا',
  headerCenterText: 'بسمه تعالی',
  letterDate: '',
  letterNumber: '',
  headerBgColor: '#1976d2',
  fromCompany: 'گروه بیم فا',
  toRecipient: '',
  subject: '',
  bodyText: '',
  bodyFontFamily: 'B Nazanin',
  bodyFontSize: 14,
  bodyLineHeight: 2.2,
  signatures: [{ id: 'sig-bimfa-1', label: 'مدیرعامل', enabled: true }],
  companyAddress: 'کیش، گلدیس، خیابان وصال ۱، ساختمان اداری ایران، طبقه دوم، واحد ۱۳',
  companyPhone: '+989111454518',
};

// ── قالب رسمی ─────────────────────────────────────────────────────────────────
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
    id: BUILTIN_IDS.bimfa,
    name: 'قالب بیم فا',
    savedAt: 0,
    state: BIMFA_STATE,
  },
  {
    id: BUILTIN_IDS.formal,
    name: 'قالب رسمی ساده',
    savedAt: 0,
    state: FORMAL_STATE,
  },
];
