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
          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Analytics Produksi</h1>
            <p className="text-slate-400 text-sm">Analisis tren dan performa kualitas</p>
          </div>
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                days === d 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d} Hari
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Tren Produksi & NG
            </CardTitle>
            <CardDescription>Perbandingan output harian (Good vs Defect)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="good" name="Good" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ng" name="Defect (NG)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Defect Pareto */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Pareto Defect
            </CardTitle>
            <CardDescription>Penyebab NG terbanyak</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {defectBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defectBreakdown} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" name="Qty" radius={[0, 4, 4, 0]}>
                    {defectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-sm">Belum ada data defect</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary Stats */}
        {[
          { label: 'Total Output', value: chartData.reduce((acc, d) => acc + d.total, 0), icon: Package, color: 'text-blue-400' },
          { label: 'Total Good', value: chartData.reduce((acc, d) => acc + d.good, 0), icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Total Defect', value: chartData.reduce((acc, d) => acc + d.ng, 0), icon: AlertTriangle, color: 'text-rose-400' },
          { label: 'Rata-rata Defect Rate', value: ((chartData.reduce((acc, d) => acc + d.ng, 0) / (chartData.reduce((acc, d) => acc + d.total, 0) || 1)) * 100).toFixed(2) + '%', icon: Calendar, color: 'text-amber-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-950 border border-white/5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-50">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
