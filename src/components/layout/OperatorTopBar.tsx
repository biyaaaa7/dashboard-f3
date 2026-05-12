'use client';

import { LogOut, UserCircle, Settings, MonitorCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '../ui/button';
import Image from 'next/image';

export function OperatorTopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-white/40 bg-white/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_4px_24px_rgba(80,140,180,0.04)]">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 relative overflow-hidden shrink-0">
          <Image src="/logo_dnp.png" alt="DNP" fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#123047]">DNP Monitoring Produksi</h1>
          <p className="text-xs text-[#4f6b81]">Production Monitoring System</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#123047]">{user?.name}</p>
            <p className="text-xs text-[#7b93a8] capitalize">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/60 border border-white/50 flex items-center justify-center shadow-sm">
            <UserCircle className="h-6 w-6 text-[#7b93a8]" />
          </div>
        </div>
        <div className="w-px h-8 bg-white/40 hidden sm:block"></div>
        <Button 
          variant="outline" 
          className="border-white/50 bg-white/40 hover:bg-rose-50 hover:text-rose-600 hover:border-white/50 text-[#4f6b81] transition-colors shadow-sm rounded-[14px]"
          onClick={logout}
        >
          <LogOut size={18} className="mr-2 sm:hidden md:block" />
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </header>
  );
}
