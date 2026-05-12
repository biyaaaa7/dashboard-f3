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
        <h1 className="text-2xl font-bold text-[#123047]">Dashboard Produksi</h1>
        <p className="text-[#4f6b81] text-sm">Ringkasan performa produksi hari ini</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7b93a8]">Total Produksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#123047]">{totalProduction.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[#4cc9a6]">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7b93a8]">Total Good (FG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2ca582]">{totalGood.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[#ff7f96]">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7b93a8]">Total Defect (NG)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#e0566e]">{totalNG.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[#ffbf69]">
            <Activity className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#7b93a8]">Defect Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#e5a03d]">{defectRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefectPieChart />
        <MachineBarChart />
      </div>

      {/* Recent Entries */}
      <Card className="glass-soft">
        <CardHeader>
          <CardTitle className="text-lg text-[#123047]">Input Terbaru Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/40 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-white/50">
                <TableRow className="border-white/40">
                  <TableHead className="text-[#4f6b81]">Waktu</TableHead>
                  <TableHead className="text-[#4f6b81]">Mesin & Shift</TableHead>
                  <TableHead className="text-[#4f6b81]">Item</TableHead>
                  <TableHead className="text-right text-[#4f6b81]">Good</TableHead>
                  <TableHead className="text-right text-[#4f6b81]">NG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow className="border-white/40 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-8 text-[#7b93a8]">
                      Belum ada data diinput hari ini
                    </TableCell>
                  </TableRow>
                ) : (
                  records.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(record => (
                    <TableRow key={record.id} className="border-white/40 hover:bg-white/40 transition-colors">
                      <TableCell className="text-[#123047]">
                        {format(new Date(record.createdAt), 'HH:mm', { locale: id })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#123047]">{record.machineId}</div>
                        <div className="text-xs text-[#7b93a8]">Shift {record.shift}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#5cc8ff]">{items[record.itemId]?.code}</div>
                        <div className="text-xs text-[#4f6b81]">{items[record.itemId]?.name}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-[#2ca582]">
                        {record.goodQty}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.totalNG > 0 ? (
                          <Badge variant="destructive" className="bg-[#ff7f96]/20 text-[#e0566e] border-0">{record.totalNG}</Badge>
                        ) : (
                          <span className="text-[#7b93a8]">0</span>
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
