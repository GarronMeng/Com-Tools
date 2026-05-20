import React from 'react';
import { History } from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import { Badge, Button } from './ui.jsx';

export default function CaseHistoryPanel({ cases, onLoadCase }) {
  return (
    <OutputCard icon={History} title="历史案例（Mock）">
      <div className="space-y-3">
        {cases.length === 0 && <div className="text-sm text-slate-500">暂无历史案例，先点击“保存案例”。</div>}
        {cases.map((item) => (
          <div key={item.caseId} className="rounded-2xl border border-slate-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-slate-800">{item.caseId} · {item.client?.name || '未命名客户'}</div>
                <div className="text-xs text-slate-500">{item.client?.eventType} · {new Date(item.savedAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{item.workflowResult?.triage?.level || '未分诊'}</Badge>
                <Button variant="outline" className="rounded-xl" onClick={() => onLoadCase(item)}>载入</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </OutputCard>
  );
}
