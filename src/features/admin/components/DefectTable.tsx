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
            <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          } />
          <DialogContent className="bg-slate-900 border-white/10 text-slate-50">
            <DialogHeader>
              <DialogTitle>{editingDefect ? 'Edit Kategori' : 'Tambah Kategori NG'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Kategori (Label)</Label>
                <Input 
                  value={formData.label} 
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: Karat, Patah"
                />
                <p className="text-xs text-slate-500">ID unik akan digenerate otomatis berdasarkan nama.</p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500">
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
              <TableHead className="text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nama (Label)</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defects.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Tidak ada kategori ditemukan
                </TableCell>
              </TableRow>
            ) : (
              defects.map((d) => (
                <TableRow key={d.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="text-slate-500 font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium text-slate-200">{d.label}</TableCell>
                  <TableCell>
                    {d.isActive ? (
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
                        onClick={() => handleOpenDialog(d)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${d.isActive ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                        onClick={() => toggleStatus(d.id)}
                        title={d.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {d.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
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
