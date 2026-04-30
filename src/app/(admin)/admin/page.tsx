'use client';

import { useState, useEffect } from 'react';
import { getUsers, getMasterItems, getDefectCategories } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Database, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, items: 0, defects: 0 });

  useEffect(() => {
    setStats({
      users: getUsers().length,
      items: getMasterItems().filter(i => i.isActive).length,
      defects: getDefectCategories().filter(d => d.isActive).length
    });
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of system data and settings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-50">{stats.users}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <Database className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{stats.items}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active NG Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-400">{stats.defects}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
