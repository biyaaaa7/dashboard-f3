'use client';

import { Users } from 'lucide-react';
import { UserTable } from '@/features/admin/components/UserTable';

export default function UsersPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#5cc8ff]/20 flex items-center justify-center">
          <Users className="h-5 w-5 text-[#5cc8ff]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#123047]">User Management</h1>
          <p className="text-[#4f6b81] text-sm">Kelola akses operator, manager, dan admin.</p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
