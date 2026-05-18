'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface DynamicListInputProps {
  label: string;
  value: string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string[]) => void;
  error?: string;
}

export default function DynamicListInput({ label, value, onChange, error }: DynamicListInputProps) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onChange([...value, text.trim()]);
      setText('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} <span className="text-error">*</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Type a point and press Enter"
          className="border-primary/10 text-primary focus:border-primary/60 h-auto w-full rounded-md border bg-[#F5F2F0] p-3 transition-all outline-none placeholder:text-[#978279]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-primary flex cursor-pointer items-center justify-center rounded-md px-4 text-white hover:opacity-90"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {value.map((item, idx) => (
          <div
            key={idx}
            className="border-primary/10 text-primary animate-in fade-in zoom-in flex items-center gap-2 border bg-white px-3 py-1.5 text-sm duration-300"
          >
            <span>{item}</span>
            <X
              size={14}
              className="text-error cursor-pointer transition-transform hover:scale-125"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
            />
          </div>
        ))}
      </div>
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
}
