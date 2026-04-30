'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUsers, saveUsers } from '@/lib/storage';
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
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<User, 'id'>>({ username: '', name: '', role: 'operator', pin: '' });

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, name: user.name, role: user.role, pin: user.pin || '1234' });
    } else {
      setEditingUser(null);
      setFormData({ username: '', name: '', role: 'operator', pin: '1234' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.username || !formData.name || !formData.pin) {
      alert("Semua field harus diisi");
      return;
    }

    let newUsers;
    if (editingUser) {
      newUsers = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
    } else {
      // Check if username exists
      if (users.find(u => u.username === formData.username)) {
        alert("Username sudah digunakan");
        return;
      }
      const newUser: User = {
        id: `u_${Date.now()}`,
        ...formData
      };
      newUsers = [...users, newUser];
    }
    
    setUsers(newUsers);
    saveUsers(newUsers);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      saveUsers(newUsers);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Cari username, nama, role..." 
            className="pl-9 bg-slate-900/50 border-white/10 text-slate-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          } />
          <DialogContent className="bg-slate-900 border-white/10 text-slate-50">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Username (Untuk Login)</Label>
                <Input 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: operator2"
                  disabled={!!editingUser} // Disable changing username if editing
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="Misal: Joko Widodo"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="operator">Operator (Input Data)</option>
                  <option value="manager">Manager (View Reports)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>PIN (Default: 1234)</Label>
                <Input 
                  value={formData.pin} 
                  onChange={e => setFormData({...formData, pin: e.target.value})}
                  className="bg-slate-950 border-white/10"
                  placeholder="1234"
                  type="text"
                />
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
              <TableHead className="text-slate-400">Username</TableHead>
              <TableHead className="text-slate-400">Nama</TableHead>
              <TableHead className="text-slate-400">Role</TableHead>
              <TableHead className="text-slate-400">PIN</TableHead>
              <TableHead className="text-right text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Tidak ada user ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-slate-200">{u.username}</TableCell>
                  <TableCell className="text-slate-300">{u.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${
                      u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                      u.role === 'manager' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono">
                    {u.pin || '1234'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                        onClick={() => handleOpenDialog(u)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
                        onClick={() => handleDelete(u.id)}
                        title="Hapus User"
                        disabled={u.username === 'admin'} // Cannot delete super admin
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
