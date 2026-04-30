'use client';

import { Database } from 'lucide-react';
import { ItemTable } from '@/features/master-data/components/ItemTable';

export default function ProductsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Database className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Master Data Produk</h1>
          <p className="text-slate-400 text-sm">Kelola "Kamus Barang" yang akan dipilih oleh operator saat input produksi</p>
        </div>
      </div>

      <ItemTable />
    </div>
  );
}
