/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { demoDrivers, demoVehicles, getStatusBadgeClass, getBalanceLabel, Driver, getStoredDrivers, saveStoredDrivers } from '@/lib/demo-data';
import {
  getDriverPhoneTelemetry,
  DriverPhoneTelemetry,
  getGoogleMapsUrl,
  getGoogleStreetViewUrl,
  getGoogleDirectionsUrl,
  getWhatsAppUrl
} from '@/lib/driver-telemetry';
import {
  saveStoredChatMessages,
  getStoredChatMessages,
  ChatMessage as SharedChatMessage,
} from '@/lib/communication';

export interface FileAttachment {
  name: string;
  size: string;
  url: string;
  type: 'image' | 'document';
}

interface ChatMessage {
  id: string;
  sender: 'ADMIN' | 'DRIVER';
  senderName: string;
  text: string;
  time: string;
  tag?: 'URGENT' | 'REPORT' | 'PAYMENT' | 'LOCATION';
  file?: FileAttachment;
}

const defaultDriverConversations: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'k1', sender: 'DRIVER', senderName: 'Kwame Asante', text: 'Good morning Admin! Just finished the morning runs around Accra Central.', time: '08:15 AM' },
    { id: 'k2', sender: 'ADMIN', senderName: 'Admin', text: 'Good morning Kwame. Keep up the great pace. Remember weekly sales reconciliation is due today.', time: '08:20 AM' },
    { id: 'k3', sender: 'DRIVER', senderName: 'Kwame Asante', text: 'Yes boss! Already submitted GHS 520.00 via MTN MoMo. Ref: MTN7834521098.', time: '08:45 AM', tag: 'PAYMENT' },
    { id: 'k4', sender: 'ADMIN', senderName: 'Admin', text: 'Payment confirmed and credited to your account. Safe driving today!', time: '08:50 AM' },
    { id: 'k5', sender: 'DRIVER', senderName: 'Kwame Asante', text: 'Thank you! Notice slight low pressure on front left tire, will top up at Shell Station.', time: '09:12 AM', tag: 'REPORT' },
  ],
  '2': [
    { id: 'a1', sender: 'DRIVER', senderName: 'Ama Mensah', text: 'Hello admin, passenger left a black umbrella in the backseat. Kept it safe in the trunk.', time: '07:30 AM' },
    { id: 'a2', sender: 'ADMIN', senderName: 'Admin', text: 'Thanks for reporting Ama! The passenger called dispatch. They will pick it up at the depot.', time: '07:42 AM' },
    { id: 'a3', sender: 'DRIVER', senderName: 'Ama Mensah', text: 'Understood. Heading towards Kokomlemle now for morning rush hour.', time: '08:05 AM', tag: 'LOCATION' },
    { id: 'a4', sender: 'DRIVER', senderName: 'Ama Mensah', text: 'GHS 480 cash collected so far, will deposit at end of shift.', time: '09:30 AM', tag: 'PAYMENT' },
  ],
  '3': [
    { id: 'kb1', sender: 'DRIVER', senderName: 'Kofi Boateng', text: 'Admin, Hyundai Accent (GW-9012-23) front brakes are squeaking slightly on deceleration.', time: 'Yesterday 04:15 PM', tag: 'REPORT' },
    { id: 'kb2', sender: 'ADMIN', senderName: 'Admin', text: 'Thanks for flagging Kofi. Please submit a parts exchange request for front brake pads.', time: 'Yesterday 04:30 PM' },
    { id: 'kb3', sender: 'DRIVER', senderName: 'Kofi Boateng', text: 'Parts request submitted for GHS 120.00. Mechanic says he can install this evening.', time: 'Yesterday 05:00 PM' },
    { id: 'kb4', sender: 'ADMIN', senderName: 'Admin', text: 'Approved. Bring the receipt to base tomorrow.', time: 'Yesterday 05:15 PM' },
  ],
  '4': [
    { id: 'y1', sender: 'DRIVER', senderName: 'Yaa Serwaa', text: 'EMERGENCY: Brake pads completely worn out on Kia Rio GR-3456-20. Stopping distance is unsafe.', time: '10:05 AM', tag: 'URGENT' },
    { id: 'y2', sender: 'ADMIN', senderName: 'Admin', text: 'Yaa, pull over to a safe area immediately! Do not pick up any more passengers.', time: '10:07 AM' },
    { id: 'y3', sender: 'DRIVER', senderName: 'Yaa Serwaa', text: 'Parked safely near Danquah Circle. Hazard lights are on.', time: '10:10 AM', tag: 'LOCATION' },
    { id: 'y4', sender: 'ADMIN', senderName: 'Admin', text: 'Mobile maintenance team has been dispatched to your GPS location with replacement pads.', time: '10:12 AM' },
  ],
};

