'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getProductionRecords, getMasterItems } from '@/lib/storage';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export default function ExportPage() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleExport = () => {
    const allRecords = getProductionRecords();
    const items = getMasterItems();
    const itemsMap = Object.fromEntries(items.map(i => [i.id, i]));

    const filtered = allRecords.filter(r => {
      const date = parseISO(r.date);
      return isWithinInterval(date, {
        start: startOfDay(parseISO(startDate)),
        end: endOfDay(parseISO(endDate))
      });
    });

    if (filtered.length === 0) {
      alert('Tidak ada data dalam rentang tanggal tersebut');
      return;
    }

    // Create CSV
    const headers = ['Tanggal', 'Shift', 'Mesin', 'Item Code', 'Item Name', 'Good Qty', 'Total NG', 'Total Production'];
    const rows = filtered.map(r => [
      r.date,
      r.shift,
      r.machineId,
      itemsMap[r.itemId]?.code || r.itemId,
      itemsMap[r.itemId]?.name || '',
      r.goodQty,
      r.totalNG,
      r.totalProduction
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `DNP_Production_Report_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Download className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Export Data</h1>
          <p className="text-slate-400 text-sm">Unduh laporan produksi untuk analisis eksternal</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-50 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Filter Laporan
          </CardTitle>
          <CardDescription className="text-slate-400">Pilih rentang tanggal data yang ingin diunduh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Tanggal Mulai</Label>
              <Input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-slate-950 border-white/10 text-slate-200 h-12 focus:ring-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Tanggal Akhir</Label>
              <Input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-slate-950 border-white/10 text-slate-200 h-12 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <Button 
              onClick={handleExport}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              <FileSpreadsheet className="mr-2 h-6 w-6" /> Unduh Laporan (CSV)
            </Button>
            <p className="text-center text-xs text-slate-500 mt-4 italic">
              * Format CSV dapat dibuka langsung menggunakan Microsoft Excel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
