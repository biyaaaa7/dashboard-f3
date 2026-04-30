'use client';

import { useMemo, useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getProductionRecords, getDefectCategories } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DefectPieChart() {
  const [data, setData] = useState<{name: string, value: number, fill: string}[]>([]);

  useEffect(() => {
    const records = getProductionRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date.startsWith(today));

    const activeDefects = getDefectCategories().filter(d => d.isActive);
    const defectCounts: Record<string, number> = {};
    activeDefects.forEach(c => defectCounts[c.id] = 0);

    todayRecords.forEach(record => {
      record.defects.forEach(d => {
        if (defectCounts[d.category] !== undefined) {
          defectCounts[d.category] += d.quantity;
        }
      });
    });

    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1'];
    
    const chartData = activeDefects
      .map((cat, index) => ({
        name: cat.label,
        value: defectCounts[cat.id],
        fill: colors[index % colors.length]
      }))
      .filter(item => item.value > 0);

    setData(chartData);
  }, []);

  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-white/10 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-slate-500">Belum ada data NG hari ini</p>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-slate-50">Distribusi Defect (NG)</CardTitle>
        <CardDescription className="text-slate-400">Total defect per kategori hari ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
