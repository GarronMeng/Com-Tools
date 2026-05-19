import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { toneOptions } from '../logic.js';
import { Button, Card, CardContent, CopyButton } from './ui.jsx';

export default function ScriptPanel({ scriptTone, setScriptTone, activeTone, scriptText, onManualCopy }) {
  return (
    <Card className="rounded-[2rem] bg-white">
      <CardContent>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-slate-100 p-3"><MessageSquareText className="h-5 w-5" /></div><div><h3 className="text-xl font-semibold">客户话术</h3><p className="mt-1 text-sm text-slate-500">当前语气：{activeTone.label} · {activeTone.helper}</p></div></div>
          <div className="flex flex-wrap gap-2">{toneOptions.map((tone) => <Button key={tone.id} variant={scriptTone === tone.id ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setScriptTone(tone.id)}>{tone.label}</Button>)}</div>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 whitespace-pre-line text-sm leading-7 text-slate-700 ring-1 ring-slate-100">{scriptText}</div>
        <div className="mt-5"><CopyButton text={scriptText} label="复制话术" onManualCopy={onManualCopy} /></div>
      </CardContent>
    </Card>
  );
}
