export interface SignatureBlock {
  id: string;
  label: string;
  enabled: boolean;
}

export interface LetterTemplate {
  id: string;
  name: string;
  savedAt: number;
  state: LetterState;
}

export type LetterDirection = 'rtl' | 'ltr';

export interface LetterState {
  // Direction (RTL = Persian/Arabic, LTR = English)
  letterDirection: LetterDirection;

  // Header
  logoBase64: string | null;
  companyBrandName: string;
  headerCenterText: string;
  letterDate: string;
  letterNumber: string;
  headerBgColor: string;

  // Body
  fromCompany: string;
  toRecipient: string;
  subject: string;
  bodyText: string;          // supports **word** for inline bold

  // Body typography controls
  bodyFontFamily: string;    // e.g. 'B Nazanin'
  bodyFontSize: number;      // px, e.g. 14
  bodyLineHeight: number;    // e.g. 2.2

  // Signatures
  signatures: SignatureBlock[];

  // Footer
  companyAddress: string;
  companyPhone: string;
}

export const LS_TEMPLATES_KEY = 'letter-saz-templates-v1';
export const LS_LIVE_KEY      = 'letter-saz-live-v1';

// One signature by default — user edits its label directly
export const DEFAULT_SIGNATURES: SignatureBlock[] = [
  { id: 'sig-1', label: 'امضا مدیرعامل', enabled: true },
];

export const BODY_FONT_OPTIONS = [
  { label: 'B Nazanin', value: 'B Nazanin' },
  { label: 'Vazirmatn', value: 'Vazirmatn' },
  { label: 'Tahoma',    value: 'Tahoma'    },
  { label: 'Arial',     value: 'Arial'     },
];

export const LINE_HEIGHT_PRESETS = [
  { label: 'فشرده',    value: 1.6 },
  { label: 'معمولی',   value: 2.0 },
  { label: 'پیش‌فرض',  value: 2.2 },
  { label: 'گسترده',   value: 2.6 },
];

export const DEFAULT_LETTER_STATE: LetterState = {
  letterDirection: 'rtl',
  logoBase64: null,
  companyBrandName: '',
  headerCenterText: 'بسمه تعالی',
  letterDate: '',
  letterNumber: '',
  headerBgColor: '#1976d2',
  fromCompany: '',
  toRecipient: '',
  subject: '',
  bodyText: '',
  bodyFontFamily: 'B Nazanin',
  bodyFontSize: 14,
  bodyLineHeight: 2.2,
  signatures: DEFAULT_SIGNATURES,
  companyAddress: '',
  companyPhone: '',
};
