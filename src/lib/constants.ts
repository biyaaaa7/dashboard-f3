import { MasterItem, DefectCategoryModel, User } from '@/types';

export const SHIFTS = [1, 2, 3] as const;

export const MACHINES = [
  'Assembling-A', 'Assembling-B', 'Assembling-C', 'Assembling-D'
];

export const INITIAL_DEFECT_CATEGORIES: DefectCategoryModel[] = [
  { id: 'penyok', label: 'Penyok', isActive: true },
  { id: 'baret', label: 'Baret', isActive: true },
  { id: 'tajam', label: 'Tajam', isActive: true },
  { id: 'crack', label: 'Crack', isActive: true },
  { id: 'dimensi', label: 'Dimensi', isActive: true },
  { id: 'lainnya', label: 'Lainnya', isActive: true },
];

export const INITIAL_USERS: User[] = [
  { id: 'u0', username: 'admin', name: 'Super Admin', role: 'admin', pin: '1234' },
  { id: 'u1', username: 'operator1', name: 'Budi (Operator)', role: 'operator', pin: '1234' },
  { id: 'u2', username: 'manager1', name: 'Andi (Manager)', role: 'manager', pin: '1234' },
];

export const INITIAL_MOCK_ITEMS: MasterItem[] = [
  { id: '1', code: 'FGO1180-00G', name: '15400RK9F01 OES', category: 'Assembling', isActive: true },
  { id: '2', code: 'FGO2130-00I', name: '375914103002 FUEL FILTER 4668', category: 'Assembling', isActive: true },
  { id: '3', code: 'FGO1528-00I', name: '375934101001 FUEL FILTER 1290', category: 'Assembling', isActive: true },
  { id: '4', code: 'FGO1525-00I', name: '374944100001 OIL FILTER 11930', category: 'Assembling', isActive: true },
  { id: '5', code: 'FGO3156-00I', name: '4393190000 OIL FILTER SPIN ON', category: 'Assembling', isActive: true },
  { id: '6', code: 'FGO3076-00I', name: '4393160000 OIL FILTER SPINON', category: 'Assembling', isActive: true },
  { id: '7', code: 'FGO1643-00G', name: '6002116243 KMSI', category: 'Assembling', isActive: true },
  { id: '8', code: 'FGO1314-00G', name: 'ME 035829', category: 'Assembling', isActive: true },
  { id: '9', code: 'FGO2800-00G', name: '23401LBE40 FUEL FILTER SPIN O', category: 'Assembling', isActive: true },
  { id: '10', code: 'FGO0488-00I', name: '375906101002 FUEL FILTER 1198', category: 'Assembling', isActive: true },
  { id: '11', code: 'FGO0480-00I', name: '375906004062 FUEL FILTER 1198', category: 'Assembling', isActive: true },
  { id: '12', code: 'FGO0734-00I', name: '374906004061 FUEL FILTER 1294', category: 'Assembling', isActive: true },
  { id: '13', code: 'FGO1529-00I', name: '375935101001 FUEL FILTER 1299', category: 'Assembling', isActive: true },
];
