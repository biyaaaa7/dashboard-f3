'use client';

import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Analytics Detail</h1>
          <p className="text-slate-400 text-sm">Analisis mendalam performa produksi</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-white/10 min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <BarChart3 className="h-8 w-8 text-blue-400 opacity-50" />
          </div>
          <p className="text-slate-400">Fitur Advanced Analytics akan tersedia di Phase 2.</p>
          <p className="text-sm text-slate-500">Anda dapat melihat ringkasan data di menu Dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
