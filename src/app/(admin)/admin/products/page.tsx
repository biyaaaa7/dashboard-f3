'use client';

import { Database } from 'lucide-react';
import { ItemTable } from '@/features/master-data/components/ItemTable';

export default function ProductsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#5cc8ff]/20 flex items-center justify-center">
          <Database className="h-5 w-5 text-[#5cc8ff]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#123047]">Master Data Produk</h1>
          <p className="text-[#4f6b81] text-sm">Kelola "Kamus Barang" yang akan dipilih oleh operator saat input produksi</p>
        </div>
      </div>

      <ItemTable />
    </div>
  );
}
