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
        <div className="h-10 w-10 rounded-lg bg-[#4cc9a6]/20 flex items-center justify-center">
          <Download className="h-5 w-5 text-[#4cc9a6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#123047]">Export Data</h1>
          <p className="text-[#4f6b81] text-sm">Unduh laporan produksi untuk analisis eksternal</p>
        </div>
      </div>

      <Card className="bg-white/60 border-white/40 shadow-sm rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-[#123047] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#5cc8ff]" />
            Filter Laporan
          </CardTitle>
          <CardDescription className="text-[#7b93a8]">Pilih rentang tanggal data yang ingin diunduh</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#4f6b81]">Tanggal Mulai</Label>
              <Input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-white/60 border-white/40 text-[#123047] h-12 focus-visible:ring-[#5cc8ff] rounded-xl shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#4f6b81]">Tanggal Akhir</Label>
              <Input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-white/60 border-white/40 text-[#123047] h-12 focus-visible:ring-[#5cc8ff] rounded-xl shadow-sm" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/40">
            <Button 
              onClick={handleExport}
              className="w-full h-14 bg-[#4cc9a6] hover:bg-[#3ba88a] text-white text-lg font-bold shadow-md rounded-xl transition-all active:scale-[0.98] border-none"
            >
              <FileSpreadsheet className="mr-2 h-6 w-6" /> Unduh Laporan (CSV)
            </Button>
            <p className="text-center text-xs text-[#7b93a8] mt-4 italic">
              * Format CSV dapat dibuka langsung menggunakan Microsoft Excel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
