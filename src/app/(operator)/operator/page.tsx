'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SHIFTS, MACHINES } from '@/lib/constants';
import { getProductionRecords } from '@/lib/storage';
import { ProductionRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Clock, CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';

export default function OperatorDashboard() {
  const router = useRouter();
  const [shift, setShift] = useState<string>('');
  const [machine, setMachine] = useState<string>('');
  const [recentRecords, setRecentRecords] = useState<ProductionRecord[]>([]);

  useEffect(() => {
    // Get today's records
    const allRecords = getProductionRecords();
    const today = new Date().toISOString().split('T')[0];
    
    const todaysRecords = allRecords
      .filter(r => r.date.startsWith(today))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5); // Just 5 recent
      
    setRecentRecords(todaysRecords);
  }, []);

  const handleStartInput = () => {
    if (!shift || !machine) {
      alert("Pilih Shift dan Mesin terlebih dahulu");
      return;
    }
    // Simple state pass via localStorage for this session
    localStorage.setItem('current_session', JSON.stringify({ shift: parseInt(shift), machineId: machine }));
    router.push('/operator/input');
  };

  // Stats calculate
  const totalItems = recentRecords.reduce((acc, curr) => acc + curr.totalProduction, 0);
  const totalGood = recentRecords.reduce((acc, curr) => acc + curr.goodQty, 0);
  const totalNG = recentRecords.reduce((acc, curr) => acc + curr.totalNG, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Session Selection */}
      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm text-slate-50">
        <CardHeader className="pb-4 border-b border-white/5">
          <CardTitle className="text-xl flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-400" />
            Setup Sesi Kerja
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-slate-400 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Shift Saat Ini
            </label>
            <Select value={shift} onValueChange={(val) => val && setShift(val)}>
              <SelectTrigger className="h-14 bg-slate-950 border-white/10 text-lg">
                <SelectValue placeholder="Pilih Shift" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-slate-100">
                {SHIFTS.map(s => (
                  <SelectItem key={s} value={s.toString()} className="text-lg py-3">Shift {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-400 flex items-center gap-2">
              <Monitor className="h-4 w-4" /> Mesin / Line
            </label>
            <Select value={machine} onValueChange={(val) => val && setMachine(val)}>
              <SelectTrigger className="h-14 bg-slate-950 border-white/10 text-lg">
                <SelectValue placeholder="Pilih Mesin" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-slate-100">
                {MACHINES.map(m => (
                  <SelectItem key={m} value={m} className="text-lg py-3">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Action */}
      <Button 
        onClick={handleStartInput}
        className="w-full h-24 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 shadow-xl shadow-blue-500/20 rounded-2xl transition-all active:scale-[0.98] group"
      >
        <PlusCircle className="mr-4 h-10 w-10 text-white group-hover:rotate-90 transition-transform duration-300" />
        INPUT PRODUKSI BARU
      </Button>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-white/10 flex flex-col items-center justify-center p-6">
          <p className="text-slate-400 text-sm mb-2">Total Hari Ini</p>
          <p className="text-4xl font-bold text-slate-50">{totalItems}</p>
        </Card>
        <Card className="bg-emerald-900/20 border-emerald-500/20 flex flex-col items-center justify-center p-6">
          <p className="text-emerald-400 text-sm mb-2 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Good (FG)
          </p>
          <p className="text-4xl font-bold text-emerald-400">{totalGood}</p>
        </Card>
        <Card className="bg-rose-900/20 border-rose-500/20 flex flex-col items-center justify-center p-6">
          <p className="text-rose-400 text-sm mb-2 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> NG (Defect)
          </p>
          <p className="text-4xl font-bold text-rose-400">{totalNG}</p>
        </Card>
      </div>
    </div>
  );
}
