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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b93a8]" />
          <Input 
            placeholder="Cari kode, nama, atau kategori..." 
            className="pl-9 bg-white/60 border-white/40 text-[#0f172a] placeholder:text-[#7b93a8] shadow-sm rounded-xl focus-visible:ring-[#5cc8ff]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 text-white shadow-sm rounded-xl border-none">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item
            </Button>
          } />
          <DialogContent className="bg-white/90 backdrop-blur-xl border-white/40 text-[#0f172a] shadow-lg rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-[#123047]">{editingItem ? 'Edit Item' : 'Tambah Item Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Kode Item</Label>
                <Input 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: BRK-001"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Nama Item</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: Bracket Utama"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Kategori Produksi</Label>
                <Input 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: Stamping"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-[#aff0fa]/30 text-[#4f6b81] rounded-xl">
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-[#5cc8ff] hover:bg-[#4da8ff] text-white rounded-xl shadow-sm border-none">
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-white/40 bg-white/60 backdrop-blur-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-white/50">
            <TableRow className="border-white/40 hover:bg-transparent">
              <TableHead className="text-[#4f6b81]">Kode</TableHead>
              <TableHead className="text-[#4f6b81]">Nama Item</TableHead>
              <TableHead className="text-[#4f6b81]">Kategori</TableHead>
              <TableHead className="text-[#4f6b81]">Status</TableHead>
              <TableHead className="text-right text-[#4f6b81]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow className="border-white/40 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-[#7b93a8]">
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="border-white/40 hover:bg-white/40 transition-colors">
                  <TableCell className="font-medium text-[#123047]">{item.code}</TableCell>
                  <TableCell className="text-[#4f6b81]">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white/50 border-[#5cc8ff]/30 text-[#4f6b81]">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <Badge className="bg-[#4cc9a6]/10 text-[#2ca582] hover:bg-[#4cc9a6]/20 border-0">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-white/50 text-[#7b93a8] hover:bg-white/60 border-0">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#7b93a8] hover:text-[#5cc8ff] hover:bg-[#5cc8ff]/10 rounded-lg"
                        onClick={() => handleOpenDialog(item)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-lg ${item.isActive ? 'text-[#7b93a8] hover:text-[#e0566e] hover:bg-[#ff7f96]/10' : 'text-[#7b93a8] hover:text-[#2ca582] hover:bg-[#4cc9a6]/10'}`}
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
