'use client';

import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ExportPage() {
  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Export to ${type.toUpperCase()} (Simulasi untuk Phase 1)`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Download className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Export Data</h1>
          <p className="text-slate-400 text-sm">Unduh laporan produksi untuk meeting atau ERP</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-slate-50">Filter Laporan</CardTitle>
          <CardDescription className="text-slate-400">Pilih rentang tanggal dan kriteria data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Tanggal Mulai</Label>
              <Input type="date" className="bg-slate-950 border-white/10 text-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Tanggal Akhir</Label>
              <Input type="date" className="bg-slate-950 border-white/10 text-slate-200" />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => handleExport('excel')}
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-lg shadow-lg shadow-emerald-600/20"
            >
              <FileSpreadsheet className="mr-2 h-5 w-5" /> Export ke Excel
            </Button>
            <Button 
              onClick={() => handleExport('pdf')}
              className="flex-1 h-14 bg-rose-600 hover:bg-rose-500 text-lg shadow-lg shadow-rose-600/20"
            >
              <FileText className="mr-2 h-5 w-5" /> Export ke PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
