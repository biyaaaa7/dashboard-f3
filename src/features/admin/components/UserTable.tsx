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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b93a8]" />
          <Input 
            placeholder="Cari username, nama, role..." 
            className="pl-9 bg-white/60 border-white/40 text-[#0f172a] placeholder:text-[#7b93a8] shadow-sm rounded-xl focus-visible:ring-[#5cc8ff]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 text-white shadow-sm rounded-xl border-none">
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          } />
          <DialogContent className="bg-white/90 backdrop-blur-xl border-white/40 text-[#0f172a] shadow-lg rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-[#123047]">{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Username (Untuk Login)</Label>
                <Input 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: operator2"
                  disabled={!!editingUser} // Disable changing username if editing
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Nama Lengkap</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="Misal: Joko Widodo"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">Role</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-[14px] border border-white/40 bg-white/60 px-3 py-2 text-sm text-[#123047] ring-offset-background placeholder:text-[#7b93a8] focus:outline-none focus:ring-2 focus:ring-[#5cc8ff] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="operator">Operator (Input Data)</option>
                  <option value="manager">Manager (View Reports)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#4f6b81]">PIN (Default: 1234)</Label>
                <Input 
                  value={formData.pin} 
                  onChange={e => setFormData({...formData, pin: e.target.value})}
                  className="bg-white/60 border-white/40 text-[#123047] rounded-xl focus-visible:ring-[#5cc8ff]"
                  placeholder="1234"
                  type="text"
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
              <TableHead className="text-[#4f6b81]">Username</TableHead>
              <TableHead className="text-[#4f6b81]">Nama</TableHead>
              <TableHead className="text-[#4f6b81]">Role</TableHead>
              <TableHead className="text-[#4f6b81]">PIN</TableHead>
              <TableHead className="text-right text-[#4f6b81]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-white/40 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-[#7b93a8]">
                  Tidak ada user ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id} className="border-white/40 hover:bg-white/40 transition-colors">
                  <TableCell className="font-medium text-[#123047]">{u.username}</TableCell>
                  <TableCell className="text-[#4f6b81]">{u.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${
                      u.role === 'admin' ? 'bg-[#5cc8ff]/20 text-[#123047]' :
                      u.role === 'manager' ? 'bg-[#5cc8ff]/10 text-[#4f6b81]' :
                      'bg-[#4cc9a6]/10 text-[#2ca582]'
                    }`}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#7b93a8] font-mono">
                    {u.pin || '1234'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#7b93a8] hover:text-[#5cc8ff] hover:bg-[#5cc8ff]/10 rounded-lg"
                        onClick={() => handleOpenDialog(u)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#7b93a8] hover:text-[#e0566e] hover:bg-[#ff7f96]/10 rounded-lg"
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
