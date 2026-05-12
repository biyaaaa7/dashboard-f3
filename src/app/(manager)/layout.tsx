import { ManagerSidebar } from '@/components/layout/ManagerSidebar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className="flex h-screen overflow-hidden bg-background">
        <ManagerSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Subtle soft white background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
