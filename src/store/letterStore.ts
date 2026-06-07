import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_LETTER_STATE,
  DEFAULT_SIGNATURES,
  LS_LIVE_KEY,
  LS_TEMPLATES_KEY,
  type LetterState,
  type LetterTemplate,
  type SignatureBlock,
} from '@/types/letter';
import { deepClone, generateLetterNumber, getTodayJalali } from '@/lib/utils';
import { BUILTIN_TEMPLATES, BUILTIN_IDS } from '@/lib/builtinTemplates';

const LS_SEEDED_KEY = 'letter-saz-seeded-v2'; // v2: removes old built-in templates

interface LetterStore {
  letter: LetterState;
  isTemplatesPanelOpen: boolean;

  // Live state mutations
  updateLetter: (patch: Partial<LetterState>) => void;
  updateSignature: (id: string, patch: Partial<SignatureBlock>) => void;
  addSignature: () => void;
  removeSignature: (id: string) => void;
  resetLetter: () => void;
  initLetter: () => void;

  // UI
  toggleTemplatesPanel: () => void;

  // Template CRUD (direct localStorage — separate from Zustand persist)
  saveTemplate: (name: string) => void;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  listTemplates: () => LetterTemplate[];
}

// ── Helper: read templates array from localStorage ────────────────────────────
function readTemplates(): LetterTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LS_TEMPLATES_KEY) ?? '[]') as LetterTemplate[];
  } catch {
    return [];
  }
}

// ── Helper: write templates array to localStorage ─────────────────────────────
function writeTemplates(templates: LetterTemplate[]): void {
  localStorage.setItem(LS_TEMPLATES_KEY, JSON.stringify(templates));
}

export const useLetterStore = create<LetterStore>()(
  persist(
    (set, get) => ({
      letter: DEFAULT_LETTER_STATE,
      isTemplatesPanelOpen: false,

      // ── Live state mutations ──────────────────────────────────────────────
      updateLetter: (patch) =>
        set((s) => ({ letter: { ...s.letter, ...patch } })),

      updateSignature: (id, patch) =>
        set((s) => ({
          letter: {
            ...s.letter,
            signatures: s.letter.signatures.map((sig) =>
              sig.id === id ? { ...sig, ...patch } : sig
            ),
          },
        })),

      addSignature: () =>
        set((s) => ({
          letter: {
            ...s.letter,
            signatures: [
              ...s.letter.signatures,
              { id: crypto.randomUUID(), label: 'امضا', enabled: true },
            ],
          },
        })),

      removeSignature: (id) =>
        set((s) => ({
          letter: {
            ...s.letter,
            signatures: s.letter.signatures.filter((sig) => sig.id !== id),
          },
        })),

      resetLetter: () =>
        set({
          letter: {
            ...deepClone(DEFAULT_LETTER_STATE),
            signatures: deepClone(DEFAULT_SIGNATURES),
            letterDate: getTodayJalali(),
            letterNumber: generateLetterNumber(),
          },
        }),

      // Called by StoreHydrator after rehydrate() — fills date/number and
      // backfills any fields added after the user's stored state was saved.
      initLetter: () => {
        const current = get().letter;
        const patch: Partial<LetterState> = {};
        if (!current.letterDate)    patch.letterDate    = getTodayJalali();
        if (!current.letterNumber)  patch.letterNumber  = generateLetterNumber();
        // Backfill typography fields added in a later version
        if (!current.bodyFontFamily)   patch.bodyFontFamily   = 'B Nazanin';
        if (!current.bodyFontSize)     patch.bodyFontSize     = 14;
        if (!current.bodyLineHeight)   patch.bodyLineHeight   = 2.2;
        // Backfill direction field
        if (!current.letterDirection)  patch.letterDirection  = 'rtl';
        // Ensure signatures array always has at least one entry
        if (!current.signatures || current.signatures.length === 0) {
          patch.signatures = deepClone(DEFAULT_SIGNATURES);
        }
        if (Object.keys(patch).length > 0) {
          set((s) => ({ letter: { ...s.letter, ...patch } }));
        }
        // On v2 seed: strip any old built-in templates from localStorage
        if (typeof window !== 'undefined' && !localStorage.getItem(LS_SEEDED_KEY)) {
          const existing = readTemplates();
          const builtinIds = Object.values(BUILTIN_IDS) as string[];
          // Remove stale built-ins; keep only user-created templates
          const userOnly = existing.filter((t) => !builtinIds.includes(t.id));
          writeTemplates(userOnly);
          localStorage.setItem(LS_SEEDED_KEY, '1');
        }
      },

      // ── UI ────────────────────────────────────────────────────────────────
      toggleTemplatesPanel: () =>
        set((s) => ({ isTemplatesPanelOpen: !s.isTemplatesPanelOpen })),

      // ── Template CRUD ─────────────────────────────────────────────────────
      saveTemplate: (name) => {
        const templates = readTemplates();
        const newTemplate: LetterTemplate = {
          id: crypto.randomUUID(),
          name: name.trim(),
          savedAt: Date.now(),
          state: deepClone(get().letter),
        };
        writeTemplates([newTemplate, ...templates]);
      },

      loadTemplate: (id) => {
        const templates = readTemplates();
        const found = templates.find((t) => t.id === id)
          ?? BUILTIN_TEMPLATES.find((t) => t.id === id);
        if (!found) return;
        set({ letter: deepClone(found.state) });
      },

      deleteTemplate: (id) => {
        const templates = readTemplates();
        writeTemplates(templates.filter((t) => t.id !== id));
      },

      listTemplates: () => readTemplates(),
    }),
    {
      name: LS_LIVE_KEY,
      skipHydration: true,
      // Only persist the letter state, not UI flags
      partialize: (s) => ({ letter: s.letter }),
    }
  )
);
