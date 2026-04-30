'use client';

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getProductionRecords } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MACHINES } from "@/lib/constants";

export function MachineBarChart() {
  const [data, setData] = useState<{name: string, good: number, ng: number}[]>([]);

  useEffect(() => {
    const records = getProductionRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date.startsWith(today));

    const machineStats: Record<string, { good: number, ng: number }> = {};
    MACHINES.forEach(m => machineStats[m] = { good: 0, ng: 0 });

    todayRecords.forEach(r => {
      if (machineStats[r.machineId]) {
        machineStats[r.machineId].good += r.goodQty;
        machineStats[r.machineId].ng += r.totalNG;
      }
    });

    const chartData = MACHINES
      .map(m => ({
        name: m,
        good: machineStats[m].good,
        ng: machineStats[m].ng
      }))
      .filter(item => item.good > 0 || item.ng > 0);

    setData(chartData);
  }, []);

  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-white/10 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-slate-500">Belum ada data produksi hari ini</p>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-slate-50">Produksi per Mesin</CardTitle>
        <CardDescription className="text-slate-400">Perbandingan Good vs NG per line hari ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
              />
              <Legend />
              <Bar dataKey="good" name="Good (FG)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ng" name="NG (Defect)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
