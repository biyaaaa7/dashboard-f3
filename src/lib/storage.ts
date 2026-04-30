import { MasterItem, ProductionRecord, HistoryLog, User, DefectCategoryModel } from '@/types';
import { INITIAL_MOCK_ITEMS, INITIAL_USERS, INITIAL_DEFECT_CATEGORIES } from './constants';

const STORAGE_KEYS = {
  ITEMS: 'dl_master_items',
  RECORDS: 'dl_production_records',
  HISTORY: 'dl_history_logs',
  USERS: 'dl_users',
  DEFECTS: 'dl_defect_categories',
};

// --- Users ---

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// --- Defect Categories ---

export const getDefectCategories = (): DefectCategoryModel[] => {
  if (typeof window === 'undefined') return INITIAL_DEFECT_CATEGORIES;
  const stored = localStorage.getItem(STORAGE_KEYS.DEFECTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.DEFECTS, JSON.stringify(INITIAL_DEFECT_CATEGORIES));
    return INITIAL_DEFECT_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const saveDefectCategories = (categories: DefectCategoryModel[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DEFECTS, JSON.stringify(categories));
};

// --- Master Items ---

export const getMasterItems = (): MasterItem[] => {
  if (typeof window === 'undefined') return INITIAL_MOCK_ITEMS;
  const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_MOCK_ITEMS));
    return INITIAL_MOCK_ITEMS;
  }
  return JSON.parse(stored);
};

export const saveMasterItems = (items: MasterItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};

// --- Production Records ---

export const getProductionRecords = (): ProductionRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return stored ? JSON.parse(stored) : [];
};

export const saveProductionRecords = (records: ProductionRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
};

export const addProductionRecord = (record: Omit<ProductionRecord, 'id' | 'createdAt'>) => {
  const records = getProductionRecords();
  const newRecord: ProductionRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  saveProductionRecords([...records, newRecord]);
  
  // Log history
  addHistoryLog({
    userId: record.createdBy,
    action: 'create',
    recordId: newRecord.id,
  });
  
  return newRecord;
};

// --- History Logs ---

export const getHistoryLogs = (): HistoryLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return stored ? JSON.parse(stored) : [];
};

export const addHistoryLog = (log: Omit<HistoryLog, 'id' | 'timestamp'>) => {
  const logs = getHistoryLogs();
  const newLog: HistoryLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([newLog, ...logs]));
  }
};
