// Demo data and helpers for the BYT Fleet Management Platform
// This provides mock data for the frontend when Prisma is not available in client components

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'REMOVED';
  balance: number;
  vehicle?: Vehicle | null;
  createdAt: string;
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
}

export interface PaymentChannel {
  id: string;
  name: string;
  type: 'MOMO' | 'CASH' | 'BANK';
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
}

export interface PartsExchangeItem {
  id: string;
  partName: string;
  cost: number;
  date: string;
  reimbursementStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  driverName: string;
  vehiclePlate: string;
}

export interface SalesRecord {
  id: string;
  weekLabel: string;
  amount: number;
  paymentMethod: 'MOMO' | 'CASH';
  momoReference?: string | null;
  confirmationStatus: 'PENDING' | 'CONFIRMED' | 'DISPUTED';
  driverName: string;
  createdAt: string;
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
}

// Demo data
export const demoDrivers: Driver[] = [
  { id: '1', name: 'Kwame Asante', phone: '024-123-4567', email: 'kwame@gmail.com', status: 'ACTIVE', balance: 150.50, createdAt: '2026-06-15' },
  { id: '2', name: 'Ama Mensah', phone: '055-123-4567', email: 'ama@gmail.com', status: 'ACTIVE', balance: -75.00, createdAt: '2026-07-01' },
  { id: '3', name: 'Kofi Boateng', phone: '027-123-4567', email: 'kofi@gmail.com', status: 'ACTIVE', balance: 0, createdAt: '2026-07-10' },
  { id: '4', name: 'Yaa Serwaa', phone: '020-123-4567', email: 'yaa@gmail.com', status: 'ACTIVE', balance: 320.00, createdAt: '2026-07-15' },
  { id: '5', name: 'Kwesi Appiah', phone: '054-123-4567', email: 'kwesi@gmail.com', status: 'ACTIVE', balance: -25.75, createdAt: '2026-08-01' },
  { id: '6', name: 'Akua Donkor', phone: '026-123-4567', email: 'akua@gmail.com', status: 'ACTIVE', balance: 200.00, createdAt: '2026-08-05' },
  { id: '7', name: 'Nana Osei', phone: '050-123-4567', email: 'nana@gmail.com', status: 'ACTIVE', balance: 0, createdAt: '2026-08-10' },
  { id: '8', name: 'Efua Amoah', phone: '023-123-4567', email: 'efua@gmail.com', status: 'ACTIVE', balance: -180.25, createdAt: '2026-08-12' },
  { id: '9', name: 'Kojo Annan', phone: '057-123-4567', email: 'kojo@gmail.com', status: 'PENDING', balance: 0, createdAt: '2026-09-10' },
  { id: '10', name: 'Abena Owusu', phone: '021-123-4567', email: 'abena@gmail.com', status: 'PENDING', balance: 0, createdAt: '2026-09-12' },
  { id: '11', name: 'Yaw Frimpong', phone: '058-123-4567', email: 'yaw@gmail.com', status: 'REMOVED', balance: 0, createdAt: '2026-06-01' },
  { id: '12', name: 'Adwoa Poku', phone: '059-123-4567', email: 'adwoa@gmail.com', status: 'ACTIVE', balance: 55.00, createdAt: '2026-08-20' },
];

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
    images: [
      'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
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
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v3',
    plateNumber: 'GW-9012-23',
    make: 'Hyundai',
    model: 'Accent',
    year: 2021,
    severityStatus: 'YELLOW',
    gpsDeviceId: 'GPS-003',
    assignedDriverName: 'Kofi Boateng',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v4',
    plateNumber: 'GR-3456-20',
    make: 'Kia',
    model: 'Rio',
    year: 2018,
    severityStatus: 'RED',
    gpsDeviceId: 'GPS-004',
    assignedDriverName: 'Yaa Serwaa',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v5',
    plateNumber: 'GN-7890-22',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    severityStatus: 'GREEN',
    gpsDeviceId: 'GPS-005',
    assignedDriverName: 'Kwesi Appiah',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v6',
    plateNumber: 'GT-2345-21',
    make: 'Nissan',
    model: 'Versa',
    year: 2020,
    severityStatus: 'GREEN',
    gpsDeviceId: 'GPS-006',
    assignedDriverName: 'Akua Donkor',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v7',
    plateNumber: 'GR-6789-23',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2023,
    severityStatus: 'YELLOW',
    gpsDeviceId: 'GPS-007',
    assignedDriverName: 'Nana Osei',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'v8',
    plateNumber: 'GW-0123-22',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    severityStatus: 'GREEN',
    gpsDeviceId: 'GPS-008',
    assignedDriverName: 'Efua Amoah',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&auto=format&fit=crop&q=80'
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
    accountNumber: '024 123 4567',
    accountName: 'BYT Fleet Ent',
    instructions: 'Send money to MTN Merchant ID / Phone and enter your transaction ID.'
  },
  {
    id: 'pay-momo-telecel',
    name: 'Telecel Cash',
    type: 'MOMO',
    icon: '🔴',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: '020 987 6543',
    accountName: 'BYT Fleet Ent',
    instructions: 'Use Telecel Cash to transfer and submit your transaction reference.'
  },
  {
    id: 'pay-momo-at',
    name: 'AirtelTigo Money',
    type: 'MOMO',
    icon: '🔵',
    enabledForDrivers: false,
    enabledForDisbursement: false,
    accountNumber: '027 555 1234',
    accountName: 'BYT Fleet Ent',
    instructions: 'Transfer to AT Money and enter reference code.'
  },
  {
    id: 'pay-cash',
    name: 'Cash Handover (Office)',
    type: 'CASH',
    icon: '💵',
    enabledForDrivers: true,
    enabledForDisbursement: true,
    accountNumber: 'Front Desk / Cashier',
    accountName: 'BYT Fleet Dispatch',
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
  { id: 'a1', fullName: 'Emmanuel Tetteh', phone: '024-111-9999', email: 'emmanuel@gmail.com', reason: 'I have 5 years of taxi driving experience in Accra and want to join a reputable fleet.', status: 'PENDING', createdAt: '2026-09-13' },
  { id: 'a2', fullName: 'Patience Adjei', phone: '055-999-8888', email: 'patience@gmail.com', reason: 'Looking for a reliable fleet to work with. I have a clean driving record.', status: 'PENDING', createdAt: '2026-09-14' },
];

