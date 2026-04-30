'use client';

import { AlertTriangle } from 'lucide-react';
import { DefectTable } from '@/features/admin/components/DefectTable';

export default function DefectsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Kategori NG (Defects)</h1>
          <p className="text-slate-400 text-sm">Kelola daftar jenis barang NG yang dapat dipilih oleh operator.</p>
        </div>
      </div>

      <DefectTable />
    </div>
  );
}
