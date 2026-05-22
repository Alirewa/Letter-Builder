'use client';
// Actual date picker — only imported client-side via DatePickerInput.tsx

import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function DatePickerInner({ value, onChange }: Props) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value || undefined}
      onChange={(date) => {
        if (!date) { onChange(''); return; }
        const d = date as DateObject;
        // Format as YYYY/MM/DD in Western Arabic numerals
        const formatted = `${d.year}/${String(d.month.number).padStart(2, '0')}/${String(d.day).padStart(2, '0')}`;
        onChange(formatted);
      }}
      inputClass="input"
      containerStyle={{ width: '100%' }}
      style={{ width: '100%', direction: 'rtl' }}
      calendarPosition="bottom-right"
      placeholder="انتخاب تاریخ"
      showOtherDays={false}
      shadow={true}
    />
  );
}
