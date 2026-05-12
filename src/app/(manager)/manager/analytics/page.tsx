'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Package, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProductionRecords, getDefectCategories } from '@/lib/storage';
import { ProductionRecord, DefectCategoryModel } from '@/types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AnalyticsPage() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [defectCats, setDefectCats] = useState<DefectCategoryModel[]>([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setRecords(getProductionRecords());
    setDefectCats(getDefectCategories());
  }, []);

  // Filter and process data
  const chartData = useMemo(() => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dateLabel = format(date, 'dd MMM', { locale: id });
      
      const dayRecords = records.filter(r => r.date.startsWith(dateStr));
      const good = dayRecords.reduce((acc, r) => acc + r.goodQty, 0);
      const ng = dayRecords.reduce((acc, r) => acc + r.totalNG, 0);
      
      data.push({
        name: dateLabel,
        good,
        ng,
        total: good + ng
      });
    }
    return data;
  }, [records, days]);

  const defectBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    records.forEach(r => {
      r.defects.forEach(d => {
        breakdown[d.category] = (breakdown[d.category] || 0) + d.quantity;
      });
    });

    return Object.entries(breakdown)
      .map(([catId, qty]) => {
        const cat = defectCats.find(c => c.id === catId);
        return {
          name: cat?.label || catId,
          value: qty
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [records, defectCats]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#5cc8ff]/20 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-[#5cc8ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#123047]">Analytics Produksi</h1>
            <p className="text-[#4f6b81] text-sm">Analisis tren dan performa kualitas</p>
          </div>
        </div>

        <div className="flex bg-white/60 p-1 rounded-lg border border-white/40 shadow-sm">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                days === d 
                  ? 'bg-[#5cc8ff] text-white shadow-sm' 
                  : 'text-[#7b93a8] hover:text-[#4f6b81]'
              }`}
            >
              {d} Hari
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2 bg-white/60 border-white/40 shadow-sm rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#123047]">
              <TrendingUp className="h-5 w-5 text-[#5cc8ff]" />
              Tren Produksi & NG
            </CardTitle>
            <CardDescription className="text-[#7b93a8]">Perbandingan output harian (Good vs Defect)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#7b93a8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7b93a8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e2e8f0', color: '#123047', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="good" name="Good" stroke="#4cc9a6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ng" name="Defect (NG)" stroke="#ff7f96" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Defect Pareto */}
        <Card className="bg-white/60 border-white/40 shadow-sm rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#123047]">
              <AlertTriangle className="h-5 w-5 text-[#ffbf69]" />
              Pareto Defect
            </CardTitle>
            <CardDescription className="text-[#7b93a8]">Penyebab NG terbanyak</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {defectBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectBreakdown} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#7b93a8" fontSize={12} width={100} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(92,200,255,0.1)' }}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e2e8f0', color: '#123047', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                  />
                  <Bar dataKey="value" name="Qty" radius={[0, 4, 4, 0]}>
                    {defectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[#7b93a8] text-sm">Belum ada data defect</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary Stats */}
        {[
          { label: 'Total Output', value: chartData.reduce((acc, d) => acc + d.total, 0), icon: Package, color: 'text-[#5cc8ff]' },
          { label: 'Total Good', value: chartData.reduce((acc, d) => acc + d.good, 0), icon: TrendingUp, color: 'text-[#4cc9a6]' },
          { label: 'Total Defect', value: chartData.reduce((acc, d) => acc + d.ng, 0), icon: AlertTriangle, color: 'text-[#ff7f96]' },
          { label: 'Rata-rata Defect Rate', value: ((chartData.reduce((acc, d) => acc + d.ng, 0) / (chartData.reduce((acc, d) => acc + d.total, 0) || 1)) * 100).toFixed(2) + '%', icon: Calendar, color: 'text-[#ffbf69]' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/60 border border-white/40 shadow-sm rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/80 border border-white/50 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#4f6b81]">{stat.label}</p>
                  <p className="text-xl font-bold text-[#123047]">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
