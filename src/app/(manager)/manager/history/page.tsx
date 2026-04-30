'use client';

import { useState, useEffect } from 'react';
import { getHistoryLogs } from '@/lib/storage';
import { HistoryLog } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, Search } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export default function HistoryPage() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLogs(getHistoryLogs());
  }, []);

  const filteredLogs = logs.filter(log => 
    log.userId.toLowerCase().includes(search.toLowerCase()) || 
    log.recordId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <History className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">History Log</h1>
          <p className="text-slate-400 text-sm">Jejak audit aktivitas input dan edit data</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Cari user atau ID record..." 
            className="pl-9 bg-slate-900/50 border-white/10 text-slate-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-white/10">
              <TableHead className="text-slate-400">Waktu</TableHead>
              <TableHead className="text-slate-400">User ID</TableHead>
              <TableHead className="text-slate-400">Aksi</TableHead>
              <TableHead className="text-slate-400">Record ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Tidak ada history ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="text-slate-300">
                    {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </TableCell>
                  <TableCell className="text-slate-200 font-medium">{log.userId}</TableCell>
                  <TableCell>
                    {log.action === 'create' && <Badge className="bg-emerald-500/10 text-emerald-400 border-0">Create</Badge>}
                    {log.action === 'edit' && <Badge className="bg-amber-500/10 text-amber-400 border-0">Edit</Badge>}
                    {log.action === 'delete' && <Badge className="bg-rose-500/10 text-rose-400 border-0">Delete</Badge>}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono">{log.recordId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
