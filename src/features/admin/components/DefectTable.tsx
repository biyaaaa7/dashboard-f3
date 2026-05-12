'use client';

import { useState, useEffect } from 'react';
import { DefectCategoryModel } from '@/types';
import { getDefectCategories, saveDefectCategories } from '@/lib/storage';
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
import { Plus, Edit2, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export function DefectTable() {
  const [defects, setDefects] = useState<DefectCategoryModel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState<DefectCategoryModel | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<DefectCategoryModel, 'id'>>({ label: '', isActive: true });

  useEffect(() => {
    setDefects(getDefectCategories());
  }, []);

  const handleOpenDialog = (defect?: DefectCategoryModel) => {
    if (defect) {
      setEditingDefect(defect);
      setFormData({ label: defect.label, isActive: defect.isActive });
    } else {
      setEditingDefect(null);
      setFormData({ label: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.label) {
      alert("Nama kategori harus diisi");
      return;
    }

    let newDefects;
    if (editingDefect) {
      newDefects = defects.map(d => d.id === editingDefect.id ? { ...d, ...formData } : d);
    } else {
      // Create ID from label (lowercase, remove spaces)
      const id = formData.label.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (defects.find(d => d.id === id)) {
        alert("Kategori dengan nama mirip sudah ada");
        return;
      }
      const newDefect: DefectCategoryModel = {
        id,
        ...formData
      };
      newDefects = [...defects, newDefect];
    }
    
    setDefects(newDefects);
    saveDefectCategories(newDefects);
    setIsDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    const newDefects = defects.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d);
    setDefects(newDefects);
    saveDefectCategories(newDefects);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Data historis mungkin akan kehilangan referensi nama.')) {
      const newDefects = defects.filter(d => d.id !== id);
      setDefects(newDefects);
      saveDefectCategories(newDefects);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 text-white shadow-sm rounded-xl border-none">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          } />
          <DialogContent className="bg-white/90 backdrop-blur-xl border-white/40 text-[#0f172a] shadow-lg rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-[#123047]">{editingDefect ? 'Edit Kategori' : 'Tambah Kategori NG'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Nama Kategori (Label)</Label>
                <Input 
                  value={formData.label} 
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: Karat, Patah"
                />
                <p className="text-xs text-[#7b93a8]">ID unik akan digenerate otomatis berdasarkan nama.</p>
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
              <TableHead className="text-[#4f6b81]">ID</TableHead>
              <TableHead className="text-[#4f6b81]">Nama (Label)</TableHead>
              <TableHead className="text-[#4f6b81]">Status</TableHead>
              <TableHead className="text-right text-[#4f6b81]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defects.length === 0 ? (
              <TableRow className="border-white/40 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-[#7b93a8]">
                  Tidak ada kategori ditemukan
                </TableCell>
              </TableRow>
            ) : (
              defects.map((d) => (
                <TableRow key={d.id} className="border-white/40 hover:bg-white/40 transition-colors">
                  <TableCell className="text-[#7b93a8] font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium text-[#123047]">{d.label}</TableCell>
                  <TableCell>
                    {d.isActive ? (
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
                        onClick={() => handleOpenDialog(d)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-lg ${d.isActive ? 'text-[#7b93a8] hover:text-[#e0566e] hover:bg-[#ff7f96]/10' : 'text-[#7b93a8] hover:text-[#2ca582] hover:bg-[#4cc9a6]/10'}`}
                        onClick={() => toggleStatus(d.id)}
                        title={d.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {d.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#7b93a8] hover:text-[#e0566e] hover:bg-[#ff7f96]/10 rounded-lg"
                        onClick={() => handleDelete(d.id)}
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
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
