'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  AlertTriangle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: ShieldAlert },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Products', href: '/admin/products', icon: Database },
  { name: 'NG Categories', href: '/admin/defects', icon: AlertTriangle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-slate-900 border-r border-white/5 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            Admin
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-slate-400 hover:text-slate-50", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                  isActive 
                    ? "bg-purple-600/10 text-purple-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-50"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0", 
                  isActive ? "text-purple-400" : "text-slate-400 group-hover:text-slate-50",
                  collapsed ? "mr-0 mx-auto" : "mr-3"
                )} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "flex items-center mb-4",
          collapsed ? "justify-center" : ""
        )}>
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
            <UserCircle className="h-5 w-5 text-slate-400" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button 
          variant="destructive" 
          className={cn("w-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-0", collapsed && "px-0")}
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className={cn(!collapsed && "mr-2")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
