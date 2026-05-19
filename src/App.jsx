import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  HeartPulse,
  MapPinned,
  MessageSquareText,
  Sparkles,
  UserRound,
  WalletCards,
} from 'lucide-react';
import {
  eventLibrary,
  generateScript,
  getEventPlan,
  selectOptions,
  toneOptions,
} from './logic.js';

const iconMap = {
  Activity,
  CalendarClock,
  ClipboardList,
  FileText,
  HeartPulse,
  MapPinned,
  WalletCards,
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Card({ children, className = '' }) {
  return <div className={cx('rounded-3xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
}

function CardContent({ children, className = '' }) {
  return <div className={cx('p-6', className)}>{children}</div>;
}

function Badge({ children, variant = 'default', className = '' }) {
  const styles = variant === 'outline'
    ? 'border border-slate-200 bg-transparent text-slate-500'
    : variant === 'secondary'
      ? 'bg-slate-100 text-slate-700'
      : 'bg-slate-950 text-white';
  return <span className={cx('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', styles, className)}>{children}</span>;
}

function Button({ children, variant = 'default', className = '', ...props }) {
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

function Input(props) {
  return <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" {...props} />;
}

async function safeCopyToClipboard(text) {
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

function FieldSelect({ label, value, options, onChange }) {
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

function CopyButton({ text, label = '复制', onManualCopy }) {
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

function ManualCopyPanel({ text, onClose }) {
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

function OutputCard({ icon: Icon, title, children, footer }) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5" /></div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {children}
        {footer && <div className="mt-5">{footer}</div>}
      </CardContent>
    </Card>
  );
}

function BulletList({ items }) {
  return <ul className="space-y-3 text-sm leading-6 text-slate-700">{items.map((item) => <li key={item}>· {item}</li>)}</ul>;
}

function ScenarioPicker({ selectedEvent, onSelect }) {
  return (
    <Card className="rounded-[2rem] bg-white/90 backdrop-blur">
      <CardContent className="p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Choose Scenario</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">选择客户健康事件</h2>
          </div>
          <div className="text-sm text-slate-500">点击一个场景，即可生成对应话术与行动方案</div>
        </div>
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {eventLibrary.map((event) => {
            const EventIcon = iconMap[event.iconKey] || FileText;
            const active = selectedEvent === event.title;
            return (
              <button
                key={event.title}
                onClick={() => onSelect(event.title)}
                className={cx(
                  'group min-h-[160px] rounded-3xl border p-4 text-left transition duration-200',
                  active
                    ? 'border-slate-900 bg-slate-950 text-white shadow-xl shadow-slate-200'
                    : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className={active ? 'rounded-2xl bg-white/12 p-2.5 text-white' : 'rounded-2xl bg-white p-2.5 text-slate-900 ring-1 ring-slate-200'}>
                    <EventIcon className="h-5 w-5" />
                  </div>
                  <span className={active ? 'rounded-full bg-white/12 px-2.5 py-1 text-[11px] text-white/80' : 'rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500'}>{event.group}</span>
                </div>
                <div className="text-sm font-semibold leading-5">{event.title}</div>
                <div className={active ? 'mt-2 text-xs leading-5 text-white/70' : 'mt-2 text-xs leading-5 text-slate-500'}>{event.short}</div>
                <div className={active ? 'mt-4 text-[11px] text-white/55' : 'mt-4 text-[11px] text-slate-400'}>{event.badge}</div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [client, setClient] = useState({
    name: '王先生家庭',
    eventType: '体检报告异常',
    subject: '父母',
    ageGroup: '60岁以上',
    materialStatus: '有体检报告',
    emotion: '非常焦虑',
    region: '港深跨境',
    advisorGoal: '转介医生评估',
    note: '客户发来父亲体检报告，提到PSA和肺结节，想知道是否需要马上安排医生。',
  });
  const [manualCopyText, setManualCopyText] = useState('');
  const [scriptTone, setScriptTone] = useState('balanced');

  const plan = useMemo(() => getEventPlan(client), [client]);
  const scriptText = useMemo(() => generateScript(client, plan, scriptTone), [client, plan, scriptTone]);
  const Icon = iconMap[plan.iconKey] || FileText;
  const checklistText = plan.checklist.map((item) => `- ${item}`).join('\n');
  const resourceText = plan.resources.map((item) => `- ${item}`).join('\n');
  const actionText = plan.nextActions.map((item) => `- ${item}`).join('\n');
  const followUpText = plan.followUp.map((item) => `- ${item}`).join('\n');
  const fullPlanText = `${plan.internalSummary}\n\n客户话术：\n${scriptText}\n\n下一步动作：\n${actionText}\n\n资料清单：\n${checklistText}\n\n资源/权益：\n${resourceText}\n\n跟进节奏：\n${followUpText}`;
  const activeTone = toneOptions.find((tone) => tone.id === scriptTone) || toneOptions[1];
  const copyProps = { onManualCopy: setManualCopyText };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#eef2f7_36%,_#f8fafc_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden rounded-[2.25rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-200">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge className="bg-white text-slate-950 hover:bg-white">客户健康事件助手</Badge>
            <Badge variant="outline" className="border-white/20 text-white/75">Health Event Copilot</Badge>
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">客户发来健康问题后，顾问下一步怎么回？</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-white/70 md:text-lg">选择客户健康事件，补充客户原话、情绪和顾问目标，生成一段可直接使用的话术，并可一键调成更温和或更专业。</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <ScenarioPicker selectedEvent={client.eventType} onSelect={(eventType) => setClient({ ...client, eventType })} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="rounded-[2rem] bg-white/90 backdrop-blur">
          <CardContent>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3"><UserRound className="h-5 w-5" /></div>
              <div><div className="text-lg font-semibold">补充客户信息</div><div className="text-sm text-slate-500">用于让话术更贴近真实沟通</div></div>
            </div>
            <div className="grid gap-4">
              <div><label className="mb-1 block text-sm font-medium text-slate-700">客户/家庭名称</label><Input value={client.name} onChange={(event) => setClient({ ...client, name: event.target.value })} /></div>
              <div className="grid gap-3 md:grid-cols-2"><FieldSelect label="涉及谁" value={client.subject} options={selectOptions.subject} onChange={(value) => setClient({ ...client, subject: value })} /><FieldSelect label="年龄/家庭阶段" value={client.ageGroup} options={selectOptions.ageGroup} onChange={(value) => setClient({ ...client, ageGroup: value })} /></div>
              <div className="grid gap-3 md:grid-cols-2"><FieldSelect label="已有资料" value={client.materialStatus} options={selectOptions.materialStatus} onChange={(value) => setClient({ ...client, materialStatus: value })} /><FieldSelect label="客户情绪" value={client.emotion} options={selectOptions.emotion} onChange={(value) => setClient({ ...client, emotion: value })} /></div>
              <div className="grid gap-3 md:grid-cols-2"><FieldSelect label="地区路径" value={client.region} options={selectOptions.region} onChange={(value) => setClient({ ...client, region: value })} /><FieldSelect label="顾问目标" value={client.advisorGoal} options={selectOptions.advisorGoal} onChange={(value) => setClient({ ...client, advisorGoal: value })} /></div>
              <div><label className="mb-1 block text-sm font-medium text-slate-700">客户原话/补充说明</label><textarea value={client.note} onChange={(event) => setClient({ ...client, note: event.target.value })} className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" /></div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] bg-white/90 backdrop-blur">
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2"><Badge>{plan.badge}</Badge><Badge variant="secondary">{plan.priorityScore} · {plan.priorityLabel}</Badge></div>
                    <h2 className="text-2xl font-semibold tracking-tight">{plan.outputTitle}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{plan.summary}</p>
                  </div>
                </div>
                <CopyButton text={fullPlanText} label="复制完整方案" {...copyProps} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] bg-white">
            <CardContent>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-slate-100 p-3"><MessageSquareText className="h-5 w-5" /></div><div><h3 className="text-xl font-semibold">客户话术</h3><p className="mt-1 text-sm text-slate-500">当前语气：{activeTone.label} · {activeTone.helper}</p></div></div>
                <div className="flex flex-wrap gap-2">{toneOptions.map((tone) => <Button key={tone.id} variant={scriptTone === tone.id ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setScriptTone(tone.id)}>{tone.label}</Button>)}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 whitespace-pre-line text-sm leading-7 text-slate-700 ring-1 ring-slate-100">{scriptText}</div>
              <div className="mt-5"><CopyButton text={scriptText} label="复制话术" {...copyProps} /></div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-5 lg:grid-cols-4">
          <OutputCard icon={CheckCircle2} title="顾问下一步动作" footer={<CopyButton text={actionText} label="复制动作清单" {...copyProps} />}><BulletList items={plan.nextActions} /></OutputCard>
          <OutputCard icon={ClipboardList} title="需要客户提供" footer={<CopyButton text={checklistText} label="复制资料清单" {...copyProps} />}><div className="flex flex-wrap gap-2">{plan.checklist.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div></OutputCard>
          <OutputCard icon={WalletCards} title="可匹配资源 / 权益" footer={<CopyButton text={resourceText} label="复制资源清单" {...copyProps} />}><div className="flex flex-wrap gap-2">{plan.resources.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div></OutputCard>
          <OutputCard icon={CalendarClock} title="跟进节奏" footer={<CopyButton text={followUpText} label="复制跟进节奏" {...copyProps} />}><BulletList items={plan.followUp} /></OutputCard>
        </div>
      </section>

      <ManualCopyPanel text={manualCopyText} onClose={() => setManualCopyText('')} />
    </div>
  );
}
