import React, { useState } from 'react';
import { Copy } from 'lucide-react';

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Card({ children, className = '' }) {
  return <div className={cx('rounded-3xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={cx('p-6', className)}>{children}</div>;
}

export function Badge({ children, variant = 'default', className = '' }) {
  const styles = variant === 'outline'
    ? 'border border-slate-200 bg-transparent text-slate-500'
    : variant === 'secondary'
      ? 'bg-slate-100 text-slate-700'
      : 'bg-slate-950 text-white';
  return <span className={cx('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', styles, className)}>{children}</span>;
}

export function Button({ children, variant = 'default', className = '', ...props }) {
  const styles = variant === 'outline'
    ? 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
    : 'bg-slate-950 text-white hover:bg-slate-800';
  return (
    <button
      className={cx('inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:opacity-50', styles, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props) {
  return <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" {...props} />;
}

export async function safeCopyToClipboard(text) {
  if (!text) return { ok: false, reason: 'empty' };
  try {
    if (navigator?.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { ok: true, reason: 'clipboard' };
    }
  } catch (error) {
    return { ok: false, reason: 'blocked', error };
  }
  return { ok: false, reason: 'manual' };
}

export function FieldSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

export function CopyButton({ text, label = '复制', onManualCopy }) {
  const [status, setStatus] = useState('idle');

  async function handleCopy() {
    const result = await safeCopyToClipboard(text);
    if (result.ok) {
      setStatus('copied');
      window.setTimeout(() => setStatus('idle'), 1600);
      return;
    }
    setStatus('manual');
    onManualCopy?.(text);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="rounded-2xl" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />{status === 'copied' ? '已复制' : label}
      </Button>
      {status === 'manual' && <span className="text-xs text-amber-700">当前环境限制自动复制，请在弹窗中手动复制。</span>}
    </div>
  );
}

export function BulletList({ items }) {
  return <ul className="space-y-3 text-sm leading-6 text-slate-700">{items.map((item) => <li key={item}>· {item}</li>)}</ul>;
}
