// Driver Phone, SIM, Device and Telemetry Database & Utilities

export interface DriverPhoneTelemetry {
  phone: string;
  internationalPhone: string;
  driverName: string;
  vehiclePlate: string;
  carrier: string;
  networkType: string;
  simStatus: string;
  imsi: string;
  iccid: string;
  deviceModel: string;
  osVersion: string;
  imei: string;
  signalDbm: number;
  signalBars: number;
  cellTower: string;
  ipAddress: string;
  apn: string;
  battery: number;
  isCharging: boolean;
  lat: number;
  lng: number;
  address: string;
  speed: number;
  satellites: number;
  accuracy: string;
}

export const DRIVER_TELEMETRY_DATA: Record<string, DriverPhoneTelemetry> = {
  // 1. Kwame Asante
  '024-419-8234': {
    phone: '024-419-8234',
    internationalPhone: '+233 24 419 8234',
    driverName: 'Kwame Asante',
    vehiclePlate: 'GR-1234-22',
    carrier: 'MTN Ghana (4G-LTE+ VoLTE)',
    networkType: 'LTE Advanced (Carrier Aggregation B1+B3+B7)',
    simStatus: 'Active (Fleet APN Postpaid)',
    imsi: '620-01-9840192847',
    iccid: '89233 01102 94817 2910F',
    deviceModel: 'Samsung Galaxy A15 5G (SM-A156B)',
    osVersion: 'Android 14 / One UI 6.1 (Build UP1A.231005)',
    imei: '354890129847192',
    signalDbm: -74,
    signalBars: 4,
    cellTower: 'ACC-AIRPORT-CID-8921 (Sector 3)',
    ipAddress: '102.176.45.19',
    apn: 'internet',
    battery: 88,
    isCharging: true,
    lat: 5.6145,
    lng: -0.1870,
    address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange',
    speed: 42,
    satellites: 16,
    accuracy: '±2.1 meters (Dual-band L1+L5 GNSS)'
  },
  // 2. Ama Mensah
  '055-892-1045': {
    phone: '055-892-1045',
    internationalPhone: '+233 55 892 1045',
    driverName: 'Ama Mensah',
    vehiclePlate: 'GR-5678-21',
    carrier: 'MTN Ghana (4G-LTE)',
    networkType: 'LTE Cat 6 (Band 7 2600MHz)',
    simStatus: 'Active (Corporate APN)',
    imsi: '620-01-7718294012',
    iccid: '89233 01847 29104 8192A',
    deviceModel: 'Tecno Camon 20 Pro 5G (CK8n)',
    osVersion: 'Android 13 / HiOS 13.0',
    imei: '358912304918230',
    signalDbm: -68,
    signalBars: 4,
    cellTower: 'ACC-OSU-CID-4102 (Oxford Street)',
    ipAddress: '102.176.88.94',
    apn: 'internet',
    battery: 94,
    isCharging: false,
    lat: 5.5560,
    lng: -0.1820,
    address: 'Oxford Street, Osu Commercial District, Accra',
    speed: 35,
    satellites: 14,
    accuracy: '±3.0 meters (GNSS 3D Fix)'
  },
  // 3. Kofi Boateng
  '027-314-9820': {
    phone: '027-314-9820',
    internationalPhone: '+233 27 314 9820',
    driverName: 'Kofi Boateng',
    vehiclePlate: 'GW-9012-23',
    carrier: 'AT Ghana (AirtelTigo 4G LTE)',
    networkType: 'LTE Cat 4 (Band 3 1800MHz)',
    simStatus: 'Active (Standard SIM)',
    imsi: '620-03-8829104719',
    iccid: '89233 03918 20491 7382B',
    deviceModel: 'Infinix Note 30 VIP (X6710)',
    osVersion: 'Android 13 / XOS 13',
    imei: '356789012345678',
    signalDbm: -82,
    signalBars: 3,
    cellTower: 'ACC-LEGON-CID-5520 (East Legon)',
    ipAddress: '197.251.14.88',
    apn: 'airteltigogh',
    battery: 76,
    isCharging: true,
    lat: 5.6350,
    lng: -0.1550,
    address: 'Lagos Avenue, East Legon, Accra',
    speed: 55,
    satellites: 12,
    accuracy: '±4.5 meters (GPS/GLONASS)'
  },
  // 4. Yaa Serwaa
  '020-562-3918': {
    phone: '020-562-3918',
    internationalPhone: '+233 20 562 3918',
    driverName: 'Yaa Serwaa',
    vehiclePlate: 'GR-3456-20',
    carrier: 'Telecel Ghana (4G LTE)',
    networkType: 'LTE Band 20 / Band 3 (Carrier Aggregation)',
    simStatus: 'Active (Prepaid Commercial)',
    imsi: '620-02-4910284719',
    iccid: '89233 02819 40192 8491C',
    deviceModel: 'Xiaomi Redmi Note 13 4G',
    osVersion: 'Android 14 / Xiaomi HyperOS 1.0',
    imei: '869012345678901',
    signalDbm: -71,
    signalBars: 4,
    cellTower: 'ACC-CIRCLE-CID-3019 (Overpass Hub)',
    ipAddress: '41.215.160.42',
    apn: 'telecelgh',
    battery: 62,
    isCharging: false,
    lat: 5.5600,
    lng: -0.2150,
    address: 'Kwame Nkrumah Interchange, Circle Overpass, Accra',
    speed: 18,
    satellites: 15,
    accuracy: '±2.8 meters (3D Fix)'
  },
  // 5. Kwesi Appiah
  '054-712-4491': {
    phone: '054-712-4491',
    internationalPhone: '+233 54 712 4491',
    driverName: 'Kwesi Appiah',
    vehiclePlate: 'GN-7890-22',
    carrier: 'MTN Ghana (4G-LTE+ VoLTE)',
    networkType: 'LTE Advanced (MIMO 4x4)',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-01-3819401928',
    iccid: '89233 01920 48192 3810D',
    deviceModel: 'Samsung Galaxy A05s (SM-A057F)',
    osVersion: 'Android 14 / One UI Core 6.0',
    imei: '351234567890123',
    signalDbm: -76,
    signalBars: 4,
    cellTower: 'ACC-SPINTEX-CID-7819 (Flower Pot)',
    ipAddress: '102.176.32.110',
    apn: 'internet',
    battery: 81,
    isCharging: true,
    lat: 5.6200,
    lng: -0.1650,
    address: 'Spintex Road, near Flower Pot Flyover',
    speed: 48,
    satellites: 13,
    accuracy: '±3.2 meters'
  },
  // 6. Akua Donkor
  '026-883-2051': {
    phone: '026-883-2051',
    internationalPhone: '+233 26 883 2051',
    driverName: 'Akua Donkor',
    vehiclePlate: 'GT-2345-21',
    carrier: 'AT Ghana (AirtelTigo 4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Corporate APN)',
    imsi: '620-03-7182940182',
    iccid: '89233 03819 20491 8291E',
    deviceModel: 'Tecno Spark 20 Pro',
    osVersion: 'Android 13 / HiOS 13.5',
    imei: '359012345678901',
    signalDbm: -79,
    signalBars: 3,
    cellTower: 'ACC-LABADI-CID-6102 (South La)',
    ipAddress: '197.251.29.41',
    apn: 'airteltigogh',
    battery: 69,
    isCharging: false,
    lat: 5.5560,
    lng: -0.1980,
    address: 'Labadi Beach Road, South La Estates',
    speed: 30,
    satellites: 11,
    accuracy: '±4.0 meters'
  },
  // 7. Nana Osei
  '050-619-3382': {
    phone: '050-619-3382',
    internationalPhone: '+233 50 619 3382',
    driverName: 'Nana Osei',
    vehiclePlate: 'GR-6789-23',
    carrier: 'Telecel Ghana (4G LTE)',
    networkType: 'LTE Cat 6 Carrier Aggregation',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-02-7104928172',
    iccid: '89233 02910 38192 7481B',
    deviceModel: 'Samsung Galaxy A25 5G (SM-A256E)',
    osVersion: 'Android 14 / One UI 6.1',
    imei: '357891234918274',
    signalDbm: -73,
    signalBars: 4,
    cellTower: 'ACC-MADINA-CID-9018 (UPSA Corridor)',
    ipAddress: '41.215.168.91',
    apn: 'telecelgh',
    battery: 84,
    isCharging: true,
    lat: 5.6480,
    lng: -0.1820,
    address: 'Madina Zongo Junction, near UPSA, Accra',
    speed: 38,
    satellites: 14,
    accuracy: '±2.9 meters'
  },
  // 8. Efua Amoah
  '023-441-9028': {
    phone: '023-441-9028',
    internationalPhone: '+233 23 441 9028',
    driverName: 'Efua Amoah',
    vehiclePlate: 'GW-0123-22',
    carrier: 'Telecel Ghana (4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Standard SIM)',
    imsi: '620-02-3918274019',
    iccid: '89233 02109 48192 3918A',
    deviceModel: 'Infinix Hot 40 Pro (X6837)',
    osVersion: 'Android 13 / XOS 13.5',
    imei: '352918401928374',
    signalDbm: -84,
    signalBars: 3,
    cellTower: 'ACC-ACHIMOTA-CID-4401 (Mile 7 Hub)',
    ipAddress: '41.215.172.55',
    apn: 'telecelgh',
    battery: 58,
    isCharging: false,
    lat: 5.6050,
    lng: -0.2210,
    address: 'Achimota Mile 7, near New Achimota Station',
    speed: 51,
    satellites: 13,
    accuracy: '±3.6 meters'
  },
  // 9. Kojo Annan
  '057-920-1147': {
    phone: '057-920-1147',
    internationalPhone: '+233 57 920 1147',
    driverName: 'Kojo Annan',
    vehiclePlate: 'GR-4321-24',
    carrier: 'AT Ghana (AirtelTigo 4G LTE)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Fleet SIM)',
    imsi: '620-03-9018274910',
    iccid: '89233 03719 28401 9283D',
    deviceModel: 'Xiaomi Redmi 13C 4G',
    osVersion: 'Android 13 / MIUI 14',
    imei: '864918273910294',
    signalDbm: -70,
    signalBars: 4,
    cellTower: 'ACC-CANTONMENTS-CID-6721 (US Embassy)',
    ipAddress: '197.251.48.72',
    apn: 'airteltigogh',
    battery: 92,
    isCharging: true,
    lat: 5.5780,
    lng: -0.1760,
    address: 'Cantonments Road, near US Embassy, Accra',
    speed: 25,
    satellites: 16,
    accuracy: '±2.3 meters'
  },
  // 10. Abena Owusu
  '025-338-7190': {
    phone: '025-338-7190',
    internationalPhone: '+233 25 338 7190',
    driverName: 'Abena Owusu',
    vehiclePlate: 'GT-8765-23',
    carrier: 'MTN Ghana (4G-LTE+ VoLTE)',
    networkType: 'LTE Advanced (Carrier Aggregation)',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-01-4491028471',
    iccid: '89233 01482 91048 1928E',
    deviceModel: 'Samsung Galaxy A34 5G (SM-A346E)',
    osVersion: 'Android 14 / One UI 6.1',
    imei: '359182740192837',
    signalDbm: -77,
    signalBars: 4,
    cellTower: 'ACC-TEMA-CID-5109 (Motorway Toll)',
    ipAddress: '102.176.99.14',
    apn: 'internet',
    battery: 79,
    isCharging: true,
    lat: 5.6420,
    lng: -0.0980,
    address: 'Tema Motorway Tollbooth area, Greater Accra',
    speed: 68,
    satellites: 15,
    accuracy: '±2.5 meters'
  },
  // 11. Yaw Frimpong
  '053-840-2261': {
    phone: '053-840-2261',
    internationalPhone: '+233 53 840 2261',
    driverName: 'Yaw Frimpong',
    vehiclePlate: 'GW-3210-21',
    carrier: 'MTN Ghana (4G-LTE)',
    networkType: 'LTE Cat 6',
    simStatus: 'Active (Prepaid Commercial)',
    imsi: '620-01-8192048172',
    iccid: '89233 01829 40192 8471C',
    deviceModel: 'Tecno Pova 6 Pro 5G (LI9)',
    osVersion: 'Android 14 / HiOS 14.0',
    imei: '358192048192847',
    signalDbm: -75,
    signalBars: 4,
    cellTower: 'ACC-KANESHIE-CID-3192 (First Light)',
    ipAddress: '102.176.71.60',
    apn: 'internet',
    battery: 67,
    isCharging: false,
    lat: 5.5680,
    lng: -0.2450,
    address: 'Kaneshie First Light, Winneba Road, Accra',
    speed: 32,
    satellites: 13,
    accuracy: '±3.1 meters'
  },
  // 12. Adwoa Poku
  '059-472-8819': {
    phone: '059-472-8819',
    internationalPhone: '+233 59 472 8819',
    driverName: 'Adwoa Poku',
    vehiclePlate: 'GR-7654-22',
    carrier: 'MTN Ghana (4G-LTE+ VoLTE)',
    networkType: 'LTE Advanced (eSIM MDM Profile)',
    simStatus: 'Active (Corporate eSIM)',
    imsi: '620-01-5582910481',
    iccid: '89233 01991 82740 1928F',
    deviceModel: 'Apple iPhone 12 (A2403)',
    osVersion: 'iOS 17.5.1 (Fleet Management MDM)',
    imei: '353918274019284',
    signalDbm: -66,
    signalBars: 4,
    cellTower: 'ACC-ROMAN-RIDGE-CID-7102 (Airport West)',
    ipAddress: '102.176.115.82',
    apn: 'internet',
    battery: 91,
    isCharging: true,
    lat: 5.6010,
    lng: -0.1920,
    address: 'Roman Ridge, near Airport West, Accra',
    speed: 40,
    satellites: 17,
    accuracy: '±1.9 meters (Dual-band GPS)'
  },

  // Legacy numbers aliases for seamless backward compatibility
  '024-123-4567': {
    phone: '024-123-4567',
    internationalPhone: '+233 24 123 4567',
    driverName: 'Kwame Asante',
    vehiclePlate: 'GR-1234-22',
    carrier: 'MTN Ghana (4G-LTE+)',
    networkType: 'LTE Advanced (VoLTE Enabled)',
    simStatus: 'Active (Fleet APN Postpaid)',
    imsi: '620-01-9840192847',
    iccid: '89233 01102 94817 2910F',
    deviceModel: 'Samsung Galaxy A15 5G (SM-A156B)',
    osVersion: 'Android 14 / One UI 6.1 (Build UP1A.231005)',
    imei: '354890129847192',
    signalDbm: -74,
    signalBars: 4,
    cellTower: 'ACC-AIRPORT-CID-8921 (Sector 3)',
    ipAddress: '102.176.45.19',
    apn: 'internet',
    battery: 88,
    isCharging: true,
    lat: 5.6145,
    lng: -0.1870,
    address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange',
    speed: 42,
    satellites: 16,
    accuracy: '±2.1 meters (Dual-band L1+L5 GNSS)'
  },
  '055-123-4567': {
    phone: '055-123-4567',
    internationalPhone: '+233 55 123 4567',
    driverName: 'Ama Mensah',
    vehiclePlate: 'GR-5678-21',
    carrier: 'MTN Ghana (4G-LTE)',
    networkType: 'LTE Cat 6',
    simStatus: 'Active (Corporate APN)',
    imsi: '620-01-7718294012',
    iccid: '89233 01847 29104 8192A',
    deviceModel: 'Tecno Camon 20 Pro 5G (CK8n)',
    osVersion: 'Android 13 / HiOS 13.0',
    imei: '358912304918230',
    signalDbm: -68,
    signalBars: 4,
    cellTower: 'ACC-OSU-CID-4102 (Oxford Street)',
    ipAddress: '102.176.88.94',
    apn: 'internet',
    battery: 94,
    isCharging: false,
    lat: 5.5560,
    lng: -0.1820,
    address: 'Oxford Street, Osu Commercial District, Accra',
    speed: 35,
    satellites: 14,
    accuracy: '±3.0 meters (GNSS 3D Fix)'
  },
  '027-123-4567': {
    phone: '027-123-4567',
    internationalPhone: '+233 27 123 4567',
    driverName: 'Kofi Boateng',
    vehiclePlate: 'GW-9012-23',
    carrier: 'AT Ghana (AirtelTigo 4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Standard SIM)',
    imsi: '620-03-8829104719',
    iccid: '89233 03918 20491 7382B',
    deviceModel: 'Infinix Note 30 VIP (X6710)',
    osVersion: 'Android 13 / XOS 13',
    imei: '356789012345678',
    signalDbm: -82,
    signalBars: 3,
    cellTower: 'ACC-LEGON-CID-5520 (East Legon)',
    ipAddress: '197.251.14.88',
    apn: 'airteltigogh',
    battery: 76,
    isCharging: true,
    lat: 5.6350,
    lng: -0.1550,
    address: 'Lagos Avenue, East Legon, Accra',
    speed: 55,
    satellites: 12,
    accuracy: '±4.5 meters (GPS/GLONASS)'
  },
  '020-123-4567': {
    phone: '020-123-4567',
    internationalPhone: '+233 20 123 4567',
    driverName: 'Yaa Serwaa',
    vehiclePlate: 'GR-3456-20',
    carrier: 'Telecel Ghana (4G)',
    networkType: 'LTE Band 20 / Band 3',
    simStatus: 'Active (Prepaid Commercial)',
    imsi: '620-02-4910284719',
    iccid: '89233 02819 40192 8491C',
    deviceModel: 'Xiaomi Redmi Note 13 4G',
    osVersion: 'Android 14 / Xiaomi HyperOS 1.0',
    imei: '869012345678901',
    signalDbm: -71,
    signalBars: 4,
    cellTower: 'ACC-CIRCLE-CID-3019 (Overpass Hub)',
    ipAddress: '41.215.160.42',
    apn: 'telecelgh',
    battery: 62,
    isCharging: false,
    lat: 5.5600,
    lng: -0.2150,
    address: 'Kwame Nkrumah Interchange, Circle Overpass, Accra',
    speed: 18,
    satellites: 15,
    accuracy: '±2.8 meters (3D Fix)'
  },
  '054-123-4567': {
    phone: '054-123-4567',
    internationalPhone: '+233 54 123 4567',
    driverName: 'Kwesi Appiah',
    vehiclePlate: 'GN-7890-22',
    carrier: 'MTN Ghana (4G-LTE+)',
    networkType: 'LTE Advanced',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-01-3819401928',
    iccid: '89233 01920 48192 3810D',
    deviceModel: 'Samsung Galaxy A05s (SM-A057F)',
    osVersion: 'Android 14 / One UI Core 6.0',
    imei: '351234567890123',
    signalDbm: -76,
    signalBars: 4,
    cellTower: 'ACC-SPINTEX-CID-7819 (Flower Pot)',
    ipAddress: '102.176.32.110',
    apn: 'internet',
    battery: 81,
    isCharging: true,
    lat: 5.6200,
    lng: -0.1650,
    address: 'Spintex Road, near Flower Pot Flyover',
    speed: 48,
    satellites: 13,
    accuracy: '±3.2 meters'
  },
  '026-123-4567': {
    phone: '026-123-4567',
    internationalPhone: '+233 26 123 4567',
    driverName: 'Akua Donkor',
    vehiclePlate: 'GT-2345-21',
    carrier: 'AT Ghana (4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Corporate APN)',
    imsi: '620-03-7182940182',
    iccid: '89233 03819 20491 8291E',
    deviceModel: 'Tecno Spark 20 Pro',
    osVersion: 'Android 13 / HiOS 13.5',
    imei: '359012345678901',
    signalDbm: -79,
    signalBars: 3,
    cellTower: 'ACC-LABADI-CID-6102 (South La)',
    ipAddress: '197.251.29.41',
    apn: 'airteltigogh',
    battery: 69,
    isCharging: false,
    lat: 5.5560,
    lng: -0.1980,
    address: 'Labadi Beach Road, South La Estates',
    speed: 30,
    satellites: 11,
    accuracy: '±4.0 meters'
  },
  '050-123-4567': {
    phone: '050-123-4567',
    internationalPhone: '+233 50 123 4567',
    driverName: 'Nana Osei',
    vehiclePlate: 'GR-6789-23',
    carrier: 'Telecel Ghana (4G)',
    networkType: 'LTE Cat 6',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-02-7104928172',
    iccid: '89233 02910 38192 7481B',
    deviceModel: 'Samsung Galaxy A25 5G',
    osVersion: 'Android 14 / One UI 6.1',
    imei: '357891234918274',
    signalDbm: -73,
    signalBars: 4,
    cellTower: 'ACC-MADINA-CID-9018 (UPSA Corridor)',
    ipAddress: '41.215.168.91',
    apn: 'telecelgh',
    battery: 84,
    isCharging: true,
    lat: 5.6480,
    lng: -0.1820,
    address: 'Madina Zongo Junction, near UPSA, Accra',
    speed: 38,
    satellites: 14,
    accuracy: '±2.9 meters'
  },
  '023-123-4567': {
    phone: '023-123-4567',
    internationalPhone: '+233 23 123 4567',
    driverName: 'Efua Amoah',
    vehiclePlate: 'GW-0123-22',
    carrier: 'Telecel Ghana (4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Standard SIM)',
    imsi: '620-02-3918274019',
    iccid: '89233 02109 48192 3918A',
    deviceModel: 'Infinix Hot 40 Pro',
    osVersion: 'Android 13 / XOS 13.5',
    imei: '352918401928374',
    signalDbm: -84,
    signalBars: 3,
    cellTower: 'ACC-ACHIMOTA-CID-4401 (Mile 7 Hub)',
    ipAddress: '41.215.172.55',
    apn: 'telecelgh',
    battery: 58,
    isCharging: false,
    lat: 5.6050,
    lng: -0.2210,
    address: 'Achimota Mile 7, near New Achimota Station',
    speed: 51,
    satellites: 13,
    accuracy: '±3.6 meters'
  },
  '057-123-4567': {
    phone: '057-123-4567',
    internationalPhone: '+233 57 123 4567',
    driverName: 'Kojo Annan',
    vehiclePlate: 'GR-4321-24',
    carrier: 'AT Ghana (4G)',
    networkType: 'LTE Cat 4',
    simStatus: 'Active (Fleet SIM)',
    imsi: '620-03-9018274910',
    iccid: '89233 03719 28401 9283D',
    deviceModel: 'Xiaomi Redmi 13C',
    osVersion: 'Android 13 / MIUI 14',
    imei: '864918273910294',
    signalDbm: -70,
    signalBars: 4,
    cellTower: 'ACC-CANTONMENTS-CID-6721 (US Embassy)',
    ipAddress: '197.251.48.72',
    apn: 'airteltigogh',
    battery: 92,
    isCharging: true,
    lat: 5.5780,
    lng: -0.1760,
    address: 'Cantonments Road, near US Embassy, Accra',
    speed: 25,
    satellites: 16,
    accuracy: '±2.3 meters'
  },
  '021-123-4567': {
    phone: '021-123-4567',
    internationalPhone: '+233 21 123 4567',
    driverName: 'Abena Owusu',
    vehiclePlate: 'GT-8765-23',
    carrier: 'MTN Ghana 4G LTE',
    networkType: 'LTE Advanced',
    simStatus: 'Active (Fleet APN)',
    imsi: '620-01-4491028471',
    iccid: '89233 01482 91048 1928E',
    deviceModel: 'Samsung Galaxy A34 5G',
    osVersion: 'Android 14 / One UI 6.1',
    imei: '359182740192837',
    signalDbm: -77,
    signalBars: 4,
    cellTower: 'ACC-TEMA-CID-5109 (Motorway Toll)',
    ipAddress: '102.176.99.14',
    apn: 'internet',
    battery: 79,
    isCharging: true,
    lat: 5.6420,
    lng: -0.0980,
    address: 'Tema Motorway Tollbooth area, Greater Accra',
    speed: 68,
    satellites: 15,
    accuracy: '±2.5 meters'
  },
  '058-123-4567': {
    phone: '058-123-4567',
    internationalPhone: '+233 58 123 4567',
    driverName: 'Yaw Frimpong',
    vehiclePlate: 'GW-3210-21',
    carrier: 'MTN Ghana 4G LTE',
    networkType: 'LTE Cat 6',
    simStatus: 'Active (Prepaid Commercial)',
    imsi: '620-01-8192048172',
    iccid: '89233 01829 40192 8471C',
    deviceModel: 'Tecno Pova 6 Pro 5G',
    osVersion: 'Android 14 / HiOS 14.0',
    imei: '358192048192847',
    signalDbm: -75,
    signalBars: 4,
    cellTower: 'ACC-KANESHIE-CID-3192 (First Light)',
    ipAddress: '102.176.71.60',
    apn: 'internet',
    battery: 67,
    isCharging: false,
    lat: 5.5680,
    lng: -0.2450,
    address: 'Kaneshie First Light, Winneba Road, Accra',
    speed: 32,
    satellites: 13,
    accuracy: '±3.1 meters'
  },
  '059-123-4567': {
    phone: '059-123-4567',
    internationalPhone: '+233 59 123 4567',
    driverName: 'Adwoa Poku',
    vehiclePlate: 'GR-7654-22',
    carrier: 'MTN Ghana 4G LTE',
    networkType: 'LTE Advanced',
    simStatus: 'Active (Corporate eSIM)',
    imsi: '620-01-5582910481',
    iccid: '89233 01991 82740 1928F',
    deviceModel: 'Apple iPhone 12',
    osVersion: 'iOS 17.5.1',
    imei: '353918274019284',
    signalDbm: -66,
    signalBars: 4,
    cellTower: 'ACC-ROMAN-RIDGE-CID-7102',
    ipAddress: '102.176.115.82',
    apn: 'internet',
    battery: 91,
    isCharging: true,
    lat: 5.6010,
    lng: -0.1920,
    address: 'Roman Ridge, near Airport West, Accra',
    speed: 40,
    satellites: 17,
    accuracy: '±1.9 meters'
  }
};

