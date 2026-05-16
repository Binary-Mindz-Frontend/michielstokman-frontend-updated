'use client';

import { cn } from '@/lib/utils';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List, ListOrdered, UnderlineIcon } from 'lucide-react';
import { useEffect } from 'react';

interface TiptapEditorProps {
  label: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
  error?: string;
}

export default function TiptapEditor({ label, value, onChange, error }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] w-full rounded-b-md border-x border-b border-primary/10 bg-[#F5F2F0] p-3 text-sm text-primary outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    cn(
      'rounded p-1.5 transition-colors hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
      active ? 'bg-primary/15 text-primary' : 'text-dark-primary',
    );

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">
        {label} <span className="text-error">*</span>
      </label>
      <div className="border-primary/10 flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 bg-white px-2 py-1.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={toolbarBtn(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={toolbarBtn(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={toolbarBtn(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </button>

        <div className="bg-primary/10 mx-1 h-5 w-px" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
          title="Heading"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={toolbarBtn(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={toolbarBtn(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </button>
      </div>
      <EditorContent editor={editor} />
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
}
