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
      <Card className="bg-white/60 border-white/40 shadow-sm rounded-[24px] flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-[#7b93a8]">Belum ada data produksi hari ini</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 border-white/40 shadow-sm rounded-[24px]">
      <CardHeader>
        <CardTitle className="text-[#123047]">Produksi per Mesin</CardTitle>
        <CardDescription className="text-[#7b93a8]">Perbandingan Good vs NG per line hari ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#7b93a8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7b93a8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(92,200,255,0.1)'}}
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e2e8f0', borderRadius: '8px', color: '#123047', backdropFilter: 'blur(8px)' }}
              />
              <Legend />
              <Bar dataKey="good" name="Good (FG)" fill="#4cc9a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ng" name="NG (Defect)" fill="#ff7f96" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
