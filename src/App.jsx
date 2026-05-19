import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, CheckCircle2, ClipboardList, FileText, WalletCards } from 'lucide-react';
import { generateScript, getEventPlan, toneOptions } from './logic.js';
import ClientInfoForm from './components/ClientInfoForm.jsx';
import ManualCopyPanel from './components/ManualCopyPanel.jsx';
import OutputCard from './components/OutputCard.jsx';
import ScenarioPicker from './components/ScenarioPicker.jsx';
import ScriptPanel from './components/ScriptPanel.jsx';
import { Badge, BulletList, Card, CardContent, CopyButton } from './components/ui.jsx';

const iconMap = { CalendarClock, ClipboardList, FileText, WalletCards };

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
        <ClientInfoForm client={client} setClient={setClient} />

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
                <CopyButton text={fullPlanText} label="复制完整方案" onManualCopy={setManualCopyText} />
              </div>
            </CardContent>
          </Card>

          <ScriptPanel
            scriptTone={scriptTone}
            setScriptTone={setScriptTone}
            activeTone={activeTone}
            scriptText={scriptText}
            onManualCopy={setManualCopyText}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-5 lg:grid-cols-4">
          <OutputCard icon={CheckCircle2} title="顾问下一步动作" footer={<CopyButton text={actionText} label="复制动作清单" onManualCopy={setManualCopyText} />}><BulletList items={plan.nextActions} /></OutputCard>
          <OutputCard icon={ClipboardList} title="需要客户提供" footer={<CopyButton text={checklistText} label="复制资料清单" onManualCopy={setManualCopyText} />}><div className="flex flex-wrap gap-2">{plan.checklist.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div></OutputCard>
          <OutputCard icon={WalletCards} title="可匹配资源 / 权益" footer={<CopyButton text={resourceText} label="复制资源清单" onManualCopy={setManualCopyText} />}><div className="flex flex-wrap gap-2">{plan.resources.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div></OutputCard>
          <OutputCard icon={CalendarClock} title="跟进节奏" footer={<CopyButton text={followUpText} label="复制跟进节奏" onManualCopy={setManualCopyText} />}><BulletList items={plan.followUp} /></OutputCard>
        </div>
      </section>

      <ManualCopyPanel text={manualCopyText} onClose={() => setManualCopyText('')} />
    </div>
  );
}
