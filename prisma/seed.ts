import { PrismaClient } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { hashSync } from 'bcryptjs';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.locationPing.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.salesRecord.deleteMany();
  await prisma.partsExchange.deleteMany();
  await prisma.driverReport.deleteMany();
  await prisma.application.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.admin.deleteMany();

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      name: 'BYT Admin',
      email: 'admin@byt.com',
      passwordHash: hashSync('admin123', 10),
    },
  });

  console.log('Created admin:', admin.email);

  // Create drivers
  const driverData = [
    { name: 'Kwame Asante', phone: '0241234567', email: 'kwame@gmail.com', status: 'ACTIVE' },
    { name: 'Ama Mensah', phone: '0551234567', email: 'ama@gmail.com', status: 'ACTIVE' },
    { name: 'Kofi Boateng', phone: '0271234567', email: 'kofi@gmail.com', status: 'ACTIVE' },
    { name: 'Yaa Serwaa', phone: '0201234567', email: 'yaa@gmail.com', status: 'ACTIVE' },
    { name: 'Kwesi Appiah', phone: '0541234567', email: 'kwesi@gmail.com', status: 'ACTIVE' },
    { name: 'Akua Donkor', phone: '0261234567', email: 'akua@gmail.com', status: 'ACTIVE' },
    { name: 'Nana Osei', phone: '0501234567', email: 'nana@gmail.com', status: 'ACTIVE' },
    { name: 'Efua Amoah', phone: '0231234567', email: 'efua@gmail.com', status: 'ACTIVE' },
    { name: 'Kojo Annan', phone: '0571234567', email: 'kojo@gmail.com', status: 'PENDING' },
    { name: 'Abena Owusu', phone: '0211234567', email: 'abena@gmail.com', status: 'PENDING' },
    { name: 'Yaw Frimpong', phone: '0581234567', email: 'yaw@gmail.com', status: 'REMOVED' },
    { name: 'Adwoa Poku', phone: '0591234567', email: 'adwoa@gmail.com', status: 'ACTIVE' },
  ];

  const drivers = [];
  for (const d of driverData) {
    const driver = await prisma.driver.create({
      data: {
        ...d,
        passwordHash: hashSync('driver123', 10),
        balance: d.status === 'ACTIVE' ? Math.round((Math.random() * 600 - 200) * 100) / 100 : 0,
      },
    });
    drivers.push(driver);
  }

  console.log('Created', drivers.length, 'drivers');

  // Create vehicles
  const vehicleData = [
    { plateNumber: 'GR-1234-22', make: 'Toyota', model: 'Corolla', year: 2019, severityStatus: 'GREEN' },
    { plateNumber: 'GR-5678-21', make: 'Toyota', model: 'Yaris', year: 2020, severityStatus: 'GREEN' },
    { plateNumber: 'GW-9012-23', make: 'Hyundai', model: 'Accent', year: 2021, severityStatus: 'YELLOW' },
    { plateNumber: 'GR-3456-20', make: 'Kia', model: 'Rio', year: 2018, severityStatus: 'RED' },
    { plateNumber: 'GN-7890-22', make: 'Toyota', model: 'Camry', year: 2022, severityStatus: 'GREEN' },
    { plateNumber: 'GT-2345-21', make: 'Nissan', model: 'Versa', year: 2020, severityStatus: 'GREEN' },
    { plateNumber: 'GR-6789-23', make: 'Hyundai', model: 'Elantra', year: 2023, severityStatus: 'YELLOW' },
    { plateNumber: 'GW-0123-22', make: 'Toyota', model: 'Corolla', year: 2021, severityStatus: 'GREEN' },
  ];

  const activeDrivers = drivers.filter(d => d.status === 'ACTIVE');
  const vehicles = [];
  for (let i = 0; i < vehicleData.length; i++) {
    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData[i],
        assignedDriverId: i < activeDrivers.length ? activeDrivers[i].id : null,
        gpsDeviceId: `GPS-${String(i + 1).padStart(3, '0')}`,
      },
    });
    vehicles.push(vehicle);
  }

  console.log('Created', vehicles.length, 'vehicles');

  // Create applications (pending)
  await prisma.application.create({
    data: {
      fullName: 'Emmanuel Tetteh',
      phone: '0241119999',
      email: 'emmanuel@gmail.com',
      reason: 'I have 5 years of taxi driving experience in Accra and want to join a reputable fleet.',
      status: 'PENDING',
    },
  });

  await prisma.application.create({
    data: {
      fullName: 'Patience Adjei',
      phone: '0559998888',
      email: 'patience@gmail.com',
      reason: 'Looking for a reliable fleet to work with. I have a clean driving record.',
      status: 'PENDING',
    },
  });

  console.log('Created 2 pending applications');

  // Create driver reports
  const reportData = [
    { driverId: activeDrivers[0].id, vehicleId: vehicles[0].id, type: 'ISSUE', description: 'Left front tire tread is very low, needs replacement soon.', suggestedSeverity: 'YELLOW', status: 'NEW' },
    { driverId: activeDrivers[1].id, vehicleId: vehicles[1].id, type: 'ISSUE', description: 'Engine making unusual knocking sound when accelerating.', suggestedSeverity: 'RED', status: 'ACKNOWLEDGED' },
    { driverId: activeDrivers[2].id, vehicleId: vehicles[2].id, type: 'ABSENCE', description: 'Family emergency, will be unable to work for 3 days.', suggestedSeverity: null, status: 'ACKNOWLEDGED' },
    { driverId: activeDrivers[3].id, vehicleId: vehicles[3].id, type: 'ISSUE', description: 'Brake pads worn out. Braking distance has increased significantly.', suggestedSeverity: 'RED', status: 'NEW' },
    { driverId: activeDrivers[0].id, vehicleId: vehicles[0].id, type: 'ISSUE', description: 'AC not cooling properly. Passengers complaining about heat.', suggestedSeverity: 'YELLOW', status: 'RESOLVED' },
    { driverId: activeDrivers[4].id, vehicleId: vehicles[4].id, type: 'ISSUE', description: 'Windshield wiper on passenger side is broken.', suggestedSeverity: 'GREEN', status: 'NEW' },
  ];

  for (const r of reportData) {
    await prisma.driverReport.create({ data: r });
  }

  console.log('Created', reportData.length, 'driver reports');

  // Create parts exchanges
  const partsData = [
    { driverId: activeDrivers[0].id, vehicleId: vehicles[0].id, partName: 'Front Left Tire', cost: 280, reimbursementStatus: 'APPROVED' },
    { driverId: activeDrivers[1].id, vehicleId: vehicles[1].id, partName: 'Air Filter', cost: 45, reimbursementStatus: 'APPROVED' },
    { driverId: activeDrivers[2].id, vehicleId: vehicles[2].id, partName: 'Brake Pads (Front)', cost: 120, reimbursementStatus: 'PENDING' },
    { driverId: activeDrivers[3].id, vehicleId: vehicles[3].id, partName: 'Battery', cost: 350, reimbursementStatus: 'PENDING' },
    { driverId: activeDrivers[0].id, vehicleId: vehicles[0].id, partName: 'Engine Oil (5W-30)', cost: 85, reimbursementStatus: 'APPROVED' },
    { driverId: activeDrivers[4].id, vehicleId: vehicles[4].id, partName: 'Wiper Blade Set', cost: 35, reimbursementStatus: 'APPROVED' },
  ];

  for (const p of partsData) {
    await prisma.partsExchange.create({
      data: {
        ...p,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Created', partsData.length, 'parts exchanges');

  // Create sales records
  const weeks = ['2026-W36', '2026-W37', '2026-W38'];
  for (const driver of activeDrivers.slice(0, 8)) {
    for (const week of weeks) {
      const method = Math.random() > 0.5 ? 'MOMO' : 'CASH';
      await prisma.salesRecord.create({
        data: {
          driverId: driver.id,
          weekLabel: week,
          amount: Math.round((400 + Math.random() * 200) * 100) / 100,
          paymentMethod: method,
          momoReference: method === 'MOMO' ? `MTN${Math.floor(Math.random() * 10000000000)}` : null,
          confirmationStatus: week === '2026-W38' ? 'PENDING' : 'CONFIRMED',
        },
      });
    }
  }

  console.log('Created sales records');

  // Create location pings (simulated Accra area)
  const accraCenterLat = 5.6037;
  const accraCenterLng = -0.1870;

  for (const vehicle of vehicles) {
    for (let i = 0; i < 20; i++) {
      await prisma.locationPing.create({
        data: {
          vehicleId: vehicle.id,
          gpsDeviceId: vehicle.gpsDeviceId,
          lat: accraCenterLat + (Math.random() - 0.5) * 0.08,
          lng: accraCenterLng + (Math.random() - 0.5) * 0.1,
          timestamp: new Date(Date.now() - i * 15 * 60 * 1000), // every 15 min
        },
      });
    }
  }

  console.log('Created location pings');

  // Create chat conversations and messages
  if (activeDrivers.length >= 2) {
    const conv = await prisma.chatConversation.create({
      data: {
        driver1Id: activeDrivers[0].id,
        driver2Id: activeDrivers[1].id,
      },
    });

    const messages = [
      { senderId: activeDrivers[0].id, content: 'Hey, are you around Circle today?', conversationId: conv.id },
      { senderId: activeDrivers[1].id, content: 'Yes, just dropped off a passenger near Kwame Nkrumah interchange', conversationId: conv.id },
      { senderId: activeDrivers[0].id, content: 'Nice, the traffic is light today. Good runs!', conversationId: conv.id },
      { senderId: activeDrivers[1].id, content: 'Indeed! Heading towards Osu now', conversationId: conv.id },
    ];

    for (let i = 0; i < messages.length; i++) {
      await prisma.chatMessage.create({
        data: {
          ...messages[i],
          createdAt: new Date(Date.now() - (messages.length - i) * 5 * 60 * 1000),
        },
      });
    }

    // Another conversation
    const conv2 = await prisma.chatConversation.create({
      data: {
        driver1Id: activeDrivers[2].id,
        driver2Id: activeDrivers[3].id,
      },
    });

    await prisma.chatMessage.create({
      data: {
        senderId: activeDrivers[2].id,
        content: 'Do you know a good mechanic near East Legon?',
        conversationId: conv2.id,
      },
    });

    console.log('Created chat conversations');
  }

  // Create ledger entries
  for (const driver of activeDrivers.slice(0, 6)) {
    await prisma.ledgerEntry.create({
      data: {
        driverId: driver.id,
        amount: 500,
        direction: 'DEBIT',
        description: 'Weekly rental fee - Week 36',
        createdAt: new Date('2026-09-01'),
      },
    });

    await prisma.ledgerEntry.create({
      data: {
        driverId: driver.id,
        amount: 450 + Math.random() * 100,
        direction: 'CREDIT',
        description: 'Sales payment received - Week 36',
        createdAt: new Date('2026-09-03'),
      },
    });
  }

  console.log('Created ledger entries');
  console.log('\n✅ Seed complete!');
  console.log('Admin login: admin@byt.com / admin123');
  console.log('Driver login: kwame@gmail.com / driver123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
