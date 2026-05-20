import React from 'react';
import OutputCard from './OutputCard.jsx';
import { Badge, BulletList, CopyButton } from './ui.jsx';
import { ClipboardList, HeartPulse, MapPinned, ShieldCheck } from 'lucide-react';

export function SummaryPanel({ summary, onManualCopy }) {
  return (
    <OutputCard
      icon={ClipboardList}
      title="资料摘要"
      footer={<CopyButton text={summary} label="复制摘要" onManualCopy={onManualCopy} />}
    >
      <div className="text-sm leading-6 text-slate-700">{summary || '点击“生成主线建议”后显示摘要。'}</div>
    </OutputCard>
  );
}

export function ProblemPanel({ problems, onManualCopy }) {
  const text = (problems || []).join('\n');
  return (
    <OutputCard
      icon={HeartPulse}
      title="问题识别"
      footer={<CopyButton text={text} label="复制问题识别" onManualCopy={onManualCopy} />}
    >
      <div className="flex flex-wrap gap-2">{(problems || []).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div>
    </OutputCard>
  );
}

export function TriagePanel({ triage, onManualCopy }) {
  const text = triage ? `${triage.level}\n${triage.reason}` : '';
  return (
    <OutputCard
      icon={ShieldCheck}
      title="分诊建议"
      footer={<CopyButton text={text} label="复制分诊建议" onManualCopy={onManualCopy} />}
    >
      <div className="space-y-2 text-sm text-slate-700">
        <div className="font-semibold">{triage?.level || '未生成'}</div>
        <div>{triage?.reason || '点击“生成主线建议”后展示分诊解释。'}</div>
      </div>
    </OutputCard>
  );
}

export function PathPanel({ paths, onManualCopy }) {
  const text = (paths || []).map((p) => `${p.name}｜${p.fitFor}｜${p.eta}｜预算:${p.budgetHint}`).join('\n');
  return (
    <OutputCard
      icon={MapPinned}
      title="医院/医生路径推荐"
      footer={<CopyButton text={text} label="复制路径建议" onManualCopy={onManualCopy} />}
    >
      <ul className="space-y-2 text-sm text-slate-700">{(paths || []).map((p) => <li key={p.name}>• {p.name}（{p.fitFor}，{p.eta}，预算{p.budgetHint}）</li>)}</ul>
    </OutputCard>
  );
}

export function InsurancePanel({ insurance, onManualCopy }) {
  const text = insurance ? `可用权益:\n${insurance.benefits.join('\n')}\n\n理赔资料:\n${insurance.claimDocs.join('\n')}\n\n提醒:\n${insurance.cautions.join('\n')}` : '';
  return (
    <OutputCard
      icon={ClipboardList}
      title="保险权益/理赔资料"
      footer={<CopyButton text={text} label="复制权益清单" onManualCopy={onManualCopy} />}
    >
      <div className="space-y-3">
        <div><div className="text-xs text-slate-500">可用权益</div><BulletList items={insurance?.benefits || []} /></div>
        <div><div className="text-xs text-slate-500">理赔资料</div><BulletList items={insurance?.claimDocs || []} /></div>
      </div>
    </OutputCard>
  );
}
