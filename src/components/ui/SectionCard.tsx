'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  icon,
  defaultOpen = true,
  children,
  className,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('card mb-3', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-right"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="opacity-60" style={{ color: 'var(--text)' }}>{icon}</span>}
          <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</span>
        </div>
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>

      <div className={cn('overflow-hidden transition-all duration-200', open ? 'max-h-[9999px]' : 'max-h-0')}>
        <div className="px-4 pb-4 pt-1">{children}</div>
      </div>
    </div>
  );
}
