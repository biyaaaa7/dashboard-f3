import { ManagerSidebar } from '@/components/layout/ManagerSidebar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className="flex h-screen overflow-hidden bg-slate-950">
        <ManagerSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950/50 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
