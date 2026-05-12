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
        <div className="h-10 w-10 rounded-lg bg-[#5cc8ff]/20 flex items-center justify-center">
          <History className="h-5 w-5 text-[#5cc8ff]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#123047]">History Log</h1>
          <p className="text-[#4f6b81] text-sm">Jejak audit aktivitas input dan edit data</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b93a8]" />
          <Input 
            placeholder="Cari user atau ID record..." 
            className="pl-9 bg-white/60 border-white/40 text-[#0f172a] placeholder:text-[#7b93a8] rounded-xl shadow-sm focus-visible:ring-[#5cc8ff]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/40 bg-white/60 backdrop-blur-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-white/50">
            <TableRow className="border-white/40">
              <TableHead className="text-[#4f6b81]">Waktu</TableHead>
              <TableHead className="text-[#4f6b81]">User ID</TableHead>
              <TableHead className="text-[#4f6b81]">Aksi</TableHead>
              <TableHead className="text-[#4f6b81]">Record ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow className="border-white/40 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-[#7b93a8]">
                  Tidak ada history ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-white/40 hover:bg-white/40 transition-colors">
                  <TableCell className="text-[#123047]">
                    {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </TableCell>
                  <TableCell className="text-[#123047] font-medium">{log.userId}</TableCell>
                  <TableCell>
                    {log.action === 'create' && <Badge className="bg-[#4cc9a6]/10 text-[#2ca582] border-0">Create</Badge>}
                    {log.action === 'edit' && <Badge className="bg-[#ffbf69]/10 text-[#e5a03d] border-0">Edit</Badge>}
                    {log.action === 'delete' && <Badge className="bg-[#ff7f96]/10 text-[#e0566e] border-0">Delete</Badge>}
                  </TableCell>
                  <TableCell className="text-[#7b93a8] text-xs font-mono">{log.recordId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
