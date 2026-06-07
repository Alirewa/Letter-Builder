// Built-in templates — kept empty for the public release.
// To add your own default templates, define LetterState objects here
// and push them into the BUILTIN_TEMPLATES array.

import type { LetterTemplate } from '@/types/letter';

export const BUILTIN_IDS = {
  corporate: 'builtin-corporate-v1',
  formal:    'builtin-formal-v1',
} as const;

// No pre-built templates — users start with a clean slate.
export const BUILTIN_TEMPLATES: LetterTemplate[] = [];
