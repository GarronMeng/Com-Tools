import React from 'react';
import { Card, CardContent } from './ui.jsx';

export default function OutputCard({ icon: Icon, title, children, footer }) {
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