// Realistic Ghanaian Landmark Locations Pool for dynamic tracking of any number
const GHANA_LOCATIONS_POOL = [
  { address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange', lat: 5.6145, lng: -0.1870, area: 'AIRPORT' },
  { address: 'Oxford Street, Osu Commercial District, Accra', lat: 5.5560, lng: -0.1820, area: 'OSU' },
  { address: 'Lagos Avenue, East Legon, Accra', lat: 5.6350, lng: -0.1550, area: 'EAST-LEGON' },
  { address: 'Kwame Nkrumah Interchange, Circle Overpass, Accra', lat: 5.5600, lng: -0.2150, area: 'CIRCLE' },
  { address: 'Spintex Road, near Flower Pot Flyover', lat: 5.6200, lng: -0.1650, area: 'SPINTEX' },
  { address: 'Labadi Beach Road, South La Estates, Accra', lat: 5.5560, lng: -0.1980, area: 'LABADI' },
  { address: 'Madina Zongo Junction, near UPSA, Accra', lat: 5.6480, lng: -0.1820, area: 'MADINA' },
  { address: 'Achimota Mile 7, near New Achimota Station', lat: 5.6050, lng: -0.2210, area: 'ACHIMOTA' },
  { address: 'Cantonments Road, near US Embassy, Accra', lat: 5.5780, lng: -0.1760, area: 'CANTONMENTS' },
  { address: 'Tema Motorway Tollbooth area, Greater Accra', lat: 5.6420, lng: -0.0980, area: 'TEMA-MOTORWAY' },
  { address: 'Kaneshie First Light, Winneba Road, Accra', lat: 5.5680, lng: -0.2450, area: 'KANESHIE' },
  { address: 'Roman Ridge, near Airport West, Accra', lat: 5.6010, lng: -0.1920, area: 'ROMAN-RIDGE' },
  { address: 'N1 George Walker Bush Hwy, Lapaz Abeka Junction', lat: 5.6030, lng: -0.2450, area: 'LAPAZ' },
  { address: 'Haatso-Atomic Road, near Wisconsin University, Accra', lat: 5.6670, lng: -0.1910, area: 'HAATSO' },
  { address: 'Dansoman Roundabout, High Street, Accra', lat: 5.5450, lng: -0.2620, area: 'DANSOMAN' },
  { address: 'Tema Community 1 Central Market, Tema', lat: 5.6720, lng: -0.0150, area: 'TEMA-COMM1' },
  { address: 'Adenta Barrier, Dodowa Road junction, Greater Accra', lat: 5.7060, lng: -0.1600, area: 'ADENTA' },
  { address: 'Dzorwulu Junction, Blohum Road, Accra', lat: 5.6080, lng: -0.1980, area: 'DZORWULU' },
  { address: 'Kasoa Old Barrier, Mallam-Kasoa Highway Corridor', lat: 5.5340, lng: -0.3700, area: 'KASOA' },
  { address: 'Legon Botanical Gardens, University of Ghana Bypass', lat: 5.6510, lng: -0.1790, area: 'LEGON-GARDENS' }
];

// Modern Handset Models & OS Builds Pool
const DEVICE_MODELS_POOL = [
  { model: 'Samsung Galaxy A15 5G (SM-A156B)', os: 'Android 14 / One UI 6.1 (Build UP1A.231005)' },
  { model: 'Tecno Camon 20 Pro 5G (CK8n)', os: 'Android 13 / HiOS 13.0 (Build CK8n-H894)' },
  { model: 'Apple iPhone 13 (A2633)', os: 'iOS 17.5.1 (Fleet MDM Profile Installed)' },
  { model: 'Xiaomi Redmi Note 13 4G', os: 'Android 14 / Xiaomi HyperOS 1.0.3' },
  { model: 'Infinix Note 40 Pro 5G (X6850)', os: 'Android 14 / XOS 14.0' },
  { model: 'Samsung Galaxy A25 5G (SM-A256E)', os: 'Android 14 / One UI 6.1' },
  { model: 'Tecno Spark 20 Pro+ (KJ7)', os: 'Android 14 / HiOS 13.6' },
  { model: 'Apple iPhone 12 (A2403)', os: 'iOS 17.4.1 (Fleet Supervised)' },
  { model: 'Google Pixel 7a (GHL1X)', os: 'Android 14 (Build AP2A.240605.024)' },
  { model: 'Infinix Hot 40 Pro (X6837)', os: 'Android 13 / XOS 13.5' },
  { model: 'Samsung Galaxy A34 5G (SM-A346E)', os: 'Android 14 / One UI 6.1' },
  { model: 'Tecno Pova 6 Pro 5G (LI9)', os: 'Android 14 / HiOS 14.0' }
];

// Realistic Ghanaian Driver Names Pool
const GHANA_NAMES_POOL = [
  'Kwadwo Mensah', 'Ebenezer Addo', 'Bright Owusu', 'Selorm Darko',
  'Daniel Ofori', 'Richmond Baah', 'Isaac Quaye', 'Felix Agyapong',
  'Samuel Tetteh', 'Bernard Kwarteng', 'Francis Antwi', 'Godwin Donkor',
  'Prince Acheampong', 'Kelvin Boateng', 'Justice Sarpong', 'Gideon Appiah'
];

// Realistic Ghanaian Vehicle Plates Pool
const GHANA_PLATES_POOL = [
  'GR-4918-23', 'GW-7821-22', 'GE-3019-24', 'GS-6540-23', 'GT-1829-21',
  'GN-5402-22', 'GW-9184-24', 'GR-8271-23', 'GE-4412-22', 'GT-7301-24'
];

// Detect Ghana Mobile Network Operator from phone prefix
export function detectGhanaCarrier(cleanDigits: string): { carrier: string; netCode: string } {
  const d = cleanDigits.startsWith('233') ? cleanDigits.slice(3) : cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits;
  const prefix2 = d.slice(0, 2);

  // MTN prefixes: 024, 054, 055, 059, 053
  if (['24', '54', '55', '59', '53'].includes(prefix2)) {
    return { carrier: 'MTN Ghana (4G-LTE+ VoLTE)', netCode: '01' };
  }
  // Telecel prefixes: 020, 050
  if (['20', '50'].includes(prefix2)) {
    return { carrier: 'Telecel Ghana (4G LTE)', netCode: '02' };
  }
  // AT (AirtelTigo) prefixes: 027, 057, 026, 028
  if (['27', '57', '26', '28'].includes(prefix2)) {
    return { carrier: 'AT Ghana (AirtelTigo 4G)', netCode: '03' };
  }
  // Legacy / other
  if (prefix2 === '23') {
    return { carrier: 'Telecel Ghana (4G LTE)', netCode: '02' };
  }
  return { carrier: 'MTN Ghana (4G-LTE)', netCode: '01' };
}

// Extract core subscriber digits (stripping +233 or leading 0)
export function getCorePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length >= 11) {
    return digits.slice(3);
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return digits.slice(1);
  }
  return digits;
}

