import React from 'react';
import { CalendarClock } from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import { CopyButton, cx } from './ui.jsx';

const statusMap = {
  pending: { label: '待跟进', className: 'text-amber-700 bg-amber-50' },
  done: { label: '已完成', className: 'text-emerald-700 bg-emerald-50' },
  skipped: { label: '已跳过', className: 'text-slate-600 bg-slate-100' },
};

export default function CaseFollowupPanel({ followups, savedCase, onManualCopy, onStatusChange }) {
  const text = (followups || []).map((f) => `${f.label}（T+${f.dueInDays}天）[${statusMap[f.status || 'pending'].label}]`).join('\n');
  return (
    <OutputCard
      icon={CalendarClock}
      title="案例保存与跟进"
      footer={<CopyButton text={text} label="复制跟进计划" onManualCopy={onManualCopy} />}
    >
      <div className="space-y-2 text-sm text-slate-700">
        {savedCase ? <div className="font-medium">已保存案例：{savedCase.caseId}</div> : <div>尚未保存案例，点击“保存案例”后生成跟进记录。</div>}
        <ul className="space-y-2">
          {(followups || []).map((item) => {
            const status = statusMap[item.status || 'pending'];
            return (
              <li key={item.label} className="rounded-xl border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div>• {item.label}（T+{item.dueInDays}天）</div>
                  <span className={cx('rounded-full px-2 py-0.5 text-xs', status.className)}>{status.label}</span>
                </div>
                {savedCase && (
                  <div className="mt-2 flex gap-2 text-xs">
                    <button type="button" className="rounded-md border px-2 py-1" onClick={() => onStatusChange(item.label, 'pending')}>待跟进</button>
                    <button type="button" className="rounded-md border px-2 py-1" onClick={() => onStatusChange(item.label, 'done')}>完成</button>
                    <button type="button" className="rounded-md border px-2 py-1" onClick={() => onStatusChange(item.label, 'skipped')}>跳过</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </OutputCard>
  );
}