export const demoReports: DriverReport[] = [
  { id: 'r1', type: 'ISSUE', description: 'Left front tire tread is very low, needs replacement soon.', suggestedSeverity: 'YELLOW', status: 'NEW', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22', createdAt: '2026-09-14T08:30:00' },
  { id: 'r2', type: 'ISSUE', description: 'Engine making unusual knocking sound when accelerating.', suggestedSeverity: 'RED', status: 'ACKNOWLEDGED', driverName: 'Ama Mensah', vehiclePlate: 'GR-5678-21', createdAt: '2026-09-13T14:15:00' },
  { id: 'r3', type: 'ABSENCE', description: 'Family emergency, will be unable to work for 3 days.', suggestedSeverity: null, status: 'ACKNOWLEDGED', driverName: 'Kofi Boateng', vehiclePlate: null, createdAt: '2026-09-13T09:00:00' },
  { id: 'r4', type: 'ISSUE', description: 'Brake pads worn out. Braking distance has increased significantly.', suggestedSeverity: 'RED', status: 'NEW', driverName: 'Yaa Serwaa', vehiclePlate: 'GR-3456-20', createdAt: '2026-09-14T11:45:00' },
  { id: 'r5', type: 'ISSUE', description: 'AC not cooling properly. Passengers complaining about heat.', suggestedSeverity: 'YELLOW', status: 'RESOLVED', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22', createdAt: '2026-09-12T16:20:00' },
  { id: 'r6', type: 'ISSUE', description: 'Windshield wiper on passenger side is broken.', suggestedSeverity: 'GREEN', status: 'NEW', driverName: 'Kwesi Appiah', vehiclePlate: 'GN-7890-22', createdAt: '2026-09-14T13:00:00' },
];

export const demoParts: PartsExchangeItem[] = [
  { id: 'p1', partName: 'Front Left Tire', cost: 280, date: '2026-09-10', reimbursementStatus: 'APPROVED', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22' },
  { id: 'p2', partName: 'Air Filter', cost: 45, date: '2026-09-08', reimbursementStatus: 'APPROVED', driverName: 'Ama Mensah', vehiclePlate: 'GR-5678-21' },
  { id: 'p3', partName: 'Brake Pads (Front)', cost: 120, date: '2026-09-12', reimbursementStatus: 'PENDING', driverName: 'Kofi Boateng', vehiclePlate: 'GW-9012-23' },
  { id: 'p4', partName: 'Battery', cost: 350, date: '2026-09-11', reimbursementStatus: 'PENDING', driverName: 'Yaa Serwaa', vehiclePlate: 'GR-3456-20' },
  { id: 'p5', partName: 'Engine Oil (5W-30)', cost: 85, date: '2026-09-05', reimbursementStatus: 'APPROVED', driverName: 'Kwame Asante', vehiclePlate: 'GR-1234-22' },
  { id: 'p6', partName: 'Wiper Blade Set', cost: 35, date: '2026-09-14', reimbursementStatus: 'APPROVED', driverName: 'Kwesi Appiah', vehiclePlate: 'GN-7890-22' },
];

export const demoSales: SalesRecord[] = [
  { id: 's1', weekLabel: '2026-W38', amount: 520.00, paymentMethod: 'MOMO', momoReference: 'MTN7834521098', confirmationStatus: 'PENDING', driverName: 'Kwame Asante', createdAt: '2026-09-14' },
  { id: 's2', weekLabel: '2026-W38', amount: 480.00, paymentMethod: 'CASH', confirmationStatus: 'PENDING', driverName: 'Ama Mensah', createdAt: '2026-09-14' },
  { id: 's3', weekLabel: '2026-W38', amount: 550.00, paymentMethod: 'MOMO', momoReference: 'MTN2345678901', confirmationStatus: 'CONFIRMED', driverName: 'Kofi Boateng', createdAt: '2026-09-14' },
  { id: 's4', weekLabel: '2026-W37', amount: 495.00, paymentMethod: 'CASH', confirmationStatus: 'CONFIRMED', driverName: 'Kwame Asante', createdAt: '2026-09-07' },
  { id: 's5', weekLabel: '2026-W37', amount: 510.00, paymentMethod: 'MOMO', momoReference: 'MTN9876543210', confirmationStatus: 'CONFIRMED', driverName: 'Ama Mensah', createdAt: '2026-09-07' },
  { id: 's6', weekLabel: '2026-W38', amount: 475.00, paymentMethod: 'MOMO', momoReference: 'MTN5678901234', confirmationStatus: 'PENDING', driverName: 'Yaa Serwaa', createdAt: '2026-09-14' },
  { id: 's7', weekLabel: '2026-W38', amount: 600.00, paymentMethod: 'CASH', confirmationStatus: 'PENDING', driverName: 'Kwesi Appiah', createdAt: '2026-09-14' },
  { id: 's8', weekLabel: '2026-W38', amount: 445.00, paymentMethod: 'MOMO', momoReference: 'MTN1122334455', confirmationStatus: 'CONFIRMED', driverName: 'Akua Donkor', createdAt: '2026-09-14' },
];

export const demoChatUsers: ChatUser[] = [
  { id: '2', name: 'Ama Mensah', online: true, lastMessage: 'Indeed! Heading towards Osu now', lastMessageTime: '5m ago', unread: 0 },
  { id: '3', name: 'Kofi Boateng', online: false, lastMessage: 'Do you know a good mechanic?', lastMessageTime: '2h ago', unread: 1 },
  { id: '4', name: 'Yaa Serwaa', online: true, unread: 0 },
  { id: '5', name: 'Kwesi Appiah', online: false, unread: 0 },
  { id: '6', name: 'Akua Donkor', online: true, unread: 0 },
  { id: '7', name: 'Nana Osei', online: false, unread: 0 },
  { id: '8', name: 'Efua Amoah', online: true, unread: 0 },
  { id: '12', name: 'Adwoa Poku', online: false, unread: 0 },
];

export const demoChatMessages: ChatMessageItem[] = [
  { id: 'm1', content: 'Hey, are you around Circle today?', senderId: '1', createdAt: '2026-09-14T14:30:00' },
  { id: 'm2', content: 'Yes, just dropped off a passenger near Kwame Nkrumah interchange', senderId: '2', createdAt: '2026-09-14T14:35:00' },
  { id: 'm3', content: 'Nice, the traffic is light today. Good runs!', senderId: '1', createdAt: '2026-09-14T14:40:00' },
  { id: 'm4', content: 'Indeed! Heading towards Osu now', senderId: '2', createdAt: '2026-09-14T14:45:00' },
];

export const demoLocations: LocationData[] = [
  { vehicleId: 'v1', plateNumber: 'GR-1234-22', driverName: 'Kwame Asante', severity: 'GREEN', lat: 5.6145, lng: -0.1870, timestamp: '2026-09-14T15:00:00' },
  { vehicleId: 'v2', plateNumber: 'GR-5678-21', driverName: 'Ama Mensah', severity: 'GREEN', lat: 5.5913, lng: -0.1740, timestamp: '2026-09-14T15:00:00' },
  { vehicleId: 'v3', plateNumber: 'GW-9012-23', driverName: 'Kofi Boateng', severity: 'YELLOW', lat: 5.6350, lng: -0.1550, timestamp: '2026-09-14T15:00:00' },
  { vehicleId: 'v4', plateNumber: 'GR-3456-20', driverName: 'Yaa Serwaa', severity: 'RED', lat: 5.5780, lng: -0.2100, timestamp: '2026-09-14T14:45:00' },
  { vehicleId: 'v5', plateNumber: 'GN-7890-22', driverName: 'Kwesi Appiah', severity: 'GREEN', lat: 5.6200, lng: -0.1650, timestamp: '2026-09-14T15:00:00' },
  { vehicleId: 'v6', plateNumber: 'GT-2345-21', driverName: 'Akua Donkor', severity: 'GREEN', lat: 5.5560, lng: -0.1980, timestamp: '2026-09-14T15:00:00' },
  { vehicleId: 'v7', plateNumber: 'GR-6789-23', driverName: 'Nana Osei', severity: 'YELLOW', lat: 5.6480, lng: -0.1820, timestamp: '2026-09-14T14:30:00' },
  { vehicleId: 'v8', plateNumber: 'GW-0123-22', driverName: 'Efua Amoah', severity: 'GREEN', lat: 5.6050, lng: -0.2210, timestamp: '2026-09-14T15:00:00' },
];

// Financial data for charts
export const weeklyRevenueData = [
  { week: 'W32', revenue: 3200, expenses: 580, profit: 2620 },
  { week: 'W33', revenue: 3450, expenses: 420, profit: 3030 },
  { week: 'W34', revenue: 3100, expenses: 890, profit: 2210 },
  { week: 'W35', revenue: 3600, expenses: 350, profit: 3250 },
  { week: 'W36', revenue: 3800, expenses: 670, profit: 3130 },
  { week: 'W37', revenue: 3550, expenses: 485, profit: 3065 },
  { week: 'W38', revenue: 3950, expenses: 415, profit: 3535 },
];

export const expenseBreakdown = [
  { category: 'Parts', amount: 915, color: '#d4a843' },
  { category: 'Reimbursements', amount: 445, color: '#8b5cf6' },
  { category: 'Fuel', amount: 320, color: '#06b6d4' },
  { category: 'Insurance', amount: 280, color: '#10b981' },
  { category: 'Other', amount: 150, color: '#f59e0b' },
];

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
