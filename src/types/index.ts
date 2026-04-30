export type Role = 'operator' | 'manager' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  pin?: string; // Stored in DB
}

export interface MasterItem {
  id: string;
  code: string;       // e.g. "ITM-001"
  name: string;       // e.g. "Bracket A"
  category: string;   // e.g. "Stamping"
  isActive: boolean;
}

export interface DefectCategoryModel {
  id: string;
  label: string;
  isActive: boolean;
}

export type DefectCategory = string; // Now dynamic based on ID

export interface DefectEntry {
  category: DefectCategory;
  quantity: number;
}

export interface ProductionRecord {
  id: string;
  date: string;         // ISO date
  shift: 1 | 2 | 3;
  machineId: string;    // "M-01"
  itemId: string;       // ref to MasterItem.id
  goodQty: number;
  defects: DefectEntry[];
  totalNG: number;      // auto-calc sum of defects
  totalProduction: number; // goodQty + totalNG
  notes?: string;
  createdBy: string;    // user id
  createdAt: string;    // ISO datetime
  updatedBy?: string;
  updatedAt?: string;
}

export interface HistoryLog {
  id: string;
  timestamp: string;
  userId: string;
  action: 'create' | 'edit' | 'delete';
  recordId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}
