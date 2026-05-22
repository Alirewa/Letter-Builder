'use client';
// Full TipTap rich text editor — loaded dynamically (ssr: false) by RichEditorDynamic.tsx

import { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, UnderlineIcon, AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Heading1, Heading2, List, ListOrdered, ImageIcon, TableIcon,
  Undo2, Redo2, Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Props ─────────────────────────────────────────────────────────────────────
interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  direction?: 'rtl' | 'ltr';
  placeholder?: string;
}

// ── Toolbar button ────────────────────────────────────────────────────────────
function TB({
  onClick, active, title, children, disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded text-sm transition-colors flex-shrink-0',
        active
          ? 'bg-blue-900 text-white'
          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-slate-600 mx-0.5 flex-shrink-0" />;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RichEditor({
  value,
  onChange,
  fontFamily = 'B Nazanin',
  fontSize = 14,
  lineHeight = 2.2,
  direction = 'rtl',
  placeholder = 'متن نامه را اینجا بنویسید...',
}: RichEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none',
        dir: direction,
      },
    },
    onUpdate({ editor }) {
      isInternalUpdate.current = true;
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. template load) without cursor disruption
  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value ?? '');
    }
  }, [value, editor]);

  // Update dir attribute when direction changes
  useEffect(() => {
    editor?.view.dom.setAttribute('dir', direction);
  }, [direction, editor]);

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageFile = useCallback((file: File) => {
    if (!editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  }, [editor]);

  // ── Insert 3×3 table ─────────────────────────────────────────────────────
  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-900"
      style={{ direction: 'ltr' }}  // toolbar always LTR
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800">

        {/* History */}
        <TB title="واگرد" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={14} />
        </TB>
        <TB title="انجام دوباره" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={14} />
        </TB>

        <Divider />

        {/* Inline styles */}
        <TB title="بولد" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={14} />
        </TB>
        <TB title="ایتالیک" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={14} />
        </TB>
        <TB title="زیرخط" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
          <UnderlineIcon size={14} />
        </TB>

        {/* Color */}
        <TB title="رنگ متن" onClick={() => colorInputRef.current?.click()}>
          <span style={{ fontSize: 12, fontWeight: 'bold', borderBottom: '2px solid currentColor' }}>A</span>
        </TB>
        <input
          ref={colorInputRef}
          type="color"
          className="hidden"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />

        <Divider />

        {/* Headings */}
        <TB title="عنوان ۱" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
          <Heading1 size={14} />
        </TB>
        <TB title="عنوان ۲" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={14} />
        </TB>

        <Divider />

        {/* Alignment */}
        <TB title="راست‌چین" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
          <AlignRight size={14} />
        </TB>
        <TB title="وسط‌چین" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
          <AlignCenter size={14} />
        </TB>
        <TB title="چپ‌چین" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
          <AlignLeft size={14} />
        </TB>
        <TB title="تراز" onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })}>
          <AlignJustify size={14} />
        </TB>

        <Divider />

        {/* Lists */}
        <TB title="لیست نقطه‌ای" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={14} />
        </TB>
        <TB title="لیست شماره‌ای" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={14} />
        </TB>

        <Divider />

        {/* Horizontal rule */}
        <TB title="خط جداکننده" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={14} />
        </TB>

        {/* Table */}
        <TB title="درج جدول ۳×۳" onClick={insertTable}>
          <TableIcon size={14} />
        </TB>

        {/* Image */}
        <TB title="درج تصویر" onClick={() => imageInputRef.current?.click()}>
          <ImageIcon size={14} />
        </TB>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); e.target.value = ''; }}
        />
      </div>

      {/* ── Editor area ──────────────────────────────────────────────────── */}
      <div
        className="tiptap-editor overflow-y-auto"
        style={{
          minHeight: 180,
          maxHeight: 420,
          fontFamily: `'${fontFamily}', 'B Nazanin', 'Vazirmatn', serif`,
          fontSize: fontSize,
          lineHeight: lineHeight,
          direction: direction,
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Table action hint */}
      {editor.isActive('table') && (
        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 text-xs text-blue-600 dark:text-blue-400" dir="rtl">
          جدول انتخاب شده — کلیک راست برای افزودن / حذف ردیف و ستون
        </div>
      )}
    </div>
  );
}
