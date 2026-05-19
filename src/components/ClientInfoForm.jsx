import React from 'react';
import { UserRound } from 'lucide-react';
import { selectOptions } from '../logic.js';
import { Card, CardContent, FieldSelect, Input } from './ui.jsx';

export default function ClientInfoForm({ client, setClient }) {
  return (
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
  );
}
