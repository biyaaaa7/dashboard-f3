'use client';

import { LogOut, UserCircle, Settings } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '../ui/button';

export function OperatorTopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-50">Digital Logbook</h1>
          <p className="text-xs text-slate-400">Production Quality Tracking</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
            <UserCircle className="h-6 w-6 text-slate-400" />
          </div>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
        <Button 
          variant="outline" 
          className="border-white/10 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-slate-300 transition-colors"
          onClick={logout}
        >
          <LogOut size={18} className="mr-2 sm:hidden md:block" />
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </header>
  );
}
