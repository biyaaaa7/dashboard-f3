'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MasterItem, DefectCategory, DefectEntry } from '@/types';
import { getMasterItems, addProductionRecord, getDefectCategories } from '@/lib/storage';
import { useAuth } from '@/features/auth/auth-context';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, ChevronLeft, Save } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { DefectCategoryModel } from '@/types';

export function ProductionInputForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Session data
  const [shift, setShift] = useState<number>(1);
  const [machineId, setMachineId] = useState<string>('');
  
  // Form Data
  const [items, setItems] = useState<MasterItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [activeDefects, setActiveDefects] = useState<DefectCategoryModel[]>([]);
  
  const [goodQty, setGoodQty] = useState<number | ''>('');
  const [defects, setDefects] = useState<Record<DefectCategory, number>>({});
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load active items
    const allItems = getMasterItems();
    setItems(allItems.filter(i => i.isActive));
    
    // Load active defects
    const allDefects = getDefectCategories();
    const activeDefs = allDefects.filter(d => d.isActive);
    setActiveDefects(activeDefs);
    
    // Initialize defects state dynamically
    const initialDefects: Record<string, number> = {};
    activeDefs.forEach(d => {
      initialDefects[d.id] = 0;
    });
    setDefects(initialDefects);
    
    // Load session info
    const session = localStorage.getItem('current_session');
    if (session) {
      const parsed = JSON.parse(session);
      setShift(parsed.shift);
      setMachineId(parsed.machineId);
    } else {
      // If no session, go back
      router.push('/operator');
    }
  }, [router]);

  const handleDefectChange = (category: DefectCategory, value: string) => {
    const num = parseInt(value);
    setDefects(prev => ({
      ...prev,
      [category]: isNaN(num) ? 0 : num
    }));
  };

  const totalNG = Object.values(defects).reduce((acc, curr) => acc + curr, 0);
  const totalProduction = (typeof goodQty === 'number' ? goodQty : 0) + totalNG;

  const handleSubmit = async () => {
    if (!selectedItem) {
      alert("Pilih Item terlebih dahulu");
      return;
    }
    
    if (goodQty === '' && totalNG === 0) {
      alert("Masukkan minimal 1 data produksi (Good atau NG)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform defects object to array
      const defectEntries: DefectEntry[] = Object.entries(defects)
        .filter(([_, qty]) => qty > 0)
        .map(([cat, qty]) => ({ category: cat as DefectCategory, quantity: qty }));

      addProductionRecord({
        date: new Date().toISOString(), // In real app, might just be YYYY-MM-DD based on shift logical date
        shift: shift as 1|2|3,
        machineId,
        itemId: selectedItem.id,
        goodQty: typeof goodQty === 'number' ? goodQty : 0,
        defects: defectEntries,
        totalNG,
        totalProduction,
        notes,
        createdBy: user?.id || 'unknown',
      });
      
      // Show success, wait briefly, go back
      setTimeout(() => {
        router.push('/operator');
      }, 800);
      
    } catch (e) {
      alert("Gagal menyimpan data");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-white/40 backdrop-blur-md shadow-sm">
        <Button variant="ghost" className="text-[#4f6b81] hover:text-[#123047] hover:bg-white/40" onClick={() => router.push('/operator')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Batal
        </Button>
        <div className="text-right">
          <p className="text-sm text-[#7b93a8]">Shift {shift}</p>
          <p className="text-lg font-bold text-[#123047]">{machineId}</p>
        </div>
      </div>

      {/* 1. Pilih Item */}
      <Card className="bg-white/60 border-white/40 backdrop-blur-xl text-[#0f172a] shadow-sm overflow-visible">
        <CardHeader className="pb-4 border-b border-white/40">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5cc8ff]/20 text-[#5cc8ff] text-sm">1</span>
            Pilih Item Produksi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger render={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className={cn(
                  "w-full h-14 justify-between bg-white/50 border-white/40 text-lg hover:bg-white/60 hover:text-[#123047]",
                  !selectedItem && "text-[#7b93a8]"
                )}
              >
                {selectedItem 
                  ? `${selectedItem.code} — ${selectedItem.name}`
                  : "Cari kode atau nama item..."}
              </Button>
            } />
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-white/40 shadow-lg rounded-xl" align="start">
              <Command className="bg-transparent text-[#0f172a]">
                <CommandInput placeholder="Ketik nama / kode item..." className="text-[#0f172a] placeholder:text-[#7b93a8]" />
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-[#7b93a8]">Item tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.code} ${item.name}`}
                        onSelect={() => {
                          setSelectedItem(item);
                          setOpenCombobox(false);
                        }}
                        className="text-[#4f6b81] hover:bg-[#aff0fa]/30 cursor-pointer py-3"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[#5cc8ff]">{item.code}</span>
                          <span className="text-[#123047]">{item.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedItem && (
            <div className="mt-4 p-4 rounded-xl bg-[#5cc8ff]/10 border border-[#5cc8ff]/20 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs text-[#5cc8ff] font-medium">Kategori: {selectedItem.category}</p>
                <p className="font-medium text-[#123047]">{selectedItem.name}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-[#5cc8ff]" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Input Hasil */}
      <div className={cn("transition-all duration-500", selectedItem ? "opacity-100" : "opacity-50 pointer-events-none")}>
        <Card className="bg-white/60 border-white/40 backdrop-blur-xl text-[#0f172a] shadow-sm">
          <CardHeader className="pb-4 border-b border-white/40">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5cc8ff]/20 text-[#5cc8ff] text-sm">2</span>
              Input Hasil
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            
            {/* GOOD Input */}
            <div className="space-y-3 bg-[#4cc9a6]/10 p-6 rounded-2xl border border-[#4cc9a6]/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4cc9a6]/10 rounded-bl-[100px] pointer-events-none" />
              <Label className="text-[#2ca582] text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Barang OK (FG)
              </Label>
              <Input 
                type="number"
                min="0"
                value={goodQty}
                onChange={e => setGoodQty(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="h-20 text-center text-4xl font-bold bg-white/60 border-[#4cc9a6]/30 text-[#2ca582] focus-visible:ring-[#4cc9a6] shadow-sm rounded-xl"
                placeholder="0"
              />
            </div>

            {/* NG Input */}
            <div className="space-y-4 bg-[#ff7f96]/10 p-6 rounded-2xl border border-[#ff7f96]/20 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-[#e0566e] text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Barang NG (Defect)
                </Label>
                <span className="text-2xl font-bold text-[#e0566e]">{totalNG}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activeDefects.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <Label className="text-[#4f6b81] text-xs uppercase tracking-wider">{cat.label}</Label>
                    <div className="flex items-center shadow-sm rounded-lg overflow-hidden">
                      <Button 
                        type="button"
                        variant="outline"
                        className="h-12 w-12 rounded-none border-white/40 bg-white/60 text-[#4f6b81] hover:bg-[#ff7f96]/10 hover:text-[#e0566e]"
                        onClick={() => handleDefectChange(cat.id, Math.max(0, (defects[cat.id] || 0) - 1).toString())}
                      >-</Button>
                      <Input
                        type="number"
                        min="0"
                        value={defects[cat.id] || ''}
                        onChange={(e) => handleDefectChange(cat.id, e.target.value)}
                        className="h-12 text-center text-lg font-medium bg-white/50 border-y-white/40 border-x-0 rounded-none text-[#e0566e] focus-visible:ring-0"
                        placeholder="0"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        className="h-12 w-12 rounded-none border-white/40 bg-white/60 text-[#4f6b81] hover:bg-[#ff7f96]/10 hover:text-[#e0566e]"
                        onClick={() => handleDefectChange(cat.id, ((defects[cat.id] || 0) + 1).toString())}
                      >+</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label className="text-[#4f6b81]">Catatan (Opsional)</Label>
              <Textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tambah keterangan jika diperlukan..."
                className="bg-white/50 border-white/40 min-h-[100px] text-[#0f172a] placeholder:text-[#7b93a8] rounded-xl shadow-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-white/40 p-6 border-t border-white/40 flex items-center justify-between">
            <div className="text-[#4f6b81]">
              Total Produksi: <strong className="text-[#123047] text-xl ml-2">{totalProduction}</strong>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !selectedItem || (goodQty === '' && totalNG === 0)}
              className="bg-gradient-to-br from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 h-14 px-8 text-lg rounded-[16px] shadow-[0_4px_14px_rgba(92,200,255,0.4)] text-white border-none"
            >
              {isSubmitting ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Simpan Data
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
