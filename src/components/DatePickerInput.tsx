'use client';
// SSR-safe Shamsi (Jalali) date picker — react-multi-date-picker must not run on server.

import dynamic from 'next/dynamic';

interface DatePickerInputProps {
  value: string;
  onChange: (val: string) => void;
}

const DatePickerInner = dynamic(
  () => import('./DatePickerInner'),
  {
    ssr: false,
    loading: () => (
      <input
        type="text"
        readOnly
        placeholder="در حال بارگذاری..."
        className="input text-left"
        dir="ltr"
      />
    ),
  }
);

export default function DatePickerInput({ value, onChange }: DatePickerInputProps) {
  return <DatePickerInner value={value} onChange={onChange} />;
}
