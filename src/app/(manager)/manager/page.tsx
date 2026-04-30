'use client';

import { useState, useEffect } from 'react';
import { getProductionRecords, getMasterItems } from '@/lib/storage';
import { ProductionRecord, MasterItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DefectPieChart } from '@/features/dashboard/components/DefectPieChart';
import { MachineBarChart } from '@/features/dashboard/components/MachineBarChart';
import { Package, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ManagerDashboard() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [items, setItems] = useState<Record<string, MasterItem>>({});

  useEffect(() => {
    const allRecords = getProductionRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = allRecords.filter(r => r.date.startsWith(today));
    setRecords(todayRecords);

    const masterItems = getMasterItems();
    const itemsMap: Record<string, MasterItem> = {};
    masterItems.forEach(i => itemsMap[i.id] = i);
    setItems(itemsMap);
  }, []);

  const totalProduction = records.reduce((acc, curr) => acc + curr.totalProduction, 0);
  const totalGood = records.reduce((acc, curr) => acc + curr.goodQty, 0);
  const totalNG = records.reduce((acc, curr) => acc + curr.totalNG, 0);
  const defectRate = totalProduction > 0 ? ((totalNG / totalProduction) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Dashboard Produksi</h1>
        <p className="text-slate-400 text-sm">Ringkasan performa produksi hari ini</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Produksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-50">{totalProduction.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Good (FG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{totalGood.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Defect (NG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-400">{totalNG.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <Activity className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Defect Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{defectRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefectPieChart />
        <MachineBarChart />
      </div>

      {/* Recent Entries */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-slate-50">Input Terbaru Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950/50">
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-400">Waktu</TableHead>
                  <TableHead className="text-slate-400">Mesin & Shift</TableHead>
                  <TableHead className="text-slate-400">Item</TableHead>
                  <TableHead className="text-right text-slate-400">Good</TableHead>
                  <TableHead className="text-right text-slate-400">NG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Belum ada data diinput hari ini
                    </TableCell>
                  </TableRow>
                ) : (
                  records.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(record => (
                    <TableRow key={record.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-slate-300">
                        {format(new Date(record.createdAt), 'HH:mm', { locale: id })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-200">{record.machineId}</div>
                        <div className="text-xs text-slate-500">Shift {record.shift}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-400">{items[record.itemId]?.code}</div>
                        <div className="text-xs text-slate-400">{items[record.itemId]?.name}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-400">
                        {record.goodQty}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.totalNG > 0 ? (
                          <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border-0">{record.totalNG}</Badge>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
