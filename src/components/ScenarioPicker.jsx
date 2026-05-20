import React from 'react';
import { Activity, CalendarClock, ClipboardList, FileText, HeartPulse, MapPinned, WalletCards } from 'lucide-react';
import { eventLibrary } from '../logic.js';
import { Card, CardContent, cx } from './ui.jsx';

const iconMap = { Activity, CalendarClock, ClipboardList, FileText, HeartPulse, MapPinned, WalletCards };

export default function ScenarioPicker({ selectedEvent, onSelect }) {
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
