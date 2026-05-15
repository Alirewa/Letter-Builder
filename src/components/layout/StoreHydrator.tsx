'use client';

import { useEffect } from 'react';
import { useLetterStore } from '@/store/letterStore';

// Triggers Zustand's skipHydration rehydration then fills in date/letter number.
// Rendered once in RootLayout — has no visual output.
export default function StoreHydrator() {
  useEffect(() => {
    useLetterStore.persist.rehydrate();
    useLetterStore.getState().initLetter();
  }, []);

  return null;
}
