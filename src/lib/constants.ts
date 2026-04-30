import { MasterItem, DefectCategoryModel, User } from '@/types';

export const SHIFTS = [1, 2, 3] as const;

export const MACHINES = [
  'M-01', 'M-02', 'M-03', 'M-04', 'M-05',
  'M-06', 'M-07', 'M-08', 'M-09', 'M-10'
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
  { id: '1', code: 'BRK-A-001', name: 'Bracket Utama A', category: 'Stamping', isActive: true },
  { id: '2', code: 'BRK-B-002', name: 'Bracket Samping B', category: 'Stamping', isActive: true },
  { id: '3', code: 'HNG-001', name: 'Hinge Door Left', category: 'Assembly', isActive: true },
  { id: '4', code: 'HNG-002', name: 'Hinge Door Right', category: 'Assembly', isActive: true },
  { id: '5', code: 'PNL-F-101', name: 'Panel Front Cover', category: 'Press', isActive: true },
  { id: '6', code: 'PNL-B-102', name: 'Panel Back Cover', category: 'Press', isActive: true },
  { id: '7', code: 'SPR-01', name: 'Spring Tension A', category: 'Wire', isActive: true },
  { id: '8', code: 'SPR-02', name: 'Spring Compression B', category: 'Wire', isActive: true },
  { id: '9', code: 'MNT-A1', name: 'Mounting Engine Left', category: 'Casting', isActive: true },
  { id: '10', code: 'MNT-A2', name: 'Mounting Engine Right', category: 'Casting', isActive: true },
  { id: '11', code: 'WSH-05', name: 'Washer Flat M5', category: 'Fastener', isActive: true },
  { id: '12', code: 'WSH-08', name: 'Washer Spring M8', category: 'Fastener', isActive: true },
  { id: '13', code: 'BLT-10', name: 'Bolt Hex M10x40', category: 'Fastener', isActive: true },
  { id: '14', code: 'NT-10', name: 'Nut Flange M10', category: 'Fastener', isActive: true },
  { id: '15', code: 'CBR-100', name: 'Crossbar Front', category: 'Welding', isActive: true },
  { id: '16', code: 'CBR-200', name: 'Crossbar Rear', category: 'Welding', isActive: true },
  { id: '17', code: 'PLT-Base', name: 'Base Plate Master', category: 'Cutting', isActive: true },
  { id: '18', code: 'CVR-Top', name: 'Top Cover Shield', category: 'Press', isActive: true },
  { id: '19', code: 'CVR-Bot', name: 'Bottom Shield Plate', category: 'Press', isActive: true },
  { id: '20', code: 'GUS-L', name: 'Gusset Corner Left', category: 'Stamping', isActive: true },
  { id: '21', code: 'GUS-R', name: 'Gusset Corner Right', category: 'Stamping', isActive: true },
  { id: '22', code: 'BKT-Sen', name: 'Sensor Bracket Assy', category: 'Assembly', isActive: false },
  { id: '23', code: 'PNL-S-L', name: 'Side Panel Left', category: 'Press', isActive: true },
  { id: '24', code: 'PNL-S-R', name: 'Side Panel Right', category: 'Press', isActive: true },
  { id: '25', code: 'RIV-04', name: 'Blind Rivet 4mm', category: 'Fastener', isActive: true },
  { id: '26', code: 'BSH-A', name: 'Rubber Bushing A', category: 'Molding', isActive: true },
  { id: '27', code: 'BSH-B', name: 'Rubber Bushing B', category: 'Molding', isActive: true },
  { id: '28', code: 'TB-100', name: 'Steel Tube 100mm', category: 'Cutting', isActive: true },
  { id: '29', code: 'FLG-A', name: 'Flange Adapter A', category: 'Machining', isActive: true },
  { id: '30', code: 'PIN-01', name: 'Dowel Pin 6x20', category: 'Machining', isActive: true },
];