const DRIVER_PRECISE_LOCATIONS: Record<string, {
  lat: number;
  lng: number;
  address: string;
  carrier: string;
  plate: string;
}> = {
  '024-419-8234': { lat: 5.6145, lng: -0.1870, address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange', carrier: 'MTN Ghana 4G LTE', plate: 'GR-1234-22' },
  '055-892-1045': { lat: 5.5560, lng: -0.1820, address: 'Oxford Street, Osu Commercial District, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-5678-21' },
  '027-314-9820': { lat: 5.6350, lng: -0.1550, address: 'Lagos Avenue, East Legon, Accra', carrier: 'AirtelTigo 4G LTE', plate: 'GW-9012-23' },
  '020-562-3918': { lat: 5.5600, lng: -0.2150, address: 'Kwame Nkrumah Interchange, Circle Overpass, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-3456-20' },
  '054-712-4491': { lat: 5.6200, lng: -0.1650, address: 'Spintex Road, near Flower Pot Flyover', carrier: 'MTN Ghana 4G LTE', plate: 'GN-7890-22' },
  '026-883-2051': { lat: 5.5560, lng: -0.1980, address: 'Labadi Beach Road, South La Estates', carrier: 'AirtelTigo 4G LTE', plate: 'GT-2345-21' },
  '050-619-3382': { lat: 5.6480, lng: -0.1820, address: 'Madina Zongo Junction, near UPSA, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-6789-23' },
  '023-441-9028': { lat: 5.6050, lng: -0.2210, address: 'Achimota Mile 7, near New Achimota Station', carrier: 'Telecel Ghana 4G', plate: 'GW-0123-22' },
  '057-920-1147': { lat: 5.5780, lng: -0.1760, address: 'Cantonments Road, near US Embassy, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-4321-24' },
  '025-338-7190': { lat: 5.6420, lng: -0.0980, address: 'Tema Motorway Tollbooth area, Greater Accra', carrier: 'Telecel Ghana 4G', plate: 'GT-8765-23' },
  '053-840-2261': { lat: 5.5680, lng: -0.2450, address: 'Kaneshie First Light, Winneba Road, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GW-3210-21' },
  '059-472-8819': { lat: 5.6010, lng: -0.1920, address: 'Roman Ridge, near Airport West, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-7654-22' },
  // Legacy aliases
  '024-123-4567': { lat: 5.6145, lng: -0.1870, address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange', carrier: 'MTN Ghana 4G LTE', plate: 'GR-1234-22' },
  '055-123-4567': { lat: 5.5560, lng: -0.1820, address: 'Oxford Street, Osu Commercial District, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-5678-21' },
  '027-123-4567': { lat: 5.6350, lng: -0.1550, address: 'Lagos Avenue, East Legon, Accra', carrier: 'AirtelTigo 4G LTE', plate: 'GW-9012-23' },
  '020-123-4567': { lat: 5.5600, lng: -0.2150, address: 'Kwame Nkrumah Interchange, Circle Overpass', carrier: 'Telecel Ghana 4G', plate: 'GR-3456-20' },
  '054-123-4567': { lat: 5.6200, lng: -0.1650, address: 'Spintex Road, near Flower Pot Flyover', carrier: 'MTN Ghana 4G LTE', plate: 'GN-7890-22' },
  '026-123-4567': { lat: 5.5560, lng: -0.1980, address: 'Labadi Beach Road, South La Estates', carrier: 'AirtelTigo 4G LTE', plate: 'GT-2345-21' },
  '050-123-4567': { lat: 5.6480, lng: -0.1820, address: 'Madina Zongo Junction, near UPSA, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-6789-23' },
  '023-123-4567': { lat: 5.6050, lng: -0.2210, address: 'Achimota Mile 7, near New Achimota Station', carrier: 'Telecel Ghana 4G', plate: 'GW-0123-22' },
  '057-123-4567': { lat: 5.5780, lng: -0.1760, address: 'Cantonments Road, near US Embassy, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-4321-24' },
  '021-123-4567': { lat: 5.6420, lng: -0.0980, address: 'Tema Motorway Tollbooth area, Greater Accra', carrier: 'Telecel Ghana 4G', plate: 'GT-8765-23' },
  '058-123-4567': { lat: 5.5680, lng: -0.2450, address: 'Kaneshie First Light, Winneba Road', carrier: 'MTN Ghana 4G LTE', plate: 'GW-3210-21' },
  '059-123-4567': { lat: 5.6010, lng: -0.1920, address: 'Roman Ridge, near Airport West, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-7654-22' },
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [phoneTrackerInput, setPhoneTrackerInput] = useState('');

  // Add Driver form state
  const [addDriverName, setAddDriverName] = useState('');
  const [addDriverPhone, setAddDriverPhone] = useState('');
  const [addDriverEmail, setAddDriverEmail] = useState('');
  const [addDriverPlate, setAddDriverPlate] = useState('UNASSIGNED');
  const [addDriverStatus, setAddDriverStatus] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [addDriverOperationalStatus, setAddDriverOperationalStatus] = useState<'ACTIVE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE'>('ACTIVE');
  const [addDriverDailyTarget, setAddDriverDailyTarget] = useState('100');
  const [addDriverWeeklyTarget, setAddDriverWeeklyTarget] = useState('600');
  const [addDriverInitialBalance, setAddDriverInitialBalance] = useState('0');
  const [addDriverFormError, setAddDriverFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Driver state
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPlate, setEditPlate] = useState('UNASSIGNED');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'PENDING' | 'REMOVED'>('ACTIVE');
  const [editOperationalStatus, setEditOperationalStatus] = useState<'ACTIVE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE'>('ACTIVE');
  const [editDailyTarget, setEditDailyTarget] = useState('100');
  const [editWeeklyTarget, setEditWeeklyTarget] = useState('600');
  const [editBalance, setEditBalance] = useState('0');
  const [editDriverScore, setEditDriverScore] = useState('85');
  const [editFormError, setEditFormError] = useState('');

  // Load saved drivers from localStorage on mount & listen to updates
  useEffect(() => {
    setDrivers(getStoredDrivers());

    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('byt-drivers-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('byt-drivers-updated', handleUpdate);
    };
  }, []);

  const handleOpenEditDriver = (driver: Driver, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDriver(driver);
    setEditName(driver.name);
    setEditPhone(driver.phone);
    setEditEmail(driver.email || '');
    setEditPlate(driver.vehicle?.plateNumber || 'UNASSIGNED');
    setEditStatus(driver.status);
    setEditOperationalStatus(driver.operationalStatus || 'ACTIVE');
    setEditDailyTarget(String(driver.dailyTarget ?? 100));
    setEditWeeklyTarget(String(driver.weeklyTarget ?? 600));
    setEditBalance(String(driver.balance ?? 0));
    setEditDriverScore(String(driver.driverScore ?? 85));
    setEditFormError('');
  };

  const handleSaveEditedDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    if (!editName.trim() || !editPhone.trim()) {
      setEditFormError('Driver full name and phone number are required.');
      return;
    }

    // Vehicle assignment
    let updatedVehicle = editingDriver.vehicle;
    if (editPlate !== 'UNASSIGNED') {
      const matchedVeh = demoVehicles.find(v => v.plateNumber === editPlate);
      if (matchedVeh) {
        matchedVeh.assignedDriverName = editName.trim();
        matchedVeh.assignedDriver = editingDriver.id;
        updatedVehicle = matchedVeh;
      }
    } else {
      if (updatedVehicle) {
        const matchedVeh = demoVehicles.find(v => v.plateNumber === updatedVehicle?.plateNumber);
        if (matchedVeh && matchedVeh.assignedDriver === editingDriver.id) {
          matchedVeh.assignedDriverName = null;
          matchedVeh.assignedDriver = null;
        }
      }
      updatedVehicle = undefined;
    }

    const updatedDriver: Driver = {
      ...editingDriver,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || `${editName.trim().toLowerCase().replace(/\s+/g, '')}@byt.com`,
      status: editStatus,
      operationalStatus: editOperationalStatus,
      dailyTarget: parseFloat(editDailyTarget) || 100,
      weeklyTarget: parseFloat(editWeeklyTarget) || 600,
      balance: parseFloat(editBalance) || 0,
      driverScore: Math.min(100, Math.max(0, parseInt(editDriverScore) || 85)),
      vehicle: updatedVehicle,
    };

    const updatedList = drivers.map(d => d.id === editingDriver.id ? updatedDriver : d);
    setDrivers(updatedList);
    saveStoredDrivers(updatedList);

    // If currently viewing in profile dossier, update it
    if (selectedProfileDriver?.id === editingDriver.id) {
      setSelectedProfileDriver(updatedDriver);
    }

    setEditingDriver(null);
    setToastMessage(`Driver "${updatedDriver.name}" updated successfully across the platform!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addDriverName.trim() || !addDriverPhone.trim()) {
      setAddDriverFormError('Please provide at least a full name and phone number.');
      return;
    }

    const newDriver: Driver = {
      id: `drv-${Date.now()}`,
      name: addDriverName.trim(),
      phone: addDriverPhone.trim(),
      email: addDriverEmail.trim() || `${addDriverName.trim().toLowerCase().replace(/\s+/g, '')}@byt.com`,
      status: addDriverStatus,
      operationalStatus: addDriverOperationalStatus,
      balance: parseFloat(addDriverInitialBalance) || 0,
      createdAt: new Date().toISOString().split('T')[0],
      driverScore: 88,
      tripsCompleted: 0,
      onTimeRate: 100,
      totalEarnings: 0,
      harshBrakingCount: 0,
      speedingEvents: 0,
      idlingMinutes: 0,
      dailyTarget: parseFloat(addDriverDailyTarget) || 100,
      weeklyTarget: parseFloat(addDriverWeeklyTarget) || 600,
    };

    // If vehicle was selected, assign driver to that vehicle
    if (addDriverPlate && addDriverPlate !== 'UNASSIGNED') {
      const matchedVeh = demoVehicles.find(v => v.plateNumber === addDriverPlate);
      if (matchedVeh) {
        matchedVeh.assignedDriverName = newDriver.name;
        matchedVeh.assignedDriver = newDriver.id;
        newDriver.vehicle = matchedVeh;
      }
    }

    // Update drivers state and persist globally
    const updated = [newDriver, ...drivers];
    setDrivers(updated);
    saveStoredDrivers(updated);

    // Reset form
    setAddDriverName('');
    setAddDriverPhone('');
    setAddDriverEmail('');
    setAddDriverPlate('UNASSIGNED');
    setAddDriverStatus('ACTIVE');
    setAddDriverOperationalStatus('ACTIVE');
    setAddDriverDailyTarget('100');
    setAddDriverWeeklyTarget('600');
    setAddDriverInitialBalance('0');
    setAddDriverFormError('');
    setShowAddModal(false);

    setToastMessage(`Driver "${newDriver.name}" successfully added to the fleet!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRemoveDriver = (driverId: string, driverName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove driver "${driverName}" from the fleet?`)) {
      const updated = drivers.filter(d => d.id !== driverId);
      setDrivers(updated);
      saveStoredDrivers(updated);
      setToastMessage(`Driver "${driverName}" removed.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Phone & Device Telemetry Inspector Modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [inspectingPhoneData, setInspectingPhoneData] = useState<DriverPhoneTelemetry | null>(null);

  const openPhoneDetails = (phone: string, name?: string, plate?: string) => {
    const data = getDriverPhoneTelemetry(phone, name, plate);
    setInspectingPhoneData(data);
    setShowPhoneModal(true);
  };

  // Private Driver Profile Bar State
  const [selectedProfileDriver, setSelectedProfileDriver] = useState<Driver | null>(null);

  // Selected driver for Chat Drawer
  const [selectedChatDriver, setSelectedChatDriver] = useState<Driver | null>(null);
  const [chatSearch, setChatSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  // Driver DP Map stored in localStorage
  const [driverPictures, setDriverPictures] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedPics = localStorage.getItem('byt-driver-pictures');
      if (savedPics) setDriverPictures(JSON.parse(savedPics));
    } catch {}
  }, []);

  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('byt-driver-chats');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return defaultDriverConversations;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatDriver) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatDriver, conversations]);

  // In-App Calling State (Voice & Video for Admin)
  const [adminActiveCall, setAdminActiveCall] = useState<{
    driver: Driver;
    type: 'voice' | 'video';
    status: 'requesting' | 'ringing' | 'connected' | 'declined' | 'error';
    errorMsg?: string;
  } | null>(null);
  const [adminCallDuration, setAdminCallDuration] = useState(0);
  const [isAdminMuted, setIsAdminMuted] = useState(false);
  const [isAdminVideoOff, setIsAdminVideoOff] = useState(false);
  const adminCallTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adminRingingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adminRingAudioRef = useRef<{ stop: () => void } | null>(null);
  const adminVideoRef = useRef<HTMLVideoElement>(null);
  const adminStreamRef = useRef<MediaStream | null>(null);

  // In-App Web Audio Ringtone Generator
  const startAdminRingtone = () => {
    stopAdminRingtone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let stopped = false;

      const playBurst = () => {
        if (stopped || ctx.state === 'closed') return;
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(440, ctx.currentTime);
          osc2.frequency.setValueAtTime(480, ctx.currentTime);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 1.8);
          osc2.stop(ctx.currentTime + 1.8);
        } catch {}
      };

      playBurst();
      const interval = setInterval(playBurst, 3000);
      adminRingAudioRef.current = {
        stop: () => {
          stopped = true;
          clearInterval(interval);
          try { ctx.close(); } catch {}
        }
      };
    } catch {}
  };

  const stopAdminRingtone = () => {
    if (adminRingAudioRef.current) {
      adminRingAudioRef.current.stop();
      adminRingAudioRef.current = null;
    }
  };

  const playAdminConnectedChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      setTimeout(() => { try { ctx.close(); } catch {} }, 400);
    } catch {}
  };

  const startAdminInAppCall = async (driver: Driver, type: 'voice' | 'video') => {
    setAdminActiveCall({
      driver,
      type,
      status: 'requesting',
    });
    setAdminCallDuration(0);
    setIsAdminMuted(false);
    setIsAdminVideoOff(false);

    try {
      const constraints = type === 'video'
        ? { video: { facingMode: 'user' }, audio: true }
        : { audio: true };

      // Prompt device for permission
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      adminStreamRef.current = stream;

      setAdminActiveCall(prev => prev ? { ...prev, status: 'ringing' } : null);
      startAdminRingtone();

      if (adminRingingTimerRef.current) clearTimeout(adminRingingTimerRef.current);
      // Wait for answer (timeout after 40s)
      adminRingingTimerRef.current = setTimeout(() => {
        handleAdminDeclineCall();
      }, 40000);

    } catch (err: unknown) {
      stopAdminRingtone();
      const msg = err instanceof Error ? err.message : 'Hardware access error';
      setAdminActiveCall({
        driver,
        type,
        status: 'error',
        errorMsg: msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('permission')
          ? 'Device permission denied. Please allow microphone/camera access in your browser or device settings.'
          : 'Could not access audio or video hardware on this device.'
      });
    }
  };

  const handleAdminAnswerCall = () => {
    stopAdminRingtone();
    if (adminRingingTimerRef.current) {
      clearTimeout(adminRingingTimerRef.current);
      adminRingingTimerRef.current = null;
    }
    playAdminConnectedChime();
    setAdminActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    if (adminVideoRef.current && adminStreamRef.current && adminActiveCall?.type === 'video') {
      adminVideoRef.current.srcObject = adminStreamRef.current;
    }

    if (adminCallTimerRef.current) clearInterval(adminCallTimerRef.current);
    adminCallTimerRef.current = setInterval(() => {
      setAdminCallDuration(d => d + 1);
    }, 1000);
  };

  const handleAdminDeclineCall = () => {
    stopAdminRingtone();
    if (adminRingingTimerRef.current) {
      clearTimeout(adminRingingTimerRef.current);
      adminRingingTimerRef.current = null;
    }
    setAdminActiveCall(prev => prev ? { ...prev, status: 'declined' } : null);
    setTimeout(() => {
      endAdminCall();
    }, 1600);
  };

  const endAdminCall = () => {
    stopAdminRingtone();
    if (adminRingingTimerRef.current) {
      clearTimeout(adminRingingTimerRef.current);
      adminRingingTimerRef.current = null;
    }
    if (adminStreamRef.current) {
      adminStreamRef.current.getTracks().forEach(t => t.stop());
      adminStreamRef.current = null;
    }
    if (adminCallTimerRef.current) {
      clearInterval(adminCallTimerRef.current);
      adminCallTimerRef.current = null;
    }
    setAdminActiveCall(null);
    setAdminCallDuration(0);
    setIsAdminMuted(false);
    setIsAdminVideoOff(false);
  };

  const toggleAdminMute = () => {
    if (adminStreamRef.current) {
      const audioTracks = adminStreamRef.current.getAudioTracks();
      const newMuted = !isAdminMuted;
      audioTracks.forEach(t => { t.enabled = !newMuted; });
      setIsAdminMuted(newMuted);
    }
  };

  const toggleAdminVideo = () => {
    if (adminStreamRef.current) {
      const videoTracks = adminStreamRef.current.getVideoTracks();
      const newOff = !isAdminVideoOff;
      videoTracks.forEach(t => { t.enabled = !newOff; });
      setIsAdminVideoOff(newOff);
    }
  };

  const handleProfilePicUpload = (driverId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const updated = { ...driverPictures, [driverId]: base64 };
      setDriverPictures(updated);
      try {
        localStorage.setItem('byt-driver-pictures', JSON.stringify(updated));
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // Admin Chat File Sharing State
  const [adminPendingFile, setAdminPendingFile] = useState<FileAttachment | null>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const adminImageInputRef = useRef<HTMLInputElement>(null);

  const handleAdminFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setAdminPendingFile({
        name: file.name,
        size: formattedSize,
        url: reader.result as string,
        type: isImage ? 'image' : 'document'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatDriver || (!replyText.trim() && !adminPendingFile)) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ADMIN',
      senderName: 'Admin',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: adminPendingFile || undefined
    };

    const updated = {
      ...conversations,
      [selectedChatDriver.id]: [...(conversations[selectedChatDriver.id] || []), newMsg]
    };

    const sharedMsg: SharedChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `driver_${selectedChatDriver.id}_admin`,
      senderId: 'admin',
      senderName: 'Emma (Admin Dispatch)',
      senderRole: 'admin',
      recipientId: selectedChatDriver.id,
      content: replyText.trim() || (adminPendingFile ? `Sent ${adminPendingFile.type === 'image' ? 'photo' : 'document'}` : ''),
      createdAt: new Date().toISOString(),
      read: false,
      mediaUrl: adminPendingFile?.url,
      mediaType: adminPendingFile ? (adminPendingFile.type === 'image' ? 'image' : 'document') : undefined,
    };
    const currentAll = getStoredChatMessages();
    saveStoredChatMessages([...currentAll, sharedMsg]);

    setConversations(updated);
    setReplyText('');
    setAdminPendingFile(null);
    try {
      localStorage.setItem('byt-driver-chats', JSON.stringify(updated));
    } catch {}
  };

  const filtered = drivers.filter(d => {
    const matchFilter = filter === 'ALL' || d.status === filter;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const chatDriversList = drivers.filter(d =>
    d.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    d.phone.includes(chatSearch)
  );

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1>Driver Management</h1>
          <p className="subtitle">Real-time driver roster, telemetry dossiers & private tracking panels</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>+</span>
          <span>Add Driver</span>
        </button>
      </div>

      {/* Toast alert banner */}
      {toastMessage && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-md)',
          color: '#10b981',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem' }}>
            <span>✅</span>
            <span>{toastMessage}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by driver name, phone, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          {['ALL', 'ACTIVE', 'PENDING', 'REMOVED'].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(status)}
            >
              {status === 'ALL' ? 'All Drivers' : status}
            </button>
          ))}
        </div>
      </div>

      {/* DIRECT DRIVER PHONE TRACKER BAR (AT WILL) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.12) 0%, rgba(15, 23, 42, 0.04) 100%)',
        border: '1px solid var(--byt-sea)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        marginBottom: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap',
        boxShadow: '0 4px 15px rgba(8, 145, 178, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🛰️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--byt-sea-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Track Driver Precise Location by Phone Number</span>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(8, 145, 178, 0.15)', color: 'var(--byt-sea-dark)', fontWeight: 700 }}>
                At Will
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              Pinpoint the real-time street coordinates and landmarks of any driver using their phone number.
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (phoneTrackerInput.trim()) {
              window.location.href = `/admin/gps?phone=${encodeURIComponent(phoneTrackerInput.trim())}`;
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px', maxWidth: '440px' }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Enter driver phone e.g. 024-123-4567..."
            value={phoneTrackerInput}
            onChange={(e) => setPhoneTrackerInput(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '6px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span>📍</span>
            <span>Track Location</span>
          </button>
        </form>
      </div>

      {/* Drivers Table */}
      <div className="table-container animate-in">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Phone & Live GPS</th>
              <th>Assigned Vehicle</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Dossier & Chat</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(driver => {
              const vehicle = demoVehicles.find(v => v.assignedDriverName === driver.name);
              const bal = getBalanceLabel(driver.balance);
              const driverMsgs = conversations[driver.id] || [];
              const dp = driverPictures[driver.id];

              return (
                <tr
                  key={driver.id}
                  style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onClick={() => setSelectedProfileDriver(driver)}
                  className="hover:bg-card-hover"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div
                        className="chat-avatar"
                        style={{
                          width: 40,
                          height: 40,
                          fontSize: '0.85rem',
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                          color: '#fff',
                          border: '2px solid var(--byt-sea-light)',
                          flexShrink: 0
                        }}
                      >
                        {dp ? (
                          <img src={dp} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          driver.name.split(' ').map(n => n[0]).join('')
                        )}
                        {driver.status === 'ACTIVE' && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: '#10b981',
                              border: '2px solid #fff'
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: 'var(--byt-sea-dark)', fontSize: '0.95rem' }}>
                          {driver.name}
                        </div>
                        <div className="text-xs text-muted">{driver.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="text-sm font-mono">{driver.phone}</span>
                      <Link
                        href={`/admin/gps?phone=${encodeURIComponent(driver.phone)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-ghost btn-sm"
                        style={{
                          padding: '2px 7px',
                          fontSize: '0.7rem',
                          borderRadius: '10px',
                          background: 'rgba(8, 145, 178, 0.1)',
                          border: '1px solid var(--byt-sea)',
                          color: 'var(--byt-sea-dark)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={`Track precise real-time location for ${driver.phone}`}
                      >
                        <span>📍 Track</span>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPhoneDetails(driver.phone, driver.name, vehicle?.plateNumber);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{
                          padding: '2px 7px',
                          fontSize: '0.7rem',
                          borderRadius: '10px',
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#0284c7',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          cursor: 'pointer'
                        }}
                        title={`Inspect phone number & device details for ${driver.phone}`}
                      >
                        <span>📱 Details</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    {vehicle ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <code className="text-xs font-mono" style={{ color: 'var(--byt-sea-dark)', background: 'var(--color-bg-input)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)', fontWeight: 600 }}>
                          {vehicle.plateNumber}
                        </code>
                        <span className="text-xs text-muted">{vehicle.make} {vehicle.model}</span>
                      </span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`text-sm font-semibold ${bal.className}`}>{bal.text}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDriver(driver, e);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{
                          padding: '1px 6px',
                          fontSize: '0.68rem',
                          color: 'var(--byt-gold)',
                          border: '1px solid rgba(212, 168, 67, 0.35)',
                          borderRadius: '4px',
                          background: 'rgba(212, 168, 67, 0.08)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        title={`Edit / Punch balance directly for ${driver.name}`}
                      >
                        ⚡ Edit
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(driver.status)}`}>{driver.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfileDriver(driver);
                        }}
                        style={{
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-md)',
                          borderColor: 'var(--byt-sea)',
                          color: 'var(--byt-sea)'
                        }}
                        title={`View ${driver.name}'s Profile Dossier`}
                      >
                        <span>👤</span>
                        <span>Profile</span>
                      </button>
                      <Link
                        href={`/admin/chat?driverId=${driver.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-sm"
                        style={{
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(8, 145, 178, 0.1)',
                          border: '1px solid var(--byt-sea)',
                          color: 'var(--byt-sea-dark)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={`Open dedicated dispatch chat with ${driver.name}`}
                      >
                        <span>💬</span>
                        <span>Chat with Driver</span>
                      </Link>
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`In-App Voice Call ${driver.name}`}
                        onClick={() => startAdminInAppCall(driver, 'voice')}
                        style={{ color: 'var(--byt-sea)' }}
                      >
                        📞
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`In-App Video Call ${driver.name}`}
                        onClick={() => startAdminInAppCall(driver, 'video')}
                        style={{ color: 'var(--byt-sea)' }}
                      >
                        📹
                      </button>
                      <Link
                        href={`/admin/chat?driverId=${driver.id}`}
                        className="btn btn-ghost btn-sm"
                        title={`Open Dispatch Chat with ${driver.name}`}
                        style={{ color: 'var(--byt-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        💬
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`Edit ${driver.name}'s Details`}
                        onClick={(e) => handleOpenEditDriver(driver, e)}
                        style={{ color: '#0284c7' }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`Remove ${driver.name}`}
                        onClick={(e) => handleRemoveDriver(driver.id, driver.name, e)}
                        style={{ color: 'var(--color-red)' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* PRIVATE DRIVER PROGRESS & PROFILE SIDE-BAR (DOSSIER)      */}
      {/* ========================================================= */}
      {selectedProfileDriver && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProfileDriver(null)}
          style={{
            zIndex: 9990,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '100vh',
              background: '#ffffff',
              boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              borderLeft: '2px solid var(--byt-sea-light)',
              animation: 'slideInRight 0.25s ease-out'
            }}
          >
            {/* Private Bar Header */}
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--byt-sea-dark)' }}>
                  🔒 Confidential Driver Dossier
                </span>
                <h2 style={{ margin: '4px 0 2px', fontSize: '1.4rem', color: '#0f172a' }}>
                  {selectedProfileDriver.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span className={`badge ${getStatusBadgeClass(selectedProfileDriver.status)}`}>
                    {selectedProfileDriver.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>★ 4.9 Rating (148 Trips)</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  href={`/admin/chat?driverId=${selectedProfileDriver.id}`}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    padding: '5px 12px',
                    background: 'var(--byt-sea)',
                    borderColor: 'var(--byt-sea)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)'
                  }}
                  title={`Open dedicated dispatch chat with ${selectedProfileDriver.name}`}
                >
                  <span>💬</span>
                  <span>Chat with Driver</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEditDriver(selectedProfileDriver)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', padding: '4px 10px' }}
                  title="Edit driver credentials and vehicle assignment"
                >
                  <span>✏️</span>
                  <span>Edit Driver</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProfileDriver(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Profile Avatar & DP Upload */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    border: '3px solid var(--byt-sea-light)',
                    boxShadow: '0 4px 10px rgba(8, 145, 178, 0.2)'
                  }}
                >
                  {driverPictures[selectedProfileDriver.id] ? (
                    <img
                      src={driverPictures[selectedProfileDriver.id]}
                      alt={selectedProfileDriver.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    selectedProfileDriver.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Display Picture</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '8px' }}>
                  {driverPictures[selectedProfileDriver.id] ? 'Custom image active' : 'Default initials avatar'}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  📷 Change Driver DP
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleProfilePicUpload(selectedProfileDriver.id, e)}
                />
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => startAdminInAppCall(selectedProfileDriver, 'voice')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', fontSize: '0.7rem' }}
              >
                <span style={{ fontSize: '1.1rem' }}>📞</span>
                <span>Voice Call</span>
              </button>
              <button
                type="button"
                onClick={() => startAdminInAppCall(selectedProfileDriver, 'video')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', fontSize: '0.7rem' }}
              >
                <span style={{ fontSize: '1.1rem' }}>📹</span>
                <span>Video Call</span>
              </button>
              <button
                onClick={() => {
                  setSelectedChatDriver(selectedProfileDriver);
                  setSelectedProfileDriver(null);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', fontSize: '0.7rem' }}
              >
                <span style={{ fontSize: '1.1rem' }}>💬</span>
                <span>Chat</span>
              </button>
              <Link
                href="/admin/gps"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', fontSize: '0.7rem', textDecoration: 'none' }}
              >
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <span>GPS Map</span>
              </Link>
            </div>

            {/* SECTION: LIVE JOURNEY & PROGRESS */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>🚀 Live Journey & Shift Progress</span>
                <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>LIVE GPS ACTIVE</span>
              </div>

              {/* Progress Tracker Bar */}
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Route: <strong>Accra Central ➔ Airport T3</strong></span>
                  <span style={{ color: 'var(--byt-sea-dark)', fontWeight: 700 }}>68% Completed</span>
                </div>
                <div style={{ height: '8px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, var(--byt-sea), #06b6d4)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                  <span>Dep: 08:15 AM</span>
                  <span>Est Arrival: 09:30 AM (In 15m)</span>
                </div>
              </div>

              {/* Shift Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>TODAY&apos;S DISTANCE</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--byt-sea-dark)', marginTop: '2px' }}>142 km</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>CURRENT SPEED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>44 km/h</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>TRIPS COMPLETED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>7 runs</div>
                </div>
              </div>
            </div>

            {/* SECTION: ASSIGNED VEHICLE DOSSIER */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                🚗 Assigned Vehicle Dossier
              </span>
              {(() => {
                const veh = demoVehicles.find(v => v.assignedDriverName === selectedProfileDriver.name);
                if (!veh) return <p className="text-muted text-sm">No vehicle currently assigned.</p>;
                return (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--byt-sea-dark)', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                        {veh.plateNumber}
                      </code>
                      <span className={`badge badge-${veh.severityStatus === 'GREEN' ? 'green' : veh.severityStatus === 'YELLOW' ? 'yellow' : 'red'}`}>
                        {veh.severityStatus} HEALTH
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}>
                      {veh.make} {veh.model} ({veh.year})
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                      <span>Mileage: {(veh.mileage || 48200).toLocaleString()} km</span>
                      <span>Next Inspection: In 14 days</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* SECTION: FINANCIALS & LEDGER */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                💰 Financial Balance & Sales Target
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>OUTSTANDING BALANCE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedProfileDriver.balance > 0 ? '#ef4444' : '#10b981' }}>
                    {getBalanceLabel(selectedProfileDriver.balance).text}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditDriver(selectedProfileDriver)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', color: 'var(--byt-gold)', borderColor: 'rgba(212, 168, 67, 0.45)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>⚡</span>
                    <span>Punch Balance</span>
                  </button>
                  <Link href="/admin/sales" className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem' }}>
                    Ledger →
                  </Link>
                </div>
              </div>

              {/* Weekly Quota Progress */}
              <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Weekly Target (GHS 600.00)</span>
                <span style={{ fontWeight: 600, color: 'var(--byt-sea-dark)' }}>GHS 520.00 (87%)</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '87%', height: '100%', background: 'var(--byt-sea)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* SECTION: CONTACT & IDENTIFICATION */}
            <div style={{ padding: '20px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                📋 Identification & Details
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div><strong>Phone:</strong> {selectedProfileDriver.phone}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/admin/chat?driverId=${selectedProfileDriver.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                      title={`Open dispatch chat with ${selectedProfileDriver.name}`}
                    >
                      <span>💬 Chat with Driver</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => openPhoneDetails(selectedProfileDriver.phone, selectedProfileDriver.name, selectedProfileDriver.vehicle?.plateNumber)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>📱 Phone Details</span>
                    </button>
                    <Link
                      href={`/admin/gps?phone=${encodeURIComponent(selectedProfileDriver.phone)}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>📍 Track Live GPS</span>
                    </Link>
                  </div>
                </div>
                <div><strong>Email:</strong> {selectedProfileDriver.email}</div>
                <div><strong>Ghana Card:</strong> GHA-78923412-4</div>
                <div><strong>Driver License:</strong> DL-2024-ACC-998 (Valid to 2028)</div>
                <div><strong>Joined Fleet:</strong> {new Date(selectedProfileDriver.createdAt).toLocaleDateString()}</div>
              </div>

              {/* LIVE GPS & TELEMETRY CARD IN DOSSIER */}
              <div style={{
                marginTop: '16px',
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.08) 0%, rgba(15, 23, 42, 0.03) 100%)',
                border: '1px solid var(--byt-sea)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--byt-sea-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🛰️</span>
                    <span>Real-Time Device GPS & Cellular Telemetry</span>
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                    Live GPS Lock
                  </span>
                </div>
                {(() => {
                  const pTel = getDriverPhoneTelemetry(selectedProfileDriver.phone, selectedProfileDriver.name, selectedProfileDriver.vehicle?.plateNumber);
                  return (
                    <>
                      <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>
                        <strong>Current Street / Landmark:</strong> {pTel.address}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                        <span>GPS: {pTel.lat.toFixed(4)}° N, {pTel.lng.toFixed(4)}° W</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Accuracy: {pTel.accuracy}</span>
                      </div>

                      {/* Google Maps Actions Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <a
                          href={getGoogleMapsUrl(pTel.lat, pTel.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#0891b2', color: '#fff', fontSize: '0.74rem', justifyContent: 'center', fontWeight: 700, textDecoration: 'none' }}
                        >
                          <span>🗺️ Google Maps</span>
                        </a>
                        <a
                          href={getGoogleStreetViewUrl(pTel.lat, pTel.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', fontSize: '0.74rem', justifyContent: 'center', fontWeight: 700, textDecoration: 'none' }}
                        >
                          <span>🚶 Street View 360°</span>
                        </a>
                      </div>
                    </>
                  );
                })()}

                <Link
                  href={`/admin/gps?phone=${encodeURIComponent(selectedProfileDriver.phone)}`}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>🛰️ Launch Satellite Radar on Live Map</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* IN-APP VOICE & VIDEO CALL OVERLAY FOR ADMIN               */}
      {/* ========================================================= */}
      {adminActiveCall && (
        <div
          className="modal-overlay"
          onClick={endAdminCall}
          style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '640px', background: 'linear-gradient(180deg, #0f172a 0%, #080e1a 100%)', color: '#fff', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--byt-sea)' }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', background: 'rgba(8, 145, 178, 0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: adminActiveCall.status === 'connected' ? '#10b981' : adminActiveCall.status === 'error' ? '#ef4444' : adminActiveCall.status === 'ringing' ? '#38bdf8' : '#f59e0b',
                    animation: adminActiveCall.status === 'ringing' ? 'pulse-ring 1s infinite' : 'none'
                  }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
                    {adminActiveCall.type === 'video' ? '📹 Video Call:' : '📞 Voice Call:'} {adminActiveCall.driver.name}
                  </h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--byt-sea-light)', marginTop: '2px' }}>
                  {adminActiveCall.status === 'requesting' ? 'Requesting device microphone/camera permission...' :
                   adminActiveCall.status === 'ringing' ? 'Ringing • Waiting for Driver to answer...' :
                   adminActiveCall.status === 'declined' ? 'Call Declined / Driver Busy' :
                   adminActiveCall.status === 'connected' ? `Connected (Encrypted In-App VoIP) • ${Math.floor(adminCallDuration / 60)}:${(adminCallDuration % 60).toString().padStart(2, '0')}` :
                   'Permission Required'}
                </div>
              </div>
              <button
                type="button"
                onClick={endAdminCall}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              {adminActiveCall.status === 'error' ? (
                <div style={{ padding: '30px 20px', background: 'rgba(239, 68, 68, 0.12)', borderRadius: 'var(--radius-lg)', border: '1px solid #ef4444' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔒</div>
                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: '6px' }}>Device Hardware Permission Required</div>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 16px', lineHeight: 1.5 }}>
                    {adminActiveCall.errorMsg || 'Please grant microphone or camera permission to make in-software calls.'}
                  </p>
                  <button
                    onClick={() => startAdminInAppCall(adminActiveCall.driver, adminActiveCall.type)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Grant Device Permission & Retry
                  </button>
                </div>
              ) : adminActiveCall.status === 'ringing' ? (
                /* Ringing Screen - Waiting for driver to answer */
                <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      position: 'absolute', width: 140, height: 140, borderRadius: '50%',
                      border: '2px dashed rgba(34, 211, 238, 0.4)',
                      animation: 'spin 12s linear infinite'
                    }} />
                    <div style={{
                      width: 96, height: 96, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.2rem', fontWeight: 800, color: '#fff',
                      boxShadow: '0 0 40px rgba(8, 145, 178, 0.5)',
                      border: '3px solid var(--byt-sea-light)'
                    }}>
                      {driverPictures[adminActiveCall.driver.id] ? (
                        <img src={driverPictures[adminActiveCall.driver.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        adminActiveCall.driver.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Calling {adminActiveCall.driver.name}...</div>
                    <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '3px' }}>🔔 Ringing in-vehicle device • Waiting for driver to answer</div>
                  </div>

                  {/* Driver Device Simulation Card */}
                  <div style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: 'rgba(15, 23, 42, 0.96)',
                    border: '2px solid #06b6d4',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.35)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 800, marginBottom: '4px' }}>
                      📲 {adminActiveCall.driver.name}&apos;s In-Vehicle Tablet (Simulation)
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                      Incoming Dispatcher {adminActiveCall.type === 'video' ? 'Video' : 'Voice'} Call
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                      Call will connect once the driver answers
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={handleAdminAnswerCall}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 22px',
                          borderRadius: '25px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.45)'
                        }}
                      >
                        <span>📞</span>
                        <span>Answer Call</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAdminDeclineCall}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid #ef4444',
                          padding: '10px 18px',
                          borderRadius: '25px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  </div>
                </div>
              ) : adminActiveCall.status === 'declined' ? (
                <div style={{ padding: '30px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📵</div>
                  <h3 style={{ color: '#ef4444', margin: '0 0 6px' }}>Call Declined</h3>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>{adminActiveCall.driver.name} is currently driving or declined the call.</p>
                </div>
              ) : adminActiveCall.type === 'video' ? (
                <div style={{ position: 'relative', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video
                    ref={adminVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                  />
                  {isAdminVideoOff && (
                    <div style={{ position: 'absolute', inset: 0, background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--byt-sea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
                        {adminActiveCall.driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>Camera is Off</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    HD Device Camera Live
                  </div>
                </div>
              ) : (
                /* In-App Voice Call Screen */
                <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: 96, height: 96, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', fontWeight: 800, color: '#fff',
                    boxShadow: '0 0 35px rgba(8, 145, 178, 0.35)',
                    border: '3px solid var(--byt-sea-light)',
                    position: 'relative'
                  }}>
                    {driverPictures[adminActiveCall.driver.id] ? (
                      <img src={driverPictures[adminActiveCall.driver.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      adminActiveCall.driver.name.split(' ').map(n => n[0]).join('')
                    )}
                    {isAdminMuted && (
                      <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 24, height: 24, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🔇
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{adminActiveCall.driver.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fleet Driver • Phone: {adminActiveCall.driver.phone}</div>
                  </div>

                  {/* Audio Wave Visualizer */}
                  {adminActiveCall.status === 'connected' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '36px' }}>
                      {[14, 24, 36, 20, 30, 16, 26].map((h, i) => (
                        <span
                          key={i}
                          style={{
                            width: '4px',
                            height: `${h}px`,
                            background: isAdminMuted ? '#64748b' : 'var(--byt-sea-light)',
                            borderRadius: '2px',
                            animation: isAdminMuted ? 'none' : `wave ${0.6 + i * 0.1}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Call Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
                {adminActiveCall.status === 'connected' && (
                  <button
                    type="button"
                    onClick={toggleAdminMute}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '24px',
                      background: isAdminMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    title={isAdminMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    <span>{isAdminMuted ? '🔇' : '🎙️'}</span>
                    <span>{isAdminMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                )}

                {adminActiveCall.type === 'video' && adminActiveCall.status === 'connected' && (
                  <button
                    type="button"
                    onClick={toggleAdminVideo}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '24px',
                      background: isAdminVideoOff ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    title={isAdminVideoOff ? 'Turn camera on' : 'Turn camera off'}
                  >
                    <span>{isAdminVideoOff ? '🚫' : '📹'}</span>
                    <span>{isAdminVideoOff ? 'Camera Off' : 'Camera On'}</span>
                  </button>
                )}

                {/* Explicit Red HANG UP Button */}
                <button
                  type="button"
                  onClick={endAdminCall}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    letterSpacing: '0.3px'
                  }}
                  title="Hang Up"
                >
                  <span style={{ fontSize: '1.2rem' }}>☎️</span>
                  <span>Hang Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRIVER CHAT HISTORY DRAWER                                */}
      {/* ========================================================= */}
      {selectedChatDriver && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedChatDriver(null)}
          style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{
              width: '95%',
              maxWidth: '1050px',
              height: '85vh',
              maxHeight: '800px',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Top Header */}
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    border: '2px solid var(--byt-sea-light)',
                    position: 'relative',
                    fontSize: '1rem',
                    overflow: 'hidden'
                  }}
                >
                  {driverPictures[selectedChatDriver.id] ? (
                    <img src={driverPictures[selectedChatDriver.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    selectedChatDriver.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                      {selectedChatDriver.name}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(selectedChatDriver.status)}`} style={{ fontSize: '0.7rem' }}>
                      {selectedChatDriver.status}
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      Balance: {getBalanceLabel(selectedChatDriver.balance).text}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📞 {selectedChatDriver.phone}</span>
                      <Link
                        href={`/admin/gps?phone=${encodeURIComponent(selectedChatDriver.phone)}`}
                        className="btn btn-ghost btn-sm"
                        style={{
                          fontSize: '0.68rem',
                          padding: '1px 7px',
                          borderRadius: '10px',
                          background: 'rgba(8, 145, 178, 0.1)',
                          border: '1px solid var(--byt-sea)',
                          color: 'var(--byt-sea-dark)',
                          fontWeight: 700
                        }}
                        title="Track live GPS location for this driver"
                      >
                        📍 Track GPS
                      </Link>
                    </div>
                    <span>✉️ {selectedChatDriver.email}</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => startAdminInAppCall(selectedChatDriver, 'voice')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <span>📞</span>
                  <span>Voice Call</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => startAdminInAppCall(selectedChatDriver, 'video')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <span>📹</span>
                  <span>Video Call</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setSelectedChatDriver(null)}
                  style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Left Driver Switcher + Right Chat Thread */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Left Column: Driver Quick Selector */}
              <div
                style={{
                  width: '280px',
                  borderRight: '1px solid var(--color-border)',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <input
                    type="text"
                    placeholder="Switch driver..."
                    value={chatSearch}
                    onChange={e => setChatSearch(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                  {chatDriversList.map(d => {
                    const isSelected = d.id === selectedChatDriver.id;
                    const dMsgs = conversations[d.id] || [];
                    const lastDMsg = dMsgs[dMsgs.length - 1];

                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedChatDriver(d)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                          border: isSelected ? '1px solid var(--byt-sea)' : '1px solid transparent',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: 'var(--byt-sea)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}
                        >
                          {driverPictures[d.id] ? (
                            <img src={driverPictures[d.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            d.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }} className="truncate">
                              {d.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }} className="truncate">
                            {lastDMsg ? lastDMsg.text : 'No messages'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Chat Messages & Reply */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(conversations[selectedChatDriver.id] || []).map(msg => {
                    const isAdmin = msg.sender === 'ADMIN';
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                          maxWidth: '72%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdmin ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-lg)',
                            background: isAdmin ? 'var(--byt-sea)' : '#f1f5f9',
                            color: isAdmin ? '#ffffff' : '#0f172a',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            border: isAdmin ? 'none' : '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}
                        >
                          {msg.file && (
                            <div style={{ marginBottom: msg.text ? '8px' : 0 }}>
                              {msg.file.type === 'image' ? (
                                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxWidth: '280px', background: '#000' }}>
                                  <img
                                    src={msg.file.url}
                                    alt={msg.file.name}
                                    style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem' }}>
                                    <span className="truncate" style={{ maxWidth: 140 }}>{msg.file.name}</span>
                                    <a href={msg.file.url} download={msg.file.name} style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 600 }}>⬇ Save</a>
                                  </div>
                                </div>
                              ) : (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  background: isAdmin ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid rgba(0,0,0,0.08)',
                                  maxWidth: '280px'
                                }}>
                                  <span style={{ fontSize: '1.5rem' }}>📄</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }} className="truncate">{msg.file.name}</div>
                                    <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{msg.file.size}</div>
                                  </div>
                                  <a
                                    href={msg.file.url}
                                    download={msg.file.name}
                                    style={{
                                      fontSize: '0.72rem',
                                      color: isAdmin ? '#fff' : 'var(--byt-sea)',
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      padding: '3px 8px',
                                      background: isAdmin ? 'rgba(255,255,255,0.25)' : 'rgba(8,145,178,0.12)',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    ⬇
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          {msg.text}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '3px' }}>
                          {msg.senderName} • {msg.time}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Admin Pending File Chip */}
                {adminPendingFile && (
                  <div style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '1.2rem' }}>{adminPendingFile.type === 'image' ? '🖼️' : '📄'}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }} className="truncate">
                          {adminPendingFile.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          {adminPendingFile.size} • Ready to send
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setAdminPendingFile(null)}
                      style={{ fontSize: '0.75rem', color: '#ef4444' }}
                      title="Remove attachment"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}

                {/* Reply Form with File Attachments */}
                <form onSubmit={handleSendReply} style={{ padding: '12px 18px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="file"
                    ref={adminFileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAdminFileChange}
                  />
                  <input
                    type="file"
                    ref={adminImageInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAdminFileChange}
                  />

                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    title="Attach File / Document"
                    onClick={() => adminFileInputRef.current?.click()}
                  >
                    📎
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    title="Attach Photo / Image"
                    onClick={() => adminImageInputRef.current?.click()}
                  >
                    📷
                  </button>

                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={adminPendingFile ? 'Add a caption...' : `Reply to ${selectedChatDriver.name}...`}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!replyText.trim() && !adminPendingFile}
                  >
                    Send 📤
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* COMPREHENSIVE PHONE & DEVICE TELEMETRY INSPECTOR MODAL */}
      {/* ========================================================= */}
      {showPhoneModal && inspectingPhoneData && (
        <div
          className="modal-overlay"
          onClick={() => setShowPhoneModal(false)}
          style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{
              width: '95%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#091322',
              border: '1.5px solid #06b6d4',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(6,182,212,0.3)',
              borderRadius: 'var(--radius-xl)',
              color: '#fff'
            }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <span>📱 Driver Phone & Cellular Device Telemetry</span>
                  <span style={{ fontSize: '0.75rem', background: '#0891b2', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                    {inspectingPhoneData.carrier}
                  </span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Hardware specs, SIM subscriber identity, network signal diagnostics & live coordinates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Driver Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0891b2, #0284c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#fff',
                    border: '2px solid #38bdf8'
                  }}>
                    {inspectingPhoneData.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{inspectingPhoneData.driverName}</div>
                    <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600 }}>📞 {inspectingPhoneData.phone} ({inspectingPhoneData.internationalPhone})</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`tel:${inspectingPhoneData.phone}`}
                    className="btn btn-sm"
                    style={{ background: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>📞</span>
                    <span>Call Number</span>
                  </a>
                  <a
                    href={getWhatsAppUrl(inspectingPhoneData.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#25D366', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 3-Column Telemetry Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {/* SIM & Carrier Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    📶 SIM & Cellular Network
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Carrier:</span> <strong>{inspectingPhoneData.carrier}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Network Tech:</span> <strong>{inspectingPhoneData.networkType}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>SIM Status:</span> <span style={{ color: '#10b981', fontWeight: 700 }}>{inspectingPhoneData.simStatus}</span></div>
                    <div><span style={{ color: '#94a3b8' }}>IMSI:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.imsi}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>ICCID:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.iccid}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Cell Tower:</span> <strong>{inspectingPhoneData.cellTower}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Signal:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.signalDbm} dBm ({inspectingPhoneData.signalBars}/4 bars)</strong></div>
                  </div>
                </div>

                {/* Handset & Device Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    📱 Handset & Diagnostics
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Device Model:</span> <strong>{inspectingPhoneData.deviceModel}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>OS Version:</span> <strong>{inspectingPhoneData.osVersion}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>IMEI:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.imei}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Battery:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.battery}% {inspectingPhoneData.isCharging ? '⚡ (Charging)' : '🔋'}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>IP Address:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.ipAddress}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>APN:</span> <strong>{inspectingPhoneData.apn}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Assigned Vehicle:</span> <strong>{inspectingPhoneData.vehiclePlate}</strong></div>
                  </div>
                </div>

                {/* Location & GPS Fix Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    🛰️ GNSS & Precise Location
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Landmark:</span> <strong style={{ color: '#fff' }}>{inspectingPhoneData.address}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Coordinates:</span> <strong style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{inspectingPhoneData.lat.toFixed(5)}°, {inspectingPhoneData.lng.toFixed(5)}°</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Speed:</span> <strong>{inspectingPhoneData.speed} km/h</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Satellites:</span> <strong>{inspectingPhoneData.satellites} (GPS+GLONASS 3D Fix)</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Accuracy:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.accuracy}</strong></div>
                  </div>
                </div>
              </div>

              {/* Real Google Maps Launchers */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Google Maps Real Features:</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Launch official Google navigation, Street View 360° or roadmap for this driver</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={getGoogleMapsUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#0891b2', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🗺️ Open in Google Maps</span>
                  </a>
                  <a
                    href={getGoogleStreetViewUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#fde047', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🚶 Street View 360°</span>
                  </a>
                  <a
                    href={getGoogleDirectionsUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🧭 Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {editingDriver && (
        <div className="modal-overlay" onClick={() => setEditingDriver(null)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveEditedDriver}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0 }}>✏️ Edit Driver Details</h3>
                    <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>ID: {editingDriver.id}</span>
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '3px' }}>
                    Modify credentials, fleet vehicle assignment, targets, and live balances for <strong>{editingDriver.name}</strong>.
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditingDriver(null)}>✕</button>
              </div>

              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {editFormError && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ef4444',
                    fontSize: '0.82rem',
                    marginBottom: 'var(--space-md)'
                  }}>
                    {editFormError}
                  </div>
                )}

                {/* Personal Information */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--byt-sea-dark)', marginBottom: '8px' }}>
                    👤 Personal Information
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Kwame Asante"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="024-XXX-XXXX"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="driver@byt.com"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status & Fleet Assignment */}
                <div style={{ marginBottom: 'var(--space-md)', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--byt-sea-dark)', marginBottom: '8px' }}>
                    🚗 Status & Vehicle Assignment
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label className="form-label">Account Status</label>
                      <select
                        className="form-select"
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                      >
                        <option value="ACTIVE">🟢 ACTIVE</option>
                        <option value="PENDING">🟡 PENDING</option>
                        <option value="REMOVED">🔴 REMOVED</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Operational Status</label>
                      <select
                        className="form-select"
                        value={editOperationalStatus}
                        onChange={e => setEditOperationalStatus(e.target.value as any)}
                      >
                        <option value="ACTIVE">🟢 ACTIVE (Ready)</option>
                        <option value="ON_TRIP">🟡 ON_TRIP (On Road)</option>
                        <option value="MAINTENANCE">🔧 MAINTENANCE</option>
                        <option value="OFFLINE">⚪ OFFLINE</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Fleet Vehicle</label>
                    <select
                      className="form-select font-mono"
                      value={editPlate}
                      onChange={e => setEditPlate(e.target.value)}
                    >
                      <option value="UNASSIGNED">None (Unassigned / Floating Driver)</option>
                      {demoVehicles.map(v => (
                        <option key={v.id} value={v.plateNumber}>
                          {v.plateNumber} — {v.make} {v.model} {v.assignedDriverName && v.assignedDriverName !== editingDriver.name ? `(Assigned to: ${v.assignedDriverName})` : v.assignedDriverName === editingDriver.name ? '(Currently assigned to this driver)' : '(Available)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remittance Targets & Balances */}
                <div style={{ marginBottom: 'var(--space-md)', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--byt-sea-dark)', marginBottom: '8px' }}>
                    💰 Targets & Balance Ledger
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Daily Target (GHS)</label>
                      <input
                        type="number"
                        className="form-input font-mono"
                        placeholder="100"
                        value={editDailyTarget}
                        onChange={e => setEditDailyTarget(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Weekly Target (GHS)</label>
                      <input
                        type="number"
                        className="form-input font-mono"
                        placeholder="600"
                        value={editWeeklyTarget}
                        onChange={e => setEditWeeklyTarget(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>
                        Balance (GHS)
                        <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>+ owes BYT | - credit</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input font-mono"
                        placeholder="0.00"
                        value={editBalance}
                        onChange={e => setEditBalance(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Driver Safety & Telemetry Score */}
                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--byt-sea-dark)', marginBottom: '8px' }}>
                    ⭐ Safety & Performance Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editDriverScore}
                        onChange={e => setEditDriverScore(e.target.value)}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--byt-sea)' }}
                      />
                    </div>
                    <div style={{ minWidth: '60px', textAlign: 'right' }}>
                      <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: parseInt(editDriverScore) >= 80 ? '#10b981' : parseInt(editDriverScore) >= 60 ? '#eab308' : '#ef4444' }}>
                        {editDriverScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingDriver(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>✓</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleAddDriverSubmit}>
              <div className="modal-header">
                <div>
                  <h3 style={{ margin: 0 }}>➕ Add New Driver</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Register a new driver into the BYT Fleet management system.
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
              </div>

              <div className="modal-body">
                {addDriverFormError && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ef4444',
                    fontSize: '0.82rem',
                    marginBottom: 'var(--space-md)'
                  }}>
                    {addDriverFormError}
                  </div>
                )}

                {/* Full Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Samuel Mensah"
                      value={addDriverName}
                      onChange={e => setAddDriverName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="024-XXX-XXXX"
                      value={addDriverPhone}
                      onChange={e => setAddDriverPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email & Operational Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="driver@byt.com"
                      value={addDriverEmail}
                      onChange={e => setAddDriverEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Operational Status</label>
                    <select
                      className="form-select"
                      value={addDriverOperationalStatus}
                      onChange={e => setAddDriverOperationalStatus(e.target.value as any)}
                    >
                      <option value="ACTIVE">🟢 ACTIVE (Ready)</option>
                      <option value="ON_TRIP">🟡 ON_TRIP (On Road)</option>
                      <option value="MAINTENANCE">🔧 MAINTENANCE</option>
                      <option value="OFFLINE">⚪ OFFLINE</option>
                    </select>
                  </div>
                </div>

                {/* Assign Vehicle */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Assign Vehicle</label>
                  <select
                    className="form-select font-mono"
                    value={addDriverPlate}
                    onChange={e => setAddDriverPlate(e.target.value)}
                  >
                    <option value="UNASSIGNED">None (Unassigned)</option>
                    {demoVehicles.map(v => (
                      <option key={v.id} value={v.plateNumber}>
                        {v.plateNumber} — {v.make} {v.model} {v.assignedDriverName ? `(Currently: ${v.assignedDriverName})` : '(Available)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daily Target & Weekly Target & Balance */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Daily Target (GHS)</label>
                    <input
                      type="number"
                      className="form-input font-mono"
                      placeholder="100"
                      value={addDriverDailyTarget}
                      onChange={e => setAddDriverDailyTarget(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Weekly Target (GHS)</label>
                    <input
                      type="number"
                      className="form-input font-mono"
                      placeholder="600"
                      value={addDriverWeeklyTarget}
                      onChange={e => setAddDriverWeeklyTarget(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Initial Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input font-mono"
                      placeholder="0.00"
                      value={addDriverInitialBalance}
                      onChange={e => setAddDriverInitialBalance(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">✓ Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
