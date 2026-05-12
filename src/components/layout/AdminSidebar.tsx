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
import Image from 'next/image';

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
        "flex flex-col h-screen bg-white/60 backdrop-blur-md border-r border-white/40 transition-all duration-300 shadow-[4px_0_24px_rgba(80,140,180,0.04)]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/40">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 relative shrink-0">
              <Image src="/logo_dnp.png" alt="DNP" fill className="object-contain" />
            </div>
            <span className="text-lg font-bold text-[#123047] truncate">
              Admin Panel
            </span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-[#7b93a8] hover:text-[#123047] hover:bg-white/40", collapsed && "mx-auto")}
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
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-[14px] transition-colors group",
                  isActive 
                    ? "bg-white/50 text-[#123047] shadow-sm border border-white/40" 
                    : "text-[#4f6b81] hover:bg-white/40 hover:text-[#123047]"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0", 
                  isActive ? "text-[#5cc8ff]" : "text-[#7b93a8] group-hover:text-[#5cc8ff]",
                  collapsed ? "mr-0 mx-auto" : "mr-3"
                )} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/40">
        <div className={cn(
          "flex items-center mb-4",
          collapsed ? "justify-center" : ""
        )}>
          <div className="h-10 w-10 rounded-full bg-white/60 border border-white/50 flex items-center justify-center shrink-0 shadow-sm">
            <UserCircle className="h-6 w-6 text-[#7b93a8]" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-[#123047] truncate">{user?.name}</p>
              <p className="text-xs text-[#7b93a8] truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className={cn("w-full bg-white/40 hover:bg-rose-50 border-white/50 text-rose-500 hover:text-rose-600 shadow-sm rounded-[14px]", collapsed && "px-0")}
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
