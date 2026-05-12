'use client';

import { AlertTriangle } from 'lucide-react';
import { DefectTable } from '@/features/admin/components/DefectTable';

export default function DefectsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#ff7f96]/20 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-[#ff7f96]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#123047]">Kategori NG (Defects)</h1>
          <p className="text-[#4f6b81] text-sm">Kelola daftar jenis barang NG yang dapat dipilih oleh operator.</p>
        </div>
      </div>

      <DefectTable />
    </div>
  );
}
