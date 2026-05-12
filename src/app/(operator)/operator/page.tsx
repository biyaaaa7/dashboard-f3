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
      <Card className="bg-white/60 border-white/40 backdrop-blur-xl text-[#0f172a] shadow-sm">
        <CardHeader className="pb-4 border-b border-white/40">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5cc8ff]/20 text-[#5cc8ff] text-sm"><Monitor className="h-4 w-4" /></span>
            Setup Sesi Kerja
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-[#4f6b81] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7b93a8]" /> Shift Saat Ini
            </label>
            <Select value={shift} onValueChange={(val) => val && setShift(val)}>
              <SelectTrigger className="h-14 bg-white/50 border-white/40 text-lg text-[#0f172a] rounded-[14px]">
                <SelectValue placeholder="Pilih Shift" />
              </SelectTrigger>
              <SelectContent className="bg-white border-white/40 text-[#0f172a] rounded-xl shadow-lg">
                {SHIFTS.map(s => (
                  <SelectItem key={s} value={s.toString()} className="text-lg py-3 text-[#4f6b81] hover:bg-[#aff0fa]/30">Shift {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-[#4f6b81] flex items-center gap-2">
              <Monitor className="h-4 w-4 text-[#7b93a8]" /> Mesin / Line
            </label>
            <Select value={machine} onValueChange={(val) => val && setMachine(val)}>
              <SelectTrigger className="h-14 bg-white/50 border-white/40 text-lg text-[#0f172a] rounded-[14px]">
                <SelectValue placeholder="Pilih Mesin" />
              </SelectTrigger>
              <SelectContent className="bg-white border-white/40 text-[#0f172a] rounded-xl shadow-lg">
                {MACHINES.map(m => (
                  <SelectItem key={m} value={m} className="text-lg py-3 text-[#4f6b81] hover:bg-[#aff0fa]/30">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Action */}
      <Button 
        onClick={handleStartInput}
        className="w-full h-24 text-2xl font-bold bg-gradient-to-r from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 border-0 shadow-[0_8px_24px_rgba(80,140,180,0.2)] rounded-[20px] transition-all active:scale-[0.98] group text-white"
      >
        <PlusCircle className="mr-4 h-10 w-10 text-white group-hover:rotate-90 transition-transform duration-300" />
        INPUT PRODUKSI BARU
      </Button>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/60 border-white/40 shadow-sm flex flex-col items-center justify-center p-6">
          <p className="text-[#7b93a8] text-sm mb-2">Total Hari Ini</p>
          <p className="text-4xl font-bold text-[#123047]">{totalItems}</p>
        </Card>
        <Card className="bg-[#4cc9a6]/10 border-[#4cc9a6]/20 shadow-sm flex flex-col items-center justify-center p-6">
          <p className="text-[#2ca582] text-sm mb-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-4 w-4" /> Good (FG)
          </p>
          <p className="text-4xl font-bold text-[#2ca582]">{totalGood}</p>
        </Card>
        <Card className="bg-[#ff7f96]/10 border-[#ff7f96]/20 shadow-sm flex flex-col items-center justify-center p-6">
          <p className="text-[#e0566e] text-sm mb-2 flex items-center gap-1 font-medium">
            <AlertTriangle className="h-4 w-4" /> NG (Defect)
          </p>
          <p className="text-4xl font-bold text-[#e0566e]">{totalNG}</p>
        </Card>
      </div>
    </div>
  );
}
