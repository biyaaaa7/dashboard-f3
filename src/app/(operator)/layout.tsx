import { OperatorTopBar } from '@/components/layout/OperatorTopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['operator']}>
      <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
        {/* Background glow specific for operator */}
        <div className="absolute top-0 left-[20%] w-[60%] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <OperatorTopBar />
        <main className="flex-1 overflow-y-auto z-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
