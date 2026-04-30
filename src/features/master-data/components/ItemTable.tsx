'use client';

import { useState, useEffect } from 'react';
import { MasterItem } from '@/types';
import { getMasterItems, saveMasterItems } from '@/lib/storage';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export function ItemTable() {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({ code: '', name: '', category: '', isActive: true });

  useEffect(() => {
    setItems(getMasterItems());
  }, []);

  const filteredItems = items.filter(item => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (item?: MasterItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ code: item.code, name: item.name, category: item.category, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', category: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    let newItems;
    if (editingItem) {
      newItems = items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i);
    } else {
      const newItem: MasterItem = {
        id: `itm_${Date.now()}`,
        ...formData
      };
      newItems = [newItem, ...items];
    }
    
    setItems(newItems);
    saveMasterItems(newItems);
    setIsDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    const newItems = items.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i);
    setItems(newItems);
    saveMasterItems(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Cari kode, nama, atau kategori..." 
            className="pl-9 bg-slate-900/50 border-white/10 text-slate-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item
            </Button>
          } />
          <DialogContent className="bg-slate-900 border-white/10 text-slate-50">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Tambah Item Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Kode Item</Label>
                <Input 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: BRK-001"
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Item</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: Bracket Utama"
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori Produksi</Label>
                <Input 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: Stamping"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500">
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-400">Kode</TableHead>
              <TableHead className="text-slate-400">Nama Item</TableHead>
              <TableHead className="text-slate-400">Kategori</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-slate-200">{item.code}</TableCell>
                  <TableCell className="text-slate-300">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-800 text-slate-500 hover:bg-slate-700 border-0">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                        onClick={() => handleOpenDialog(item)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${item.isActive ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-400/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                        onClick={() => toggleStatus(item.id)}
                        title={item.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {item.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
