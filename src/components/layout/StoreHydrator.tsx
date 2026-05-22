'use client';

import { useEffect } from 'react';
import { useLetterStore } from '@/store/letterStore';

// Triggers Zustand's skipHydration rehydration then fills in date/letter number.
// Also loads the BIMFA logo from /bimfa-logo.png on first run.
// Has no visual output.
export default function StoreHydrator() {
  useEffect(() => {
    useLetterStore.persist.rehydrate();
    useLetterStore.getState().initLetter();

    // Load BIMFA logo if not already set
    const { letter, updateLetter } = useLetterStore.getState();
    if (!letter.logoBase64) {
      // Try PNG first, fall back to SVG
      fetch('/bimfa-logo.png')
        .then((r) => r.ok ? r : fetch('/bimfa-logo.svg'))
        .then((res) => res.blob())
        .then((blob) => {
          if (!blob) return;
          const reader = new FileReader();
          reader.onload = () => {
            updateLetter({ logoBase64: reader.result as string });
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          // Logo file not present — silently skip
        });
    }
  }, []);

  return null;
}
