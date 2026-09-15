'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { demoDrivers, demoVehicles, getStatusBadgeClass, getBalanceLabel, Driver } from '@/lib/demo-data';

interface ChatMessage {
  id: string;
  sender: 'ADMIN' | 'DRIVER';
  senderName: string;
  text: string;
  time: string;
  tag?: 'URGENT' | 'REPORT' | 'PAYMENT' | 'LOCATION';
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
  '5': [
    { id: 'kw1', sender: 'DRIVER', senderName: 'Kwesi Appiah', text: 'Good day Admin. Passenger wiper blade replaced and working nicely.', time: 'Sep 14, 01:20 PM' },
    { id: 'kw2', sender: 'ADMIN', senderName: 'Admin', text: 'Great. Your GHS 35 reimbursement has been approved on the parts dashboard.', time: 'Sep 14, 02:00 PM' },
    { id: 'kw3', sender: 'DRIVER', senderName: 'Kwesi Appiah', text: 'Will remit GHS 600 cash payment tomorrow morning at office.', time: 'Sep 14, 02:15 PM', tag: 'PAYMENT' },
  ],
  '6': [
    { id: 'ak1', sender: 'DRIVER', senderName: 'Akua Donkor', text: 'Good morning! Nissan Versa GT-2345-21 running smoothly. All morning routes cleared.', time: '09:00 AM' },
    { id: 'ak2', sender: 'ADMIN', senderName: 'Admin', text: 'Excellent job Akua. Your weekly revenue GHS 445 has been confirmed.', time: '09:10 AM', tag: 'PAYMENT' },
  ],
  '7': [
    { id: 'n1', sender: 'DRIVER', senderName: 'Nana Osei', text: 'Hello Admin, check engine light popped up near Achimota. Car still driving fine.', time: 'Yesterday 02:20 PM', tag: 'REPORT' },
    { id: 'n2', sender: 'ADMIN', senderName: 'Admin', text: 'Checking your OBD telemetry. Fuel trim looks normal, please stop by workshop by 5 PM for OBD scan.', time: 'Yesterday 02:35 PM' },
  ],
  '8': [
    { id: 'e1', sender: 'DRIVER', senderName: 'Efua Amoah', text: 'Good morning Admin. Toyota Corolla GW-0123-22 washed, clean and ready for airport runs.', time: '08:00 AM' },
    { id: 'e2', sender: 'ADMIN', senderName: 'Admin', text: 'Awesome Efua, high demand in Airport Residential area right now. Good luck!', time: '08:05 AM' },
  ],
  '9': [
    { id: 'kj1', sender: 'DRIVER', senderName: 'Kojo Annan', text: 'Hello Admin team, inquiring about my onboarding application and vehicle assignment.', time: 'Sep 12, 11:00 AM' },
    { id: 'kj2', sender: 'ADMIN', senderName: 'Admin', text: 'Hello Kojo! Your documents are approved. We are preparing a Toyota Yaris for your orientation.', time: 'Sep 12, 11:30 AM' },
  ],
  '10': [
    { id: 'ab1', sender: 'DRIVER', senderName: 'Abena Owusu', text: 'Good afternoon, uploaded my updated driver license and Ghana card copy.', time: 'Sep 13, 03:00 PM' },
    { id: 'ab2', sender: 'ADMIN', senderName: 'Admin', text: 'Thank you Abena. Verification in progress, our onboarding team will call you tomorrow.', time: 'Sep 13, 03:20 PM' },
  ],
  '11': [
    { id: 'y11', sender: 'DRIVER', senderName: 'Yaw Frimpong', text: 'Good day. Following up on vehicle handover inspection and security deposit release.', time: 'Sep 05, 10:00 AM' },
    { id: 'y12', sender: 'ADMIN', senderName: 'Admin', text: 'Vehicle returned in good condition. Clearance certificate generated and sent to accounts.', time: 'Sep 05, 11:15 AM' },
  ],
  '12': [
    { id: 'ad1', sender: 'DRIVER', senderName: 'Adwoa Poku', text: 'Hello admin, starting afternoon shift in East Legon area.', time: '01:00 PM' },
    { id: 'ad2', sender: 'ADMIN', senderName: 'Admin', text: 'Stay safe Adwoa! Report any traffic issues on the app.', time: '01:15 PM' },
  ],
};

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected driver for Chat History Modal / Drawer
  const [selectedChatDriver, setSelectedChatDriver] = useState<Driver | null>(null);
  const [chatSearch, setChatSearch] = useState('');
  const [replyText, setReplyText] = useState('');
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

  // Scroll chat to bottom when driver or messages change
  useEffect(() => {
    if (selectedChatDriver) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatDriver, conversations]);

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedChatDriver) return;

    const currentList = conversations[selectedChatDriver.id] || [];
    const newMessage: ChatMessage = {
      id: `msg-${selectedChatDriver.id}-${currentList.length + 1}`,
      sender: 'ADMIN',
      senderName: 'Admin',
      text: replyText.trim(),
      time: 'Just now',
    };

    setConversations(prev => {
      const updated = {
        ...prev,
        [selectedChatDriver.id]: [...(prev[selectedChatDriver.id] || []), newMessage]
      };
      try {
        localStorage.setItem('byt-driver-chats', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setReplyText('');
  };

  const handleQuickReply = (text: string) => {
    if (!selectedChatDriver) return;
    const currentList = conversations[selectedChatDriver.id] || [];
    const newMessage: ChatMessage = {
      id: `msg-${selectedChatDriver.id}-${currentList.length + 1}`,
      sender: 'ADMIN',
      senderName: 'Admin',
      text,
      time: 'Just now',
    };

    setConversations(prev => {
      const updated = {
        ...prev,
        [selectedChatDriver.id]: [...(prev[selectedChatDriver.id] || []), newMessage]
      };
      try {
        localStorage.setItem('byt-driver-chats', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filtered = demoDrivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) || d.email.includes(search);
    const matchFilter = filter === 'ALL' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const currentDriverMessages = selectedChatDriver
    ? (conversations[selectedChatDriver.id] || [
        {
          id: 'init-1',
          sender: 'ADMIN',
          senderName: 'Admin',
          text: `Hello ${selectedChatDriver.name}, this is BYT Admin dispatch. How can we support you today?`,
          time: 'Today',
        }
      ])
    : [];

  const chatDriversList = demoDrivers.filter(d =>
    d.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    d.phone.includes(chatSearch)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Drivers Roster</span>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>{demoDrivers.length} Registered</span>
          </h1>
          <p className="subtitle">
            Manage your driver roster, monitor status, and click any driver to view their full chat history & messages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedChatDriver(demoDrivers[0])}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>💬</span>
            <span>Open Driver Chat</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Driver
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search drivers by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          {['ALL', 'ACTIVE', 'PENDING', 'REMOVED'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
              style={{ fontSize: '0.75rem' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hint Alert */}
      <div style={{
        background: 'rgba(212, 168, 67, 0.08)',
        border: '1px solid rgba(212, 168, 67, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        marginBottom: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            <strong>Driver Chat History:</strong> Click on any driver row or the <span style={{ color: 'var(--byt-gold)' }}>💬 Chat</span> button to view their real-time messages, incident reports, and send replies.
          </span>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setSelectedChatDriver(demoDrivers[0])}
          style={{ fontSize: '0.75rem', color: 'var(--byt-gold)', whiteSpace: 'nowrap' }}
        >
          View Kwame Asante&apos;s Chat →
        </button>
      </div>

      {/* Drivers Table */}
      <div className="table-container animate-in">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Phone</th>
              <th>Assigned Vehicle</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Chat History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(driver => {
              const vehicle = demoVehicles.find(v => v.assignedDriverName === driver.name);
              const bal = getBalanceLabel(driver.balance);
              const driverMsgs = conversations[driver.id] || [];
              const lastMsg = driverMsgs[driverMsgs.length - 1];

              return (
                <tr
                  key={driver.id}
                  style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onClick={() => setSelectedChatDriver(driver)}
                  className="hover:bg-card-hover"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div
                        className="chat-avatar"
                        style={{
                          width: 38,
                          height: 38,
                          fontSize: '0.8rem',
                          position: 'relative',
                          background: driver.status === 'ACTIVE'
                            ? 'linear-gradient(135deg, #2b3924, #1b2615)'
                            : 'var(--color-bg-card)'
                        }}
                      >
                        {driver.name.split(' ').map(n => n[0]).join('')}
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
                              border: '2px solid var(--color-bg-card)'
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {driver.name}
                        </div>
                        <div className="text-xs text-muted">{driver.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{driver.phone}</td>
                  <td>
                    {vehicle ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <code className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-input)', padding: '2px 6px', borderRadius: '4px' }}>
                          {vehicle.plateNumber}
                        </code>
                        <span className="text-xs text-muted">{vehicle.make} {vehicle.model}</span>
                      </span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`text-sm font-semibold ${bal.className}`}>{bal.text}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(driver.status)}`}>{driver.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChatDriver(driver);
                      }}
                      style={{
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(212, 168, 67, 0.12)',
                        border: '1px solid rgba(212, 168, 67, 0.3)',
                        color: 'var(--byt-gold)'
                      }}
                    >
                      <span>💬</span>
                      <span>History ({driverMsgs.length})</span>
                    </button>
                    {lastMsg && (
                      <div className="text-xs text-muted truncate" style={{ maxWidth: 160, marginTop: '3px' }}>
                        {lastMsg.sender === 'DRIVER' ? 'Driver: ' : 'Admin: '}
                        {lastMsg.text}
                      </div>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="View Full Chat History"
                        onClick={() => setSelectedChatDriver(driver)}
                        style={{ color: 'var(--byt-gold)' }}
                      >
                        💬
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={`Call ${driver.name}`}
                        onClick={() => alert(`Calling ${driver.name} at ${driver.phone}...`)}
                      >
                        📞
                      </button>
                      {driver.status === 'ACTIVE' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Deactivate Driver"
                          style={{ color: 'var(--color-red)' }}
                          onClick={() => alert(`Driver ${driver.name} status updated.`)}
                        >
                          ⛔
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* DRIVER CHAT HISTORY MODAL / EXPANDED CONVERSATION DRAWER */}
      {/* ========================================================= */}
      {selectedChatDriver && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedChatDriver(null)}
          style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              background: '#0d130e',
              border: '1px solid rgba(75, 95, 38, 0.4)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(75, 95, 38, 0.15)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Top Header */}
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg, #131b14 0%, #172118 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4b5f26, #2d3b17)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    border: '2px solid rgba(212, 168, 67, 0.5)',
                    position: 'relative',
                    fontSize: '1rem'
                  }}
                >
                  {selectedChatDriver.name.split(' ').map(n => n[0]).join('')}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid #131b14'
                    }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
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
                    <span>📞 {selectedChatDriver.phone}</span>
                    <span>✉️ {selectedChatDriver.email}</span>
                    {demoVehicles.find(v => v.assignedDriverName === selectedChatDriver.name) && (
                      <span style={{ color: 'var(--byt-gold)' }}>
                        🚗 Assigned: {demoVehicles.find(v => v.assignedDriverName === selectedChatDriver.name)?.plateNumber} ({demoVehicles.find(v => v.assignedDriverName === selectedChatDriver.name)?.make} {demoVehicles.find(v => v.assignedDriverName === selectedChatDriver.name)?.model})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => alert(`Dialing ${selectedChatDriver.name} at ${selectedChatDriver.phone}...`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <span>📞</span>
                  <span>Call</span>
                </button>
                <Link
                  href="/admin/reports"
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <span>🚨</span>
                  <span>View Reports</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setSelectedChatDriver(null)}
                  style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}
                  title="Close (Esc)"
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
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#090e0a',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Search driver in chat */}
                <div style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <input
                    type="text"
                    placeholder="Switch driver..."
                    value={chatSearch}
                    onChange={e => setChatSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>

                {/* Driver Roster in Chat */}
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
                          background: isSelected
                            ? 'rgba(75, 95, 38, 0.35)'
                            : 'transparent',
                          border: isSelected
                            ? '1px solid rgba(212, 168, 67, 0.4)'
                            : '1px solid transparent',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: isSelected ? 'var(--byt-gold)' : '#1e291d',
                            color: isSelected ? '#000' : '#fff',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            flexShrink: 0
                          }}
                        >
                          {d.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              style={{
                                fontSize: '0.82rem',
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? '#fff' : 'var(--color-text-primary)'
                              }}
                              className="truncate"
                            >
                              {d.name}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                              {lastDMsg ? lastDMsg.time.split(' ')[0] : ''}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: isSelected ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-text-muted)',
                              marginTop: '2px'
                            }}
                            className="truncate"
                          >
                            {lastDMsg ? lastDMsg.text : 'No messages yet'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Chat Conversation Thread */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(180deg, #0d130e 0%, #080c09 100%)',
                  overflow: 'hidden'
                }}
              >
                {/* Conversation History Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {/* System Date Pill */}
                  <div style={{ textAlign: 'center', margin: '4px 0 12px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      🛡️ End-to-end encrypted dispatch record • Driver ID: #{selectedChatDriver.id}
                    </span>
                  </div>

                  {currentDriverMessages.map((msg) => {
                    const isAdmin = msg.sender === 'ADMIN';

                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isAdmin ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          alignSelf: isAdmin ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{isAdmin ? '👑 You (BYT Dispatch)' : selectedChatDriver.name}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>

                        <div
                          style={{
                            padding: '12px 16px',
                            borderRadius: isAdmin
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            background: isAdmin
                              ? 'linear-gradient(135deg, #d4a843 0%, #b88e30 100%)'
                              : 'rgba(255, 255, 255, 0.07)',
                            color: isAdmin ? '#000' : '#fff',
                            border: isAdmin
                              ? '1px solid rgba(255, 255, 255, 0.3)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.88rem',
                            lineHeight: 1.5,
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                            position: 'relative'
                          }}
                        >
                          {msg.tag && (
                            <div style={{ marginBottom: '6px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.5px',
                                  background: msg.tag === 'URGENT'
                                    ? '#ef4444'
                                    : msg.tag === 'PAYMENT'
                                    ? '#10b981'
                                    : msg.tag === 'REPORT'
                                    ? '#f59e0b'
                                    : '#3b82f6',
                                  color: '#fff'
                                }}
                              >
                                {msg.tag}
                              </span>
                            </div>
                          )}
                          <div>{msg.text}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Reply Pills */}
                <div
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginRight: '4px' }}>Quick actions:</span>
                  {[
                    '✅ Approved, proceed with shift',
                    '📍 Please share live GPS location',
                    '💰 Confirming payment received',
                    '🔧 Pull vehicle into base workshop',
                    '📞 Please call dispatch urgently'
                  ].map((quick, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickReply(quick)}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '16px',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      className="hover:text-gold"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendReply}
                  style={{
                    padding: '14px 18px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    background: '#0a0f0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedChatDriver.name}... (press Enter to send)`}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-lg)',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!replyText.trim()}
                    style={{
                      padding: '12px 22px',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Send</span>
                    <span>📤</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Driver</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Kwame Asante" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="024-XXX-XXXX" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="driver@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Assign Vehicle</label>
                <select className="form-select">
                  <option value="">Select a vehicle...</option>
                  {demoVehicles.filter(v => !v.assignedDriverName).map(v => (
                    <option key={v.id} value={v.id}>{v.plateNumber} — {v.make} {v.model}</option>
                  ))}
                  <option value="none">No vehicle (assign later)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Add Driver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
