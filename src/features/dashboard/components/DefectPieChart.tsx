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

    const colors = ['#ff7f96', '#ffbf69', '#5cc8ff', '#4da8ff', '#4cc9a6', '#2ca582'];
    
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
      <Card className="bg-white/60 border-white/40 shadow-sm rounded-[24px] flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-[#7b93a8]">Belum ada data NG hari ini</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 border-white/40 shadow-sm rounded-[24px]">
      <CardHeader>
        <CardTitle className="text-[#123047]">Distribusi Defect (NG)</CardTitle>
        <CardDescription className="text-[#7b93a8]">Total defect per kategori hari ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e2e8f0', borderRadius: '8px', color: '#123047', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#123047' }}
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
                stroke="#ffffff"
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
