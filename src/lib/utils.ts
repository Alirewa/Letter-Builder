import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── File → base64 data-URL ────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Image file validation ─────────────────────────────────────────────────────
export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!ALLOWED.includes(file.type)) {
    return 'فقط فرمت‌های JPG، PNG، WebP و SVG پشتیبانی می‌شوند.';
  }
  if (file.size > MAX_SIZE) {
    return 'حجم فایل نباید بیشتر از ۲ مگابایت باشد.';
  }
  return null;
}

// ── Date helpers ──────────────────────────────────────────────────────────────
export function getTodayJalali(): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

// ── Auto letter number ────────────────────────────────────────────────────────
export function generateLetterNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const r = String(Math.floor(Math.random() * 9000) + 1000);
  return `LTR-${y}${m}${d}-${r}`;
}

// ── Contrast color for readable text on colored backgrounds ──────────────────
export function getContrastColor(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived luminance (ITU-R BT.601)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff';
}

// ── Deep clone (template snapshots) ──────────────────────────────────────────
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// ── Render **bold** markdown in body text ─────────────────────────────────────
// Returns an array of React nodes. Import React in the caller.
export function parseBodyText(text: string): Array<{ bold: boolean; text: string }> {
  const segments: Array<{ bold: boolean; text: string }> = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      segments.push({ bold: true,  text: part.slice(2, -2) });
    } else {
      segments.push({ bold: false, text: part });
    }
  }
  return segments;
}

// ── JSON export helpers ───────────────────────────────────────────────────────
export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readJSONFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { resolve(JSON.parse(reader.result as string)); }
      catch { reject(new Error('فایل JSON معتبر نیست.')); }
    };
    reader.onerror = reject;
    reader.readAsText(file, 'utf-8');
  });
}
