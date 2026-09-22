// Demo data and helpers for the BYT Fleet Management Platform
// This provides mock data for the frontend when Prisma is not available in client components

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'REMOVED';
  operationalStatus?: 'ACTIVE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE';
  balance: number;
  vehicle?: Vehicle | null;
  profilePicture?: string | null;
  createdAt: string;
  // Performance metrics
  driverScore?: number;
  tripsCompleted?: number;
  onTimeRate?: number;       // 0-100 percentage
  totalEarnings?: number;
  harshBrakingCount?: number;
  speedingEvents?: number;
  idlingMinutes?: number;
  dailyTarget?: number;
  weeklyTarget?: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  severityStatus: 'RED' | 'YELLOW' | 'GREEN';
  gpsDeviceId: string;
  assignedDriver?: string | null;
  assignedDriverName?: string | null;
  images?: string[];
  mileage?: number;
  // Maintenance & service fields
  lastServiceDate?: string;
  nextServiceDue?: string;
  nextServiceMileage?: number;
  fuelType?: 'PETROL' | 'DIESEL' | 'HYBRID';
  insuranceExpiry?: string;
  conditionLog?: ConditionLogEntry[];
}

export interface ConditionLogEntry {
  date: string;
  event: string;
  type: 'SERVICE' | 'REPAIR' | 'INSPECTION' | 'INCIDENT';
}

export interface PaymentChannel {
  id: string;
  name: string;
  type: 'MOMO' | 'CASH' | 'BANK' | 'ONLINE';
  icon: string;
  enabledForDrivers: boolean; // Driver can pay BYT with this
  enabledForDisbursement: boolean; // BYT can pay Driver with this
  accountNumber?: string;
  accountName?: string;
  instructions?: string;
}

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  licenseNumber?: string;
  ghanaCardNumber?: string;
  licenseUrl?: string;
  ghanaCardUrl?: string;
  selfieUrl?: string;
  experienceYears?: number;
  vehiclePreference?: string;
}

export interface DriverReport {
  id: string;
  type: 'ISSUE' | 'ABSENCE';
  description: string;
  suggestedSeverity: string | null;
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
  driverName: string;
  vehiclePlate: string | null;
  createdAt: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'doc';
  adminNotes?: string;
}

export interface PartsExchangeItem {
  id: string;
  partName: string;
  cost: number;
  date: string;
  reimbursementStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  driverName: string;
  vehiclePlate: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'doc';
  docUrl?: string;
  notes?: string;
  inventoryDeducted?: boolean;
}

export interface SalesRecord {
  id: string;
  weekLabel: string;
  amount: number;
  paymentMethod: 'MOMO' | 'CASH' | 'ONLINE' | 'CARD' | 'PAYSTACK' | string;
  momoReference?: string | null;
  confirmationStatus?: 'PENDING' | 'CONFIRMED' | 'DISPUTED';
  status?: string;
  driverName: string;
  createdAt?: string;
  date?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
}

export interface ChatMessageItem {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  mediaType?: string | null;
}

export interface LocationData {
  vehicleId: string;
  plateNumber: string;
  driverName: string | null;
  severity: string;
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;          // km/h
  heading?: number;        // degrees 0-360
}

// ── New interfaces for enhanced features ──

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'OPERATIONAL' | 'RESTRICTED' | 'DEPOT';
  center: { lat: number; lng: number };
  radius: number;  // meters
  color: string;
  active: boolean;
}

export interface RouteHistoryPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string;
  serviceType: string;
  dueMileage: number;
  currentMileage: number;
  dueDate: string;
  status: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
  cost?: number;
  completedDate?: string;
  nextScheduledDate?: string;
  notes?: string;
}

export interface MaintenanceHistory {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  serviceType: string;
  dateCompleted: string;
  mileage: number;
  cost: number;
  notes?: string;
  performedBy?: string;
}

export interface PartInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  lastRestocked: string;
  supplier?: string;
}

export interface PartIssuanceRecord {
  id: string;
  receiptNumber: string;
  partId: string;
  partName: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  vehiclePlate: string;
  issuedBy: string;
  issuedAt: string;
  purpose: string;
  notes?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'LOGIN' | 'SALE' | 'REPORT' | 'TRIP' | 'MAINTENANCE' | 'PART_REQUEST';
  title: string;
  description: string;
  driverName?: string;
  timestamp: string;
  icon: string;
}

export interface DailyRemittance {
  driverName: string;
  driverId: string;
  day: string;       // 'Mon' | 'Tue' | etc.
  date: string;
  target: number;
  actual: number;
}

// ── Demo Version Sync (Clears previous bloated demo caches and syncs parts inventory) ──
const CURRENT_DEMO_VERSION = 'byt_demo_20pct_v3';
const CURRENT_PARTS_VERSION = 'ghana_taxi_parts_v1';
export function ensureDemoVersionSynced() {
  if (typeof window === 'undefined') return;
  try {
    const v = localStorage.getItem('byt_demo_version');
    if (v !== CURRENT_DEMO_VERSION) {
      localStorage.removeItem('byt-drivers');
      localStorage.removeItem('byt-vehicles');
      localStorage.removeItem('byt-reports');
      localStorage.removeItem('byt-parts-inventory');
      localStorage.removeItem('byt-parts-exchange');
      localStorage.removeItem('byt-applications');
      localStorage.removeItem('byt-maintenance-schedules');
      localStorage.removeItem('byt-maintenance-history');
      localStorage.removeItem('byt-chat-conversations');
      localStorage.removeItem('byt-driver-chats');
      localStorage.removeItem('byt-balance-adjustments');
      localStorage.setItem('byt_demo_version', CURRENT_DEMO_VERSION);
    }
    // Ensure the comprehensive Ghana taxi parts inventory is synced
    const pv = localStorage.getItem('byt_parts_inventory_version');
    if (pv !== CURRENT_PARTS_VERSION) {
      localStorage.removeItem('byt-parts-inventory');
      localStorage.setItem('byt_parts_inventory_version', CURRENT_PARTS_VERSION);
    }
  } catch {}
}

// ── Demo data (Scaled down to ~20% for clean live production fill-in) ──

export const demoDrivers: Driver[] = [
  { id: '1', name: 'Kwame Asante', phone: '024-419-8234', email: 'kwame@gmail.com', status: 'ACTIVE', operationalStatus: 'ON_TRIP', balance: 150.50, createdAt: '2026-06-15', driverScore: 87, tripsCompleted: 342, onTimeRate: 94, totalEarnings: 18520, harshBrakingCount: 3, speedingEvents: 2, idlingMinutes: 45, dailyTarget: 100, weeklyTarget: 600 },
  { id: '2', name: 'Ama Mensah', phone: '055-892-1045', email: 'ama@gmail.com', status: 'ACTIVE', operationalStatus: 'ACTIVE', balance: -75.00, createdAt: '2026-07-01', driverScore: 92, tripsCompleted: 298, onTimeRate: 98, totalEarnings: 16200, harshBrakingCount: 1, speedingEvents: 0, idlingMinutes: 22, dailyTarget: 100, weeklyTarget: 600 },
  { id: '3', name: 'Kofi Boateng', phone: '027-314-9820', email: 'kofi@gmail.com', status: 'PENDING', balance: 0, createdAt: '2026-07-10' },
];

