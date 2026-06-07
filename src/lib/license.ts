// Static license system — client-side only.
// The valid code is intentionally stored here; this is a soft lock.

const LICENSE_KEY = 'letter-saz-license-v1';
const VALID_CODE  = 'OPENDEMO2026LTRBLDR0'; // 20 chars (strip dashes before compare)

export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LICENSE_KEY) === 'unlocked';
}

export function checkLicense(input: string): boolean {
  const clean = input.replace(/[-\s]/g, '').toUpperCase();
  return clean === VALID_CODE;
}

export function unlock(): void {
  localStorage.setItem(LICENSE_KEY, 'unlocked');
}