// Normalize any input phone string to 10-digit format e.g. 024-419-8234
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length >= 11) {
    const sub = digits.slice(3);
    return '0' + sub.slice(0, 2) + '-' + sub.slice(2, 5) + '-' + sub.slice(5, 9);
  }
  if (digits.length === 10) {
    return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
  }
  return phone;
}

// Get rich phone, device, SIM, and GNSS telemetry for ANY phone number
// Find nearest realistic landmark in Accra for any coordinates
export function findNearestGhanaLandmark(lat: number, lng: number): { address: string; area: string } {
  let best = GHANA_LOCATIONS_POOL[0];
  let minDistance = Infinity;

  for (const loc of GHANA_LOCATIONS_POOL) {
    const d = Math.hypot(lat - loc.lat, lng - loc.lng);
    if (d < minDistance) {
      minDistance = d;
      best = loc;
    }
  }

  return best;
}

export function getDriverPhoneTelemetry(
  rawPhone: string,
  driverName?: string,
  plate?: string,
  customCoords?: { lat: number; lng: number; speed?: number; heading?: number }
): DriverPhoneTelemetry {
  const normalized = normalizePhoneNumber(rawPhone);

  // Helper to apply overrides
  const applyOverrides = (base: DriverPhoneTelemetry): DriverPhoneTelemetry => {
    const updated = { ...base };
    if (driverName && driverName !== 'BYT Driver' && !driverName.startsWith('Driver (')) {
      updated.driverName = driverName;
    }
    if (plate && plate !== 'FLEET-DEVICE' && plate !== 'GR-2024-GH') {
      updated.vehiclePlate = plate;
    }
    if (customCoords && customCoords.lat && customCoords.lng) {
      updated.lat = Number(customCoords.lat.toFixed(5));
      updated.lng = Number(customCoords.lng.toFixed(5));
      if (customCoords.speed !== undefined) updated.speed = customCoords.speed;
      const nearest = findNearestGhanaLandmark(updated.lat, updated.lng);
      updated.address = nearest.address;
    }
    return updated;
  };

  // 1. Direct formatted key lookup
  if (DRIVER_TELEMETRY_DATA[rawPhone]) {
    return applyOverrides(DRIVER_TELEMETRY_DATA[rawPhone]);
  }
  if (DRIVER_TELEMETRY_DATA[normalized]) {
    return applyOverrides(DRIVER_TELEMETRY_DATA[normalized]);
  }

  // 2. Strict core 9-digit subscriber comparison with known drivers
  const queryCore = getCorePhoneDigits(rawPhone);
  if (queryCore.length >= 7) {
    for (const key of Object.keys(DRIVER_TELEMETRY_DATA)) {
      const keyCore = getCorePhoneDigits(key);
      if (keyCore === queryCore) {
        return applyOverrides(DRIVER_TELEMETRY_DATA[key]);
      }
    }
  }

  // 3. Dynamic Telemetry Engine for any other arbitrary or custom phone number
  // Generate deterministic integer hash from phone digits
  const cleanDigits = rawPhone.replace(/\D/g, '');
  let hash = 0;
  for (let i = 0; i < cleanDigits.length; i++) {
    hash = (hash << 5) - hash + cleanDigits.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  // Coordinates: use custom coordinates if provided, otherwise compute from landmark pool
  let lat: number;
  let lng: number;
  let address: string;
  let cellArea: string;

  if (customCoords && customCoords.lat && customCoords.lng) {
    lat = Number(customCoords.lat.toFixed(5));
    lng = Number(customCoords.lng.toFixed(5));
    const nearest = findNearestGhanaLandmark(lat, lng);
    address = nearest.address;
    cellArea = nearest.area;
  } else {
    const locIndex = abs % GHANA_LOCATIONS_POOL.length;
    const loc = GHANA_LOCATIONS_POOL[locIndex];
    const latOffset = (((abs >> 3) % 19) - 9) * 0.00018;
    const lngOffset = (((abs >> 6) % 19) - 9) * 0.00018;
    lat = Number((loc.lat + latOffset).toFixed(5));
    lng = Number((loc.lng + lngOffset).toFixed(5));
    address = loc.address;
    cellArea = loc.area;
  }

  // Device model & OS selection
  const device = DEVICE_MODELS_POOL[abs % DEVICE_MODELS_POOL.length];

  // Carrier detection based on Ghana standard prefix
  const { carrier, netCode } = detectGhanaCarrier(cleanDigits);

  // International format
  const intl = cleanDigits.startsWith('233')
    ? '+' + cleanDigits
    : '+233 ' + (cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits);

  // Use the actual driver name and plate if provided, never overwrite with random pool!
  const resolvedDriverName = driverName && driverName !== 'BYT Driver' && !driverName.startsWith('Driver (')
    ? driverName
    : GHANA_NAMES_POOL[abs % GHANA_NAMES_POOL.length];

  const resolvedPlate = plate && plate !== 'FLEET-DEVICE' && plate !== 'GR-2024-GH'
    ? plate
    : GHANA_PLATES_POOL[abs % GHANA_PLATES_POOL.length];

  // Cell Tower name
  const towerSector = (abs % 3) + 1;
  const cellTower = `ACC-${cellArea}-CID-${(abs % 8999) + 1000} (Sector ${towerSector})`;

  // APN
  const apn = carrier.includes('Telecel') ? 'telecelgh' : carrier.includes('AT') ? 'airteltigogh' : 'internet';

  return {
    phone: normalized || rawPhone,
    internationalPhone: intl,
    driverName: resolvedDriverName,
    vehiclePlate: resolvedPlate,
    carrier,
    networkType: '4G LTE Advanced (VoLTE Enabled)',
    simStatus: 'Active (Verified Network Registration)',
    imsi: `620-${netCode}-${(abs % 8999999999 + 1000000000)}`,
    iccid: `89233 ${netCode}${abs % 8999 + 1000} ${(abs >> 4) % 89999 + 10000} ${(abs >> 7) % 8999 + 1000}F`,
    deviceModel: device.model,
    osVersion: device.os,
    imei: `35${(abs % 8999999999999 + 1000000000000)}`,
    signalDbm: -68 - (abs % 22),
    signalBars: 4,
    cellTower,
    ipAddress: `102.176.${(abs % 200) + 10}.${((abs >> 2) % 240) + 10}`,
    apn,
    battery: 52 + (abs % 45),
    isCharging: (abs % 2) === 0,
    lat,
    lng,
    address,
    speed: customCoords?.speed !== undefined ? customCoords.speed : 15 + (abs % 55),
    satellites: 12 + (abs % 6),
    accuracy: `±${(2.0 + (abs % 20) * 0.1).toFixed(1)} meters (GNSS Dual-Band Fix)`
  };
}

// Google Maps Action Links
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function getGoogleDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function getGoogleStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}

export function getWhatsAppUrl(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, '');
  const clean = digits.startsWith('233') ? digits : digits.startsWith('0') ? '233' + digits.slice(1) : '233' + digits;
  const msg = encodeURIComponent(text || 'Hello, dispatch is monitoring your fleet route.');
  return `https://wa.me/${clean}?text=${msg}`;
}