export function getStoredDrivers(): Driver[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoDrivers;
  try {
    const saved = localStorage.getItem('byt-drivers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return demoDrivers;
}

export function saveStoredDrivers(drivers: Driver[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-drivers', JSON.stringify(drivers));
    // Keep in-memory demoDrivers in sync so direct imports always see latest state
    demoDrivers.splice(0, demoDrivers.length, ...drivers);
    window.dispatchEvent(new Event('byt-drivers-updated'));
  } catch {}
}

export const demoVehicles: Vehicle[] = [
  {
    id: 'v1',
    plateNumber: 'GR-1234-22',
    make: 'Toyota',
    model: 'Corolla',
    year: 2019,
    severityStatus: 'GREEN',
    gpsDeviceId: 'GPS-001',
    assignedDriverName: 'Kwame Asante',
    mileage: 45200,
    lastServiceDate: '2026-08-15',
    nextServiceDue: '2026-10-15',
    nextServiceMileage: 50000,
    fuelType: 'PETROL',
    insuranceExpiry: '2027-03-20',
    images: [
      'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&auto=format&fit=crop&q=80',
    ],
    conditionLog: [
      { date: '2026-08-15', event: 'Oil change + filter replacement', type: 'SERVICE' },
      { date: '2026-07-20', event: 'Routine inspection — all clear', type: 'INSPECTION' },
    ]
  },
  {
    id: 'v2',
    plateNumber: 'GR-5678-21',
    make: 'Toyota',
    model: 'Yaris',
    year: 2020,
    severityStatus: 'GREEN',
    gpsDeviceId: 'GPS-002',
    assignedDriverName: 'Ama Mensah',
    mileage: 38700,
    lastServiceDate: '2026-09-01',
    nextServiceDue: '2026-11-01',
    nextServiceMileage: 45000,
    fuelType: 'PETROL',
    insuranceExpiry: '2027-01-15',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80'
    ],
    conditionLog: [
      { date: '2026-09-01', event: 'Full service — oil, filters', type: 'SERVICE' },
    ]
  },
];

export const demoPaymentChannels: PaymentChannel[] = [
  {
    id: 'pay-momo-mtn',
    name: 'MTN Mobile Money',
    type: 'MOMO',
    icon: '🟡',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Instant Phone Prompt',
    accountName: 'BYT Fleet (Automated via Paystack)',
    instructions: 'Automated prompt sent directly to your phone. Authorize with your MTN MoMo PIN.'
  },
  {
    id: 'pay-momo-telecel',
    name: 'Telecel Cash',
    type: 'MOMO',
    icon: '🔴',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Instant Phone Prompt',
    accountName: 'BYT Fleet (Automated via Paystack)',
    instructions: 'Automated prompt sent directly to your phone. Authorize with your Telecel Cash voucher/PIN.'
  },
  {
    id: 'pay-momo-at',
    name: 'AT Money (AirtelTigo)',
    type: 'MOMO',
    icon: '🔵',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Instant Phone Prompt',
    accountName: 'BYT Fleet (Automated via Paystack)',
    instructions: 'Automated prompt sent directly to your phone. Authorize with your AT Money PIN.'
  },
  {
    id: 'pay-card',
    name: 'Debit / Credit Card',
    type: 'ONLINE',
    icon: '💳',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Visa / Mastercard',
    accountName: 'BYT Fleet (Automated via Paystack)',
    instructions: 'Secure online card payment processed automatically through Paystack.'
  },
  {
    id: 'pay-cash',
    name: 'Cash Handover (Office)',
    type: 'CASH',
    icon: '💵',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Front Desk / Cashier',
    accountName: 'BYT Fleet Office Desk',
    instructions: 'Deliver physical cash to the BYT Cashier. A stamped receipt will be issued.'
  },
  {
    id: 'pay-bank-gcb',
    name: 'Bank Transfer (GCB Bank)',
    type: 'BANK',
    icon: '🏦',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: '1012398472948',
    accountName: 'BYT Fleet Enterprise Ltd',
    instructions: 'Transfer via Mobile App / GhIPSS Instant Pay (GIP) with your driver ID as note.'
  }
];

export const demoApplications: Application[] = [
  { id: 'a1', fullName: 'Emmanuel Tetteh', phone: '024-111-9999', email: 'emmanuel@gmail.com', reason: 'I have 5 years of taxi driving experience in Accra and want to join BYT Fleet.', status: 'PENDING', createdAt: '2026-09-13' },
];

export const demoReports: DriverReport[] = [
  { id: 'r1', type: 'ISSUE', description: 'Left front tire tread is low, routine replacement needed soon.', suggestedSeverity: 'YELLOW', status: 'NEW', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22', createdAt: '2026-09-14T08:30:00' },
  { id: 'r2', type: 'ISSUE', description: 'Air conditioner inspection requested before hot weekend.', suggestedSeverity: 'GREEN', status: 'ACKNOWLEDGED', driverName: 'Ama Mensah', vehiclePlate: 'GR-5678-21', createdAt: '2026-09-13T14:15:00' },
];

export const demoParts: PartsExchangeItem[] = [
  { id: 'p1', partName: 'Front Left Tire', cost: 280, date: '2026-09-10', reimbursementStatus: 'APPROVED', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22' },
  { id: 'p2', partName: 'Air Filter', cost: 45, date: '2026-09-08', reimbursementStatus: 'PENDING', driverName: 'Ama Mensah', vehiclePlate: 'GR-5678-21' },
];

export const demoSales: SalesRecord[] = [
  { id: 's1', weekLabel: '2026-W38', amount: 520.00, paymentMethod: 'MOMO', momoReference: 'MTN7834521098', confirmationStatus: 'PENDING', driverName: 'Kwame Asante', createdAt: '2026-09-14' },
  { id: 's2', weekLabel: '2026-W38', amount: 480.00, paymentMethod: 'CASH', confirmationStatus: 'CONFIRMED', driverName: 'Ama Mensah', createdAt: '2026-09-14' },
];

export const demoChatUsers: ChatUser[] = [
  { id: '2', name: 'Ama Mensah', online: true, lastMessage: 'Heading towards Osu now', lastMessageTime: '5m ago', unread: 0 },
];

export const demoChatMessages: ChatMessageItem[] = [
  { id: 'm1', content: 'Hey Ama, are you around Circle today?', senderId: '1', createdAt: '2026-09-14T14:30:00' },
  { id: 'm2', content: 'Yes, just dropped off a passenger near Kwame Nkrumah interchange', senderId: '2', createdAt: '2026-09-14T14:35:00' },
];

export const demoLocations: LocationData[] = [
  { vehicleId: 'v1', plateNumber: 'GR-1234-22', driverName: 'Kwame Asante', severity: 'GREEN', lat: 5.6145, lng: -0.1870, timestamp: '2026-09-14T15:00:00', speed: 42, heading: 120 },
  { vehicleId: 'v2', plateNumber: 'GR-5678-21', driverName: 'Ama Mensah', severity: 'GREEN', lat: 5.5913, lng: -0.1740, timestamp: '2026-09-14T15:00:00', speed: 35, heading: 45 },
];

// ── Geofence Zones (Accra area) ──

export const demoGeofenceZones: GeofenceZone[] = [
  {
    id: 'gf-1',
    name: 'Accra Central Ops Zone',
    type: 'OPERATIONAL',
    center: { lat: 5.6037, lng: -0.1870 },
    radius: 5000,
    color: '#10b981',
    active: true,
  },
  {
    id: 'gf-2',
    name: 'Kotoka Airport Restricted',
    type: 'RESTRICTED',
    center: { lat: 5.6052, lng: -0.1718 },
    radius: 1500,
    color: '#ef4444',
    active: true,
  },
  {
    id: 'gf-3',
    name: 'BYT Depot / HQ',
    type: 'DEPOT',
    center: { lat: 5.6145, lng: -0.2050 },
    radius: 500,
    color: '#d4a843',
    active: true,
  },
];

// ── Route History (breadcrumbs for active vehicles) ──

export const demoRouteHistory: Record<string, RouteHistoryPoint[]> = {
  'v1': [
    { lat: 5.6000, lng: -0.2050, timestamp: '2026-09-14T13:00:00', speed: 25 },
    { lat: 5.6040, lng: -0.1990, timestamp: '2026-09-14T13:10:00', speed: 42 },
    { lat: 5.6085, lng: -0.1925, timestamp: '2026-09-14T13:25:00', speed: 40 },
    { lat: 5.6145, lng: -0.1870, timestamp: '2026-09-14T14:00:00', speed: 42 },
  ],
  'v2': [
    { lat: 5.5800, lng: -0.1900, timestamp: '2026-09-14T13:00:00', speed: 30 },
    { lat: 5.5845, lng: -0.1850, timestamp: '2026-09-14T13:20:00', speed: 42 },
    { lat: 5.5913, lng: -0.1740, timestamp: '2026-09-14T14:00:00', speed: 35 },
  ],
};

// ── Maintenance Schedules ──

export const demoMaintenanceSchedules: MaintenanceSchedule[] = [
  { id: 'ms-1', vehicleId: 'v1', vehiclePlate: 'GR-1234-22', driverName: 'Kwame Asante', serviceType: 'Oil Change', dueMileage: 50000, currentMileage: 45200, dueDate: '2026-10-15', status: 'UPCOMING', cost: 180 },
  { id: 'ms-2', vehicleId: 'v2', vehiclePlate: 'GR-5678-21', driverName: 'Ama Mensah', serviceType: 'Routine 40,000km Service', dueMileage: 45000, currentMileage: 38700, dueDate: '2026-11-01', status: 'UPCOMING', cost: 240 },
];

// ── Parts Inventory (Comprehensive Ghana Taxi & Commercial Fleet Catalog) ──

export const demoPartsInventory: PartInventoryItem[] = [
  // ── 1. Fluids, Lubricants & Chemicals ──
  { id: 'inv-1', name: 'Engine Oil 5W-30 Full Synthetic (4L) - TotalEnergies Quartz 9000', category: 'Fluids & Lubricants', quantity: 18, reorderLevel: 6, unitCost: 320, lastRestocked: '2026-09-18', supplier: 'TotalEnergies Ghana Lubricants' },
  { id: 'inv-2', name: 'Engine Oil 15W-40 Premium Mineral (4L) - Total Quartz 5000', category: 'Fluids & Lubricants', quantity: 24, reorderLevel: 8, unitCost: 190, lastRestocked: '2026-09-16', supplier: 'TotalEnergies Ghana Lubricants' },
  { id: 'inv-3', name: 'Engine Oil 20W-50 Heavy Duty (4L) - Shell Helix HX3 (High Mileage)', category: 'Fluids & Lubricants', quantity: 14, reorderLevel: 5, unitCost: 175, lastRestocked: '2026-09-14', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-4', name: 'Automatic Transmission Fluid ATF-WS (4L Canister) - Toyota Genuine', category: 'Fluids & Lubricants', quantity: 9, reorderLevel: 4, unitCost: 380, lastRestocked: '2026-09-12', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-5', name: 'Automatic Transmission Fluid SP-IV (4L) - Hyundai/Kia Mobis OEM', category: 'Fluids & Lubricants', quantity: 7, reorderLevel: 3, unitCost: 360, lastRestocked: '2026-09-10', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-6', name: 'Manual Gearbox Transmission Oil 75W-90 (4L) - Total Traxium', category: 'Fluids & Lubricants', quantity: 8, reorderLevel: 3, unitCost: 210, lastRestocked: '2026-09-08', supplier: 'TotalEnergies Ghana Lubricants' },
  { id: 'inv-7', name: 'Hydraulic Brake Fluid DOT 4 (1L) - Castrol / Total Heavy-Duty', category: 'Fluids & Lubricants', quantity: 20, reorderLevel: 6, unitCost: 65, lastRestocked: '2026-09-15', supplier: 'Brake Masters Accra' },
  { id: 'inv-8', name: 'Engine Radiator Coolant / Anti-Freeze 50/50 Premix (4L Red) - Toyota Spec', category: 'Fluids & Lubricants', quantity: 15, reorderLevel: 5, unitCost: 95, lastRestocked: '2026-09-14', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-9', name: 'Lithium Molybdenum CV Joint & Bearing Grease (500g Tub)', category: 'Fluids & Lubricants', quantity: 12, reorderLevel: 4, unitCost: 45, lastRestocked: '2026-09-11', supplier: 'Abossey Okai Auto Spares' },

  // ── 2. Filters ──
  { id: 'inv-10', name: 'Oil Filter - Toyota Corolla / Vitz / Yaris (OEM 90915-YZZE1)', category: 'Filters', quantity: 32, reorderLevel: 10, unitCost: 35, lastRestocked: '2026-09-19', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-11', name: 'Oil Filter - Hyundai i10 / Accent / Elantra (OEM 26300-35505)', category: 'Filters', quantity: 28, reorderLevel: 8, unitCost: 30, lastRestocked: '2026-09-18', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-12', name: 'Oil Filter - Kia Picanto / Morning 1.0L/1.2L (OEM 26300-02503)', category: 'Filters', quantity: 25, reorderLevel: 8, unitCost: 28, lastRestocked: '2026-09-18', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-13', name: 'Engine Air Filter - Toyota Corolla E140/E150 (OEM 17801-21050)', category: 'Filters', quantity: 14, reorderLevel: 5, unitCost: 55, lastRestocked: '2026-09-15', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-14', name: 'Engine Air Filter - Hyundai i10 / Grand i10 (28113-B4000)', category: 'Filters', quantity: 11, reorderLevel: 4, unitCost: 50, lastRestocked: '2026-09-14', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-15', name: 'Engine Air Filter - Kia Picanto / Morning (28113-07100)', category: 'Filters', quantity: 12, reorderLevel: 4, unitCost: 48, lastRestocked: '2026-09-14', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-16', name: 'Cabin AC Pollen Filter - Toyota Corolla / Vitz (87139-30040)', category: 'Filters', quantity: 16, reorderLevel: 5, unitCost: 45, lastRestocked: '2026-09-12', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-17', name: 'Cabin AC Air Filter - Hyundai i10 / Kia Picanto (97133-07010)', category: 'Filters', quantity: 15, reorderLevel: 5, unitCost: 40, lastRestocked: '2026-09-12', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-18', name: 'In-Tank Fuel Pump Filter & Strainer Kit (Universal Commercial Taxi)', category: 'Filters', quantity: 8, reorderLevel: 3, unitCost: 65, lastRestocked: '2026-09-07', supplier: 'Abossey Okai Auto Spares' },

  // ── 3. Braking System ──
  { id: 'inv-19', name: 'Front Ceramic Brake Pads - Toyota Corolla 2003-2016 (04465-02220)', category: 'Braking System', quantity: 16, reorderLevel: 5, unitCost: 140, lastRestocked: '2026-09-17', supplier: 'Brake Masters Accra' },
  { id: 'inv-20', name: 'Front Ceramic Brake Pads - Hyundai i10 / Grand i10 (58101-B4A00)', category: 'Braking System', quantity: 14, reorderLevel: 4, unitCost: 125, lastRestocked: '2026-09-17', supplier: 'Brake Masters Accra' },
  { id: 'inv-21', name: 'Front Ceramic Brake Pads - Kia Picanto / Morning (58101-07A00)', category: 'Braking System', quantity: 18, reorderLevel: 5, unitCost: 110, lastRestocked: '2026-09-17', supplier: 'Brake Masters Accra' },
  { id: 'inv-22', name: 'Front Brake Pads - Toyota Vitz / Yaris (04465-52240)', category: 'Braking System', quantity: 12, reorderLevel: 4, unitCost: 120, lastRestocked: '2026-09-15', supplier: 'Brake Masters Accra' },
  { id: 'inv-23', name: 'Rear Brake Shoes - Toyota Corolla / Yaris Drum (04495-52040)', category: 'Braking System', quantity: 10, reorderLevel: 3, unitCost: 115, lastRestocked: '2026-09-13', supplier: 'Brake Masters Accra' },
  { id: 'inv-24', name: 'Rear Brake Shoes - Kia Picanto / Hyundai i10 (58305-07A00)', category: 'Braking System', quantity: 9, reorderLevel: 3, unitCost: 95, lastRestocked: '2026-09-13', supplier: 'Brake Masters Accra' },
  { id: 'inv-25', name: 'Front Vented Brake Disc Rotors (Pair) - Toyota Corolla E140/E150', category: 'Braking System', quantity: 6, reorderLevel: 2, unitCost: 380, lastRestocked: '2026-09-09', supplier: 'Brake Masters Accra' },
  { id: 'inv-26', name: 'Front Vented Brake Disc Rotors (Pair) - Kia Picanto / Hyundai i10', category: 'Braking System', quantity: 5, reorderLevel: 2, unitCost: 310, lastRestocked: '2026-09-09', supplier: 'Brake Masters Accra' },
  { id: 'inv-27', name: 'Brake Master Cylinder Assembly (Toyota Corolla / Matrix)', category: 'Braking System', quantity: 3, reorderLevel: 2, unitCost: 260, lastRestocked: '2026-08-28', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-28', name: 'Rear Wheel Brake Hydraulic Cylinder (Toyota Corolla / Yaris)', category: 'Braking System', quantity: 8, reorderLevel: 3, unitCost: 75, lastRestocked: '2026-09-05', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-29', name: 'Rear Wheel Brake Hydraulic Cylinder (Kia Picanto / Hyundai i10)', category: 'Braking System', quantity: 7, reorderLevel: 3, unitCost: 65, lastRestocked: '2026-09-05', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-30', name: 'Handbrake Emergency Cable (Rear Left/Right Set - Corolla/Picanto)', category: 'Braking System', quantity: 4, reorderLevel: 2, unitCost: 110, lastRestocked: '2026-08-22', supplier: 'Brake Masters Accra' },

  // ── 4. Suspension & Steering (Ghana Road Condition Spec) ──
  { id: 'inv-31', name: 'Front Shock Absorbers KYB Excel-G (Pair) - Toyota Corolla E140/E150', category: 'Suspension & Steering', quantity: 6, reorderLevel: 2, unitCost: 680, lastRestocked: '2026-09-16', supplier: 'Japan Motors Spare Parts Hub' },
  { id: 'inv-32', name: 'Front Gas Strut Shock Absorbers (Pair) - Kia Picanto / Hyundai i10', category: 'Suspension & Steering', quantity: 5, reorderLevel: 2, unitCost: 520, lastRestocked: '2026-09-14', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-33', name: 'Rear Gas Shock Absorbers Heavy-Duty (Pair) - Toyota Corolla E120/E140', category: 'Suspension & Steering', quantity: 7, reorderLevel: 2, unitCost: 490, lastRestocked: '2026-09-16', supplier: 'Japan Motors Spare Parts Hub' },
  { id: 'inv-34', name: 'Rear Shock Absorbers Heavy-Duty (Pair) - Kia Picanto / Hyundai i10', category: 'Suspension & Steering', quantity: 6, reorderLevel: 2, unitCost: 420, lastRestocked: '2026-09-14', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-35', name: 'Front Shock Top Mounting & Strut Bearings Kit (Pair) - Corolla/Yaris', category: 'Suspension & Steering', quantity: 8, reorderLevel: 3, unitCost: 160, lastRestocked: '2026-09-11', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-36', name: 'Front Lower Suspension Control Arm with Bushings - Left (Toyota Corolla)', category: 'Suspension & Steering', quantity: 4, reorderLevel: 2, unitCost: 280, lastRestocked: '2026-09-10', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-37', name: 'Front Lower Suspension Control Arm with Bushings - Right (Toyota Corolla)', category: 'Suspension & Steering', quantity: 4, reorderLevel: 2, unitCost: 280, lastRestocked: '2026-09-10', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-38', name: 'Front Lower Wishbone Suspension Control Arm (Kia Picanto / i10)', category: 'Suspension & Steering', quantity: 5, reorderLevel: 2, unitCost: 230, lastRestocked: '2026-09-08', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-39', name: 'Heavy-Duty Lower Ball Joints (Pair) - 555 Three-Five Japan (Corolla/Vitz)', category: 'Suspension & Steering', quantity: 10, reorderLevel: 4, unitCost: 150, lastRestocked: '2026-09-15', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-40', name: 'Lower Ball Joints (Pair) - CTR Korea (Kia Picanto / Hyundai i10)', category: 'Suspension & Steering', quantity: 11, reorderLevel: 4, unitCost: 130, lastRestocked: '2026-09-15', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-41', name: 'Front Stabilizer Sway Bar Links C-Links (Pair) - Toyota Corolla', category: 'Suspension & Steering', quantity: 14, reorderLevel: 4, unitCost: 120, lastRestocked: '2026-09-16', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-42', name: 'Front Stabilizer Sway Bar Links (Pair) - Kia Picanto / Hyundai i10', category: 'Suspension & Steering', quantity: 12, reorderLevel: 4, unitCost: 105, lastRestocked: '2026-09-16', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-43', name: 'Outer Steering Tie Rod Ends (Pair) - Toyota Corolla / Vitz', category: 'Suspension & Steering', quantity: 10, reorderLevel: 3, unitCost: 130, lastRestocked: '2026-09-12', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-44', name: 'Outer Steering Tie Rod Ends (Pair) - Kia Picanto / Hyundai i10', category: 'Suspension & Steering', quantity: 9, reorderLevel: 3, unitCost: 115, lastRestocked: '2026-09-12', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-45', name: 'Inner Steering Rack Ends (Pair) - Toyota Corolla E140/E150', category: 'Suspension & Steering', quantity: 7, reorderLevel: 3, unitCost: 145, lastRestocked: '2026-09-08', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-46', name: 'Heavy-Duty Ghana Spec Raised Rear Coil Springs (Pair - Pothole Reinforced)', category: 'Suspension & Steering', quantity: 5, reorderLevel: 2, unitCost: 390, lastRestocked: '2026-09-03', supplier: 'Suame Magazine Spares Co.' },
  { id: 'inv-47', name: 'Front Wheel Hub Bearing Unit - Koyo/NSK Sealed (Toyota Corolla)', category: 'Suspension & Steering', quantity: 8, reorderLevel: 3, unitCost: 190, lastRestocked: '2026-09-11', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-48', name: 'Front Wheel Hub Bearing - NSK Japan (Kia Picanto / Hyundai i10)', category: 'Suspension & Steering', quantity: 8, reorderLevel: 3, unitCost: 165, lastRestocked: '2026-09-11', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-49', name: 'Rear Wheel Hub & Bearing Assembly with ABS (Corolla / Picanto)', category: 'Suspension & Steering', quantity: 4, reorderLevel: 2, unitCost: 320, lastRestocked: '2026-08-30', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-50', name: 'Steering Rack Boot Bellows & Stainless Clamp Kit (Set of 2)', category: 'Suspension & Steering', quantity: 15, reorderLevel: 4, unitCost: 55, lastRestocked: '2026-09-13', supplier: 'AutoParts Ghana Ltd' },

  // ── 5. Engine, Belts & Cooling System ──
  { id: 'inv-51', name: 'Serpentine Fan / Alternator Drive Belt 6PK 1220 - Bando (Corolla 1NZ/1ZZ)', category: 'Engine & Belts', quantity: 12, reorderLevel: 4, unitCost: 85, lastRestocked: '2026-09-14', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-52', name: 'Serpentine Fan / Alternator Drive Belt 4PK 845 - Gates (Picanto / i10)', category: 'Engine & Belts', quantity: 14, reorderLevel: 4, unitCost: 65, lastRestocked: '2026-09-14', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-53', name: 'Engine Water Pump Assembly with Gasket - Aisin Japan (Corolla 1NZ/1ZZ)', category: 'Engine & Belts', quantity: 4, reorderLevel: 2, unitCost: 260, lastRestocked: '2026-09-06', supplier: 'Japan Motors Spare Parts Hub' },
  { id: 'inv-54', name: 'Engine Water Pump Assembly - GMB Korea (Kia Picanto / Hyundai i10)', category: 'Engine & Belts', quantity: 4, reorderLevel: 2, unitCost: 210, lastRestocked: '2026-09-06', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-55', name: 'Engine Thermostat with Rubber O-Ring Seal 82°C (Toyota Corolla / Vitz)', category: 'Engine & Belts', quantity: 7, reorderLevel: 3, unitCost: 75, lastRestocked: '2026-09-08', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-56', name: 'Radiator Safety Pressure Cap 1.1 Bar (Toyota / Hyundai / Kia)', category: 'Engine & Belts', quantity: 16, reorderLevel: 5, unitCost: 35, lastRestocked: '2026-09-15', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-57', name: 'Valve Cover Gasket Set with Spark Plug Tube Seals (Corolla 1ZZ/2ZR)', category: 'Engine & Belts', quantity: 6, reorderLevel: 2, unitCost: 95, lastRestocked: '2026-09-04', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-58', name: 'Engine Cylinder Head Gasket Multi-Layer Steel (Toyota Corolla 1.6/1.8)', category: 'Engine & Belts', quantity: 3, reorderLevel: 2, unitCost: 195, lastRestocked: '2026-08-25', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-59', name: 'Engine Mount - Front Lower Hydraulic (Toyota Corolla 2003-2016)', category: 'Engine & Belts', quantity: 5, reorderLevel: 2, unitCost: 190, lastRestocked: '2026-09-07', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-60', name: 'Engine Mount - Rear Torque Strut Dogbone (Toyota Corolla / Vitz)', category: 'Engine & Belts', quantity: 5, reorderLevel: 2, unitCost: 160, lastRestocked: '2026-09-07', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-61', name: 'Engine Mount - Right Side Hydraulic (Kia Picanto / Hyundai i10)', category: 'Engine & Belts', quantity: 4, reorderLevel: 2, unitCost: 175, lastRestocked: '2026-09-07', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-62', name: 'All-Aluminum Heavy-Duty Radiator Assembly (Toyota Corolla E140/E150)', category: 'Cooling & AC', quantity: 3, reorderLevel: 2, unitCost: 650, lastRestocked: '2026-09-02', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-63', name: 'Heavy-Duty Radiator Aluminum Core (Kia Picanto / Hyundai i10)', category: 'Cooling & AC', quantity: 3, reorderLevel: 2, unitCost: 480, lastRestocked: '2026-09-02', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-64', name: 'Electric Radiator Cooling Fan Motor & Fan Blade Assembly (Corolla/i10)', category: 'Cooling & AC', quantity: 4, reorderLevel: 2, unitCost: 280, lastRestocked: '2026-09-05', supplier: 'Abossey Okai Auto Spares' },

  // ── 6. Transmission & Drivetrain ──
  { id: 'inv-65', name: 'Front Left CV Axle / Drive Shaft Assembly (Toyota Corolla 1.6/1.8L)', category: 'Transmission & Drivetrain', quantity: 3, reorderLevel: 2, unitCost: 580, lastRestocked: '2026-09-03', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-66', name: 'Front Right CV Axle / Drive Shaft Assembly with Bracket (Toyota Corolla)', category: 'Transmission & Drivetrain', quantity: 3, reorderLevel: 2, unitCost: 620, lastRestocked: '2026-09-03', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-67', name: 'Front Drive Shaft CV Axle Assembly (Kia Picanto / Hyundai i10)', category: 'Transmission & Drivetrain', quantity: 4, reorderLevel: 2, unitCost: 440, lastRestocked: '2026-09-03', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-68', name: 'CV Joint Outer Rubber Boot Kit with Moly Grease & Clamps (Universal Taxi)', category: 'Transmission & Drivetrain', quantity: 18, reorderLevel: 5, unitCost: 60, lastRestocked: '2026-09-14', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-69', name: '3-Piece Manual Clutch Kit - Valeo/Exedy (Corolla 1.4/1.6L Manual Taxi)', category: 'Transmission & Drivetrain', quantity: 3, reorderLevel: 2, unitCost: 750, lastRestocked: '2026-08-28', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-70', name: '3-Piece Manual Clutch Kit - Valeo Korea (Kia Picanto / Hyundai i10)', category: 'Transmission & Drivetrain', quantity: 4, reorderLevel: 2, unitCost: 560, lastRestocked: '2026-08-28', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-71', name: 'Clutch Master & Slave Hydraulic Cylinder Kit (Manual Fleet Taxi)', category: 'Transmission & Drivetrain', quantity: 4, reorderLevel: 2, unitCost: 190, lastRestocked: '2026-08-20', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-72', name: 'Transmission Mount - Left Side (Toyota Corolla / Matrix)', category: 'Transmission & Drivetrain', quantity: 4, reorderLevel: 2, unitCost: 170, lastRestocked: '2026-09-01', supplier: 'Abossey Okai Auto Spares' },

  // ── 7. Electrical, Battery & Ignition ──
  { id: 'inv-73', name: '12V 45Ah Maintenance-Free Car Battery - Solite DIN45 (Picanto / i10)', category: 'Electrical & Battery', quantity: 6, reorderLevel: 3, unitCost: 650, lastRestocked: '2026-09-17', supplier: 'Solite Batteries West Africa' },
  { id: 'inv-74', name: '12V 60Ah Heavy-Duty Maintenance-Free Battery - Hankook 60MF (Corolla)', category: 'Electrical & Battery', quantity: 8, reorderLevel: 3, unitCost: 820, lastRestocked: '2026-09-17', supplier: 'Solite Batteries West Africa' },
  { id: 'inv-75', name: '12V 70Ah High-Crank Commercial Fleet Battery - Bosch S4', category: 'Electrical & Battery', quantity: 4, reorderLevel: 2, unitCost: 980, lastRestocked: '2026-09-10', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-76', name: 'Iridium Spark Plugs Set of 4 - Denso SC20HR11 (Toyota Corolla / Vitz)', category: 'Electrical & Battery', quantity: 15, reorderLevel: 4, unitCost: 180, lastRestocked: '2026-09-16', supplier: 'Japan Motors Spare Parts Hub' },
  { id: 'inv-77', name: 'Copper Core Spark Plugs Set of 4 - NGK BKR6E-11 (Hyundai i10 / Picanto)', category: 'Electrical & Battery', quantity: 20, reorderLevel: 5, unitCost: 90, lastRestocked: '2026-09-16', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-78', name: 'Electronic Ignition Coil Pack - Denso OEM (Toyota Corolla 1NZ/1ZZ/2ZR)', category: 'Electrical & Battery', quantity: 8, reorderLevel: 3, unitCost: 160, lastRestocked: '2026-09-12', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-79', name: 'Electronic Ignition Coil Pack - Mobis Korea (Kia Picanto / Hyundai i10)', category: 'Electrical & Battery', quantity: 8, reorderLevel: 3, unitCost: 135, lastRestocked: '2026-09-12', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-80', name: 'Alternator Assembly 12V 80A Remanufactured - Denso (Corolla 1.6/1.8)', category: 'Electrical & Battery', quantity: 2, reorderLevel: 2, unitCost: 650, lastRestocked: '2026-09-01', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-81', name: 'Alternator Assembly 12V 70A Unit - Valeo (Kia Picanto / Hyundai i10)', category: 'Electrical & Battery', quantity: 2, reorderLevel: 2, unitCost: 520, lastRestocked: '2026-09-01', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-82', name: 'Starter Motor 12V 1.0kW High-Torque Unit (Toyota Corolla / Vitz)', category: 'Electrical & Battery', quantity: 3, reorderLevel: 2, unitCost: 450, lastRestocked: '2026-08-27', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-83', name: 'Starter Motor 12V 0.9kW Unit (Kia Picanto / Hyundai i10)', category: 'Electrical & Battery', quantity: 3, reorderLevel: 2, unitCost: 380, lastRestocked: '2026-08-27', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-84', name: 'Upstream 4-Wire Oxygen O2 Sensor - Denso (Fuel Trim / Check Engine Fix)', category: 'Electrical & Battery', quantity: 6, reorderLevel: 2, unitCost: 220, lastRestocked: '2026-09-09', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-85', name: 'Downstream Heated O2 Sensor (Toyota Corolla / Hyundai i10)', category: 'Electrical & Battery', quantity: 4, reorderLevel: 2, unitCost: 190, lastRestocked: '2026-09-09', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-86', name: 'Automotive Electric Horn 12V High/Low Dual Snail Waterproof (115dB)', category: 'Electrical & Battery', quantity: 10, reorderLevel: 3, unitCost: 75, lastRestocked: '2026-09-15', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-87', name: 'Automotive Blade Fuse Assortment Kit 5A-30A (Pack of 100 with Puller)', category: 'Electrical & Battery', quantity: 15, reorderLevel: 4, unitCost: 40, lastRestocked: '2026-09-18', supplier: 'AutoParts Ghana Ltd' },

  // ── 8. Air Conditioning & Climate Control ──
  { id: 'inv-88', name: 'R134a Automotive AC Refrigerant Gas Cylinder (13.6kg Virgin Dupont)', category: 'Cooling & AC', quantity: 4, reorderLevel: 2, unitCost: 950, lastRestocked: '2026-09-14', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-89', name: 'AC Compressor with Magnetic Clutch - Denso 6SBU16C (Toyota Corolla)', category: 'Cooling & AC', quantity: 2, reorderLevel: 2, unitCost: 1350, lastRestocked: '2026-08-24', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-90', name: 'AC Compressor Assembly - Hanon Systems (Kia Picanto / Hyundai i10)', category: 'Cooling & AC', quantity: 2, reorderLevel: 2, unitCost: 980, lastRestocked: '2026-08-24', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-91', name: 'AC Aluminum Condenser with Receiver Drier (Toyota Corolla E140/E150)', category: 'Cooling & AC', quantity: 3, reorderLevel: 2, unitCost: 480, lastRestocked: '2026-09-02', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-92', name: 'AC Condenser Assembly with Built-in Drier (Kia Picanto / Hyundai i10)', category: 'Cooling & AC', quantity: 3, reorderLevel: 2, unitCost: 390, lastRestocked: '2026-09-02', supplier: 'Korean Auto Spares Direct' },
  { id: 'inv-93', name: 'AC Thermal Expansion Valve Block Type (Corolla / Picanto / i10)', category: 'Cooling & AC', quantity: 6, reorderLevel: 2, unitCost: 110, lastRestocked: '2026-09-06', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-94', name: 'AC Cabin Blower Fan Motor Assembly (Toyota Corolla / Vitz)', category: 'Cooling & AC', quantity: 3, reorderLevel: 2, unitCost: 220, lastRestocked: '2026-08-30', supplier: 'Abossey Okai Auto Spares' },

  // ── 9. Commercial Tires, Wheels & Exterior ──
  { id: 'inv-95', name: 'Commercial Taxi Radial Tire 175/70 R13 - Linglong/Westlake All-Weather', category: 'Tires & Wheels', quantity: 12, reorderLevel: 4, unitCost: 480, lastRestocked: '2026-09-16', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-96', name: 'Commercial Taxi Radial Tire 175/65 R14 - Royal Black / Sailun (Picanto/Vitz)', category: 'Tires & Wheels', quantity: 16, reorderLevel: 6, unitCost: 520, lastRestocked: '2026-09-16', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-97', name: 'Commercial Fleet Radial Tire 185/65 R15 - Michelin Energy XM2 (Corolla/i10)', category: 'Tires & Wheels', quantity: 12, reorderLevel: 4, unitCost: 680, lastRestocked: '2026-09-15', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-98', name: 'Commercial Fleet Radial Tire 195/65 R15 - Bridgestone Ecopia (Corolla/Elantra)', category: 'Tires & Wheels', quantity: 8, reorderLevel: 4, unitCost: 750, lastRestocked: '2026-09-12', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-99', name: 'Heavy-Duty Brass Snap-in Tire Valve Stems TR414 (Pack of 50)', category: 'Tires & Wheels', quantity: 10, reorderLevel: 3, unitCost: 65, lastRestocked: '2026-09-18', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-100', name: 'Hardened Steel Wheel Lug Nuts M12x1.5 (Set of 16 - Toyota / Hyundai)', category: 'Tires & Wheels', quantity: 12, reorderLevel: 4, unitCost: 80, lastRestocked: '2026-09-15', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-101', name: 'All-Weather Frameless Silicone Wiper Blade Pair 24" & 16" (Toyota Corolla)', category: 'Body & Lighting', quantity: 14, reorderLevel: 4, unitCost: 70, lastRestocked: '2026-09-17', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-102', name: 'All-Weather Silicone Wiper Blade Pair 22" & 14" (Kia Picanto / Hyundai i10)', category: 'Body & Lighting', quantity: 15, reorderLevel: 4, unitCost: 65, lastRestocked: '2026-09-17', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-103', name: 'Headlight Halogen Bulbs H4 12V 60/55W - Osram Bilux Original (Box of 10)', category: 'Body & Lighting', quantity: 12, reorderLevel: 4, unitCost: 150, lastRestocked: '2026-09-18', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-104', name: 'Headlight Halogen Bulbs H7 12V 55W - Philips Vision (Box of 10)', category: 'Body & Lighting', quantity: 10, reorderLevel: 3, unitCost: 160, lastRestocked: '2026-09-18', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-105', name: 'Tail & Brake Light Bulbs 1157 Dual Filament 12V 21/5W (Box of 10)', category: 'Body & Lighting', quantity: 15, reorderLevel: 5, unitCost: 45, lastRestocked: '2026-09-18', supplier: 'AutoParts Ghana Ltd' },
  { id: 'inv-106', name: 'Side View Door Mirror Convex Replacement Glass - Left (Toyota Corolla)', category: 'Body & Lighting', quantity: 4, reorderLevel: 2, unitCost: 65, lastRestocked: '2026-09-08', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-107', name: 'Side View Door Mirror Convex Replacement Glass - Right (Toyota Corolla)', category: 'Body & Lighting', quantity: 4, reorderLevel: 2, unitCost: 65, lastRestocked: '2026-09-08', supplier: 'Abossey Okai Auto Spares' },
  { id: 'inv-108', name: 'Side View Mirror Complete Assembly Manual/Electric (Kia Picanto / Morning)', category: 'Body & Lighting', quantity: 3, reorderLevel: 2, unitCost: 180, lastRestocked: '2026-08-29', supplier: 'Korean Auto Spares Direct' },
];

// ── Daily Remittance Data ──

export const demoDailyRemittances: DailyRemittance[] = [
  // Kwame Asante - Week 38
  { driverName: 'Kwame Asante', driverId: '1', day: 'Mon', date: '2026-09-14', target: 100, actual: 110 },
  { driverName: 'Kwame Asante', driverId: '1', day: 'Tue', date: '2026-09-15', target: 100, actual: 95 },
  { driverName: 'Kwame Asante', driverId: '1', day: 'Wed', date: '2026-09-16', target: 100, actual: 105 },
  { driverName: 'Kwame Asante', driverId: '1', day: 'Thu', date: '2026-09-17', target: 100, actual: 100 },
  { driverName: 'Kwame Asante', driverId: '1', day: 'Fri', date: '2026-09-18', target: 100, actual: 110 },
  // Ama Mensah
  { driverName: 'Ama Mensah', driverId: '2', day: 'Mon', date: '2026-09-14', target: 100, actual: 100 },
  { driverName: 'Ama Mensah', driverId: '2', day: 'Tue', date: '2026-09-15', target: 100, actual: 105 },
  { driverName: 'Ama Mensah', driverId: '2', day: 'Wed', date: '2026-09-16', target: 100, actual: 95 },
  { driverName: 'Ama Mensah', driverId: '2', day: 'Thu', date: '2026-09-17', target: 100, actual: 100 },
  { driverName: 'Ama Mensah', driverId: '2', day: 'Fri', date: '2026-09-18', target: 100, actual: 80 },
];

// ── Activity Feed ──

export const demoActivityFeed: ActivityFeedItem[] = [
  { id: 'af-1', type: 'SALE', title: 'Sales Submitted', description: 'Kwame Asante submitted GHS 110.00 via MTN MoMo', driverName: 'Kwame Asante', timestamp: '2026-09-14T15:30:00', icon: '💰' },
  { id: 'af-2', type: 'TRIP', title: 'Trip Completed', description: 'Ama Mensah completed trip #298 — Osu to Cantonments', driverName: 'Ama Mensah', timestamp: '2026-09-14T14:20:00', icon: '🚗' },
];

// Financial data for charts
export const weeklyRevenueData = [
  { week: 'W35', revenue: 1000, expenses: 200, profit: 800 },
  { week: 'W36', revenue: 1050, expenses: 180, profit: 870 },
  { week: 'W37', revenue: 1005, expenses: 210, profit: 795 },
  { week: 'W38', revenue: 1000, expenses: 190, profit: 810 },
];

export const expenseBreakdown = [
  { category: 'Parts', amount: 325, color: '#d4a843' },
  { category: 'Fuel', amount: 200, color: '#06b6d4' },
  { category: 'Maintenance', amount: 180, color: '#10b981' },
];

// Per-driver revenue breakdown for charts
export const perDriverRevenue = [
  { week: 'W35', 'Kwame Asante': 520, 'Ama Mensah': 480 },
  { week: 'W36', 'Kwame Asante': 540, 'Ama Mensah': 510 },
  { week: 'W37', 'Kwame Asante': 495, 'Ama Mensah': 510 },
  { week: 'W38', 'Kwame Asante': 520, 'Ama Mensah': 480 },
];

// ── Driver Weekly Earnings Trend (for sparklines) ──
export const driverWeeklyEarnings: Record<string, number[]> = {
  '1': [480, 520, 510, 495, 540, 520, 520],  // Kwame
  '2': [450, 470, 490, 510, 480, 510, 480],  // Ama
};

// Helpers
export function getSeverityBadgeClass(severity: string): string {
  switch (severity) {
    case 'RED': return 'badge-red';
    case 'YELLOW': return 'badge-yellow';
    case 'GREEN': return 'badge-green';
    default: return 'badge-green';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'ACTIVE': return 'badge-green';
    case 'PENDING': return 'badge-purple';
    case 'REMOVED': return 'badge-red';
    case 'APPROVED': return 'badge-green';
    case 'REJECTED': return 'badge-red';
    case 'NEW': return 'badge-purple';
    case 'ACKNOWLEDGED': return 'badge-cyan';
    case 'RESOLVED': return 'badge-green';
    case 'CONFIRMED': return 'badge-green';
    case 'DISPUTED': return 'badge-red';
    default: return 'badge-purple';
  }
}

export function getOperationalStatusInfo(status?: string): { label: string; color: string; bg: string } {
  switch (status) {
    case 'ACTIVE': return { label: 'Active', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
    case 'ON_TRIP': return { label: 'On Trip', color: '#0891b2', bg: 'rgba(8, 145, 178, 0.12)' };
    case 'MAINTENANCE': return { label: 'Maintenance', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
    case 'OFFLINE': return { label: 'Offline', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' };
    default: return { label: 'Unknown', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' };
  }
}

export function formatCurrency(amount: number): string {
  return `GHS ${Math.abs(amount).toFixed(2)}`;
}

export function getBalanceLabel(balance: number): { text: string; className: string } {
  if (balance > 0) return { text: `Owes BYT ${formatCurrency(balance)}`, className: 'text-red' };
  if (balance < 0) return { text: `BYT owes ${formatCurrency(balance)}`, className: 'text-gold' };
  return { text: 'Settled', className: 'text-green' };
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  return 'Needs Improvement';
}

export function getMaintenanceStatusColor(status: string): string {
  switch (status) {
    case 'OVERDUE': return '#ef4444';
    case 'DUE_SOON': return '#f59e0b';
    case 'UPCOMING': return '#10b981';
    case 'COMPLETED': return '#94a3b8';
    default: return '#94a3b8';
  }
}

export function getInventoryStatus(item: PartInventoryItem): { label: string; color: string; bg: string } {
  if (item.quantity === 0) return { label: 'Out of Stock', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  if (item.quantity <= item.reorderLevel) return { label: 'Low Stock', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
  return { label: 'In Stock', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
}

// ── Maintenance History Demo ──
export const demoMaintenanceHistory: MaintenanceHistory[] = [
  { id: 'mh-1', vehicleId: 'v1', vehiclePlate: 'GR-1234-22', driverName: 'Kwame Asante', serviceType: 'Oil & Filter Change', dateCompleted: '2026-08-15', mileage: 44000, cost: 180, notes: 'Synthetic 5W-30 used. All checks normal.', performedBy: 'AutoFix Accra' },
];

// ── Persistent Storage Helpers with Event Dispatching ──

// Vehicles
export function getStoredVehicles(): Vehicle[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoVehicles;
  try {
    const saved = localStorage.getItem('byt-vehicles');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoVehicles;
}

export function saveStoredVehicles(vehicles: Vehicle[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-vehicles', JSON.stringify(vehicles));
    demoVehicles.splice(0, demoVehicles.length, ...vehicles);
    window.dispatchEvent(new Event('byt-vehicles-updated'));
  } catch {}
}

// Parts Inventory
export function getStoredInventory(): PartInventoryItem[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoPartsInventory;
  try {
    const saved = localStorage.getItem('byt-parts-inventory');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoPartsInventory;
}

export function saveStoredInventory(items: PartInventoryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-parts-inventory', JSON.stringify(items));
    demoPartsInventory.splice(0, demoPartsInventory.length, ...items);
    window.dispatchEvent(new Event('byt-inventory-updated'));
  } catch {}
}

// Parts Issuance & Receipt Tracking
export const demoPartIssuances: PartIssuanceRecord[] = [
  {
    id: 'iss-1',
    receiptNumber: 'BYT-ISS-2026-08491',
    partId: 'inv-1',
    partName: 'Engine Oil 5W-30 Full Synthetic (4L) - TotalEnergies Quartz 9000',
    category: 'Fluids & Lubricants',
    quantity: 1,
    unitCost: 320,
    totalCost: 320,
    driverId: '1',
    driverName: 'Kwame Asante',
    driverPhone: '024-419-8234',
    vehiclePlate: 'GR-1234-22',
    issuedBy: 'Emma (Admin Dispatch)',
    issuedAt: '2026-09-18 10:30 AM',
    purpose: 'Routine Service / Oil Change',
    notes: 'Scheduled 50,000km engine maintenance service',
  },
];

export function getStoredPartIssuances(): PartIssuanceRecord[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoPartIssuances;
  try {
    const saved = localStorage.getItem('byt-part-issuances');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoPartIssuances;
}

export function saveStoredPartIssuances(records: PartIssuanceRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-part-issuances', JSON.stringify(records));
    demoPartIssuances.splice(0, demoPartIssuances.length, ...records);
    window.dispatchEvent(new Event('byt-issuances-updated'));
  } catch {}
}

// Parts Exchange Requests
export function getStoredPartsExchange(): PartsExchangeItem[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoParts;
  try {
    const saved = localStorage.getItem('byt-parts-exchange');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoParts;
}

export function saveStoredPartsExchange(items: PartsExchangeItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-parts-exchange', JSON.stringify(items));
    demoParts.splice(0, demoParts.length, ...items);
    window.dispatchEvent(new Event('byt-parts-updated'));
  } catch {}
}

// Driver Reports
export function getStoredReports(): DriverReport[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoReports;
  try {
    const saved = localStorage.getItem('byt-reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoReports;
}

export function saveStoredReports(reports: DriverReport[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-reports', JSON.stringify(reports));
    demoReports.splice(0, demoReports.length, ...reports);
    window.dispatchEvent(new Event('byt-reports-updated'));
  } catch {}
}

// Driver Applications
export function getStoredApplications(): Application[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoApplications;
  try {
    const saved = localStorage.getItem('byt-applications');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoApplications;
}

export function saveStoredApplications(apps: Application[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-applications', JSON.stringify(apps));
    demoApplications.splice(0, demoApplications.length, ...apps);
    window.dispatchEvent(new Event('byt-applications-updated'));
  } catch {}
}

// Maintenance Schedules
export function getStoredMaintenanceSchedules(): MaintenanceSchedule[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoMaintenanceSchedules;
  try {
    const saved = localStorage.getItem('byt-maintenance-schedules');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoMaintenanceSchedules;
}

export function saveStoredMaintenanceSchedules(schedules: MaintenanceSchedule[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-maintenance-schedules', JSON.stringify(schedules));
    demoMaintenanceSchedules.splice(0, demoMaintenanceSchedules.length, ...schedules);
    window.dispatchEvent(new Event('byt-maintenance-updated'));
  } catch {}
}

// Maintenance History
export function getStoredMaintenanceHistory(): MaintenanceHistory[] {
  ensureDemoVersionSynced();
  if (typeof window === 'undefined') return demoMaintenanceHistory;
  try {
    const saved = localStorage.getItem('byt-maintenance-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return demoMaintenanceHistory;
}

export function saveStoredMaintenanceHistory(history: MaintenanceHistory[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-maintenance-history', JSON.stringify(history));
    demoMaintenanceHistory.splice(0, demoMaintenanceHistory.length, ...history);
    window.dispatchEvent(new Event('byt-maintenance-updated'));
  } catch {}
}
