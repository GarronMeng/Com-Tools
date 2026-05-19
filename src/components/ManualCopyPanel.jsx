import React, { useEffect, useRef } from 'react';
import { Button } from './ui.jsx';

export default function ManualCopyPanel({ text, onClose }) {
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!text) return undefined;
    const timer = window.setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [text]);

  if (!text) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">手动复制内容</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">当前预览环境不允许网页直接写入剪贴板。文本已自动选中，可按 Ctrl/Cmd + C 复制。</div>
        </div>
        <Button variant="outline" className="rounded-2xl" onClick={onClose}>关闭</Button>
      </div>
      <textarea ref={textAreaRef} value={text} readOnly className="max-h-72 min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-slate-200" />
    </div>
  );
}
