'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  VehicleTCOProfile,
  TCOCalculationResult,
  DEFAULT_TCO_PROFILES,
  calculateTCO,
  getStoredTCOProfiles,
  saveStoredTCOProfiles
} from '@/lib/tco-calculator';
import { formatCurrency } from '@/lib/demo-data';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const TIER_COLORS = {
  EXCELLENT: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', border: '#10b981', label: '⭐ High Margin Asset' },
  HEALTHY: { bg: 'rgba(8, 145, 178, 0.12)', text: '#0891b2', border: '#0891b2', label: '✅ Healthy Cashflow' },
  MARGINAL: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706', border: '#f59e0b', label: '⚠️ Review OpEx' },
  LOSS_MAKING: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', border: '#ef4444', label: '🚨 Loss Maker' },
};

const PIE_COLORS = ['#0891b2', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export default function TCOCalculatorPage() {
  const [profiles, setProfiles] = useState<VehicleTCOProfile[]>(DEFAULT_TCO_PROFILES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('v1');
  const [simulationFuelPrice, setSimulationFuelPrice] = useState<number>(14.80);
  const [simulationDailyTarget, setSimulationDailyTarget] = useState<number>(140);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VEHICLE_DEEPDIVE' | 'EV_VS_ICE' | 'SIMULATOR'>('OVERVIEW');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<VehicleTCOProfile | null>(null);

  useEffect(() => {
    const loaded = getStoredTCOProfiles();
    setProfiles(loaded);

    const handleUpdate = () => {
      setProfiles(getStoredTCOProfiles());
    };
    window.addEventListener('byt-tco-updated', handleUpdate);
    return () => window.removeEventListener('byt-tco-updated', handleUpdate);
  }, []);

  // Recalculate all profiles
  const results: (TCOCalculationResult & { profile: VehicleTCOProfile })[] = useMemo(() => {
    return profiles.map(p => {
      const activeProfile: VehicleTCOProfile = p.vehicleId === selectedVehicleId ? {
        ...p,
        fuelPricePerLiterGhs: simulationFuelPrice,
        dailyTargetRemittanceGhs: simulationDailyTarget,
      } : p;

      return {
        ...calculateTCO(activeProfile),
        profile: activeProfile
      };
    });
  }, [profiles, selectedVehicleId, simulationFuelPrice, simulationDailyTarget]);

  const selectedVehicleResult = useMemo(() => {
    return results.find(r => r.vehicleId === selectedVehicleId) || results[0];
  }, [results, selectedVehicleId]);

  // Fleet Aggregates
  const fleetTotals = useMemo(() => {
    const totalCapEx = results.reduce((sum, r) => sum + r.profile.purchasePriceGhs, 0);
    const totalMonthlyRevenue = results.reduce((sum, r) => sum + r.monthlyGrossRevenue, 0);
    const totalMonthlyCost = results.reduce((sum, r) => sum + r.totalMonthlyCost, 0);
    const totalMonthlyNet = results.reduce((sum, r) => sum + r.monthlyNetProfit, 0);
    const avgMargin = results.length > 0 ? totalMonthlyNet / (totalMonthlyRevenue || 1) * 100 : 0;
    const avgCostPerKm = results.length > 0 ? results.reduce((sum, r) => sum + r.totalCostPerKm, 0) / results.length : 0;
    const totalLifeCycleProfit = results.reduce((sum, r) => sum + r.lifeCycleNetProfit, 0);

    return {
      totalCapEx,
      totalMonthlyRevenue,
      totalMonthlyCost,
      totalMonthlyNet,
      avgMargin,
      avgCostPerKm,
      totalLifeCycleProfit
    };
  }, [results]);

  const filteredResults = useMemo(() => {
    if (filterType === 'ALL') return results;
    return results.filter(r => r.profile.fuelType === filterType);
  }, [results, filterType]);

  // Handle Profile Update
  const handleSaveProfile = (updated: VehicleTCOProfile) => {
    const newProfiles = profiles.map(p => p.vehicleId === updated.vehicleId ? updated : p);
    setProfiles(newProfiles);
    saveStoredTCOProfiles(newProfiles);
    setIsEditing(false);
  };

  const handleSelectVehicle = (vId: string) => {
    setSelectedVehicleId(vId);
    const target = profiles.find(p => p.vehicleId === vId);
    if (target) {
      setSimulationFuelPrice(target.fuelPricePerLiterGhs);
      setSimulationDailyTarget(target.dailyTargetRemittanceGhs);
    }
  };

  // Breakdown chart for selected vehicle
  const selectedCostBreakdown = [
    { name: 'Depreciation (CapEx)', value: selectedVehicleResult.monthlyCapExDepreciation, color: '#0891b2' },
    { name: 'Fuel / Power', value: selectedVehicleResult.monthlyFuelCost, color: '#f59e0b' },
    { name: 'Maintenance & Tires', value: selectedVehicleResult.monthlyMaintenanceCost, color: '#ef4444' },
    { name: 'Insurance & DVLA', value: selectedVehicleResult.monthlyInsuranceAndCompliance, color: '#10b981' },
    { name: 'Telematics & SIM', value: selectedVehicleResult.monthlyTelematicsCost, color: '#8b5cf6' },
  ];

  // Comparison data for all vehicles
  const comparisonBarData = results.map(r => ({
    plate: r.plateNumber,
    name: `${r.profile.make} ${r.profile.model.split(' ')[0]}`,
    Revenue: r.monthlyGrossRevenue,
    Cost: r.totalMonthlyCost,
    NetProfit: r.monthlyNetProfit,
    CostPerKm: r.totalCostPerKm,
    Margin: r.profitMarginPercent,
  }));

  // EV vs Petrol Comparison Calculation
  const petrolAverage = useMemo(() => {
    const ice = results.filter(r => r.profile.fuelType === 'PETROL');
    if (ice.length === 0) return null;
    return {
      avgMonthlyFuel: Math.round(ice.reduce((s, r) => s + r.monthlyFuelCost, 0) / ice.length),
      avgMonthlyMaintenance: Math.round(ice.reduce((s, r) => s + r.monthlyMaintenanceCost, 0) / ice.length),
      avgCostPerKm: (ice.reduce((s, r) => s + r.totalCostPerKm, 0) / ice.length).toFixed(2),
      avgMargin: (ice.reduce((s, r) => s + r.profitMarginPercent, 0) / ice.length).toFixed(1),
      avgNetProfit: Math.round(ice.reduce((s, r) => s + r.monthlyNetProfit, 0) / ice.length),
    };
  }, [results]);

  const evResult = results.find(r => r.profile.fuelType === 'EV') || results[results.length - 1];

  return (
    <div style={{ padding: '0 0 var(--space-2xl) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.75rem' }}>🧮</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Total Cost of Ownership (TCO) & Asset ROI</h1>
              <p className="subtitle" style={{ margin: 0 }}>
                Vehicle lifecycle financial modeling: CapEx depreciation, fuel drag, maintenance per-km, and driver payback breakeven.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            {(['OVERVIEW', 'VEHICLE_DEEPDIVE', 'EV_VS_ICE', 'SIMULATOR'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--byt-sea)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab === 'OVERVIEW' && '📊 Fleet TCO Overview'}
                {tab === 'VEHICLE_DEEPDIVE' && '🔍 Asset Detail'}
                {tab === 'EV_VS_ICE' && '⚡ EV vs Petrol ROI'}
                {tab === 'SIMULATOR' && '🧪 Cashflow Simulator'}
              </button>
            ))}
          </div>

          <Link href="/admin/financials" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>📈</span>
            <span>View Ledger Audits</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--byt-sea)' }}>
          <div className="stat-icon" style={{ background: 'rgba(8, 145, 178, 0.1)', color: 'var(--byt-sea)' }}>🚗</div>
          <div className="stat-number" style={{ fontFamily: 'var(--font-mono)', color: 'var(--byt-sea)' }}>
            {formatCurrency(fleetTotals.totalMonthlyRevenue)}
          </div>
          <div className="stat-title">Fleet Monthly Gross Inflow</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Across {results.length} commercial vehicles
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>📉</div>
          <div className="stat-number" style={{ fontFamily: 'var(--font-mono)', color: '#ef4444' }}>
            {formatCurrency(fleetTotals.totalMonthlyCost)}
          </div>
          <div className="stat-title">Fleet Monthly TCO Burn</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            CapEx Depreciation + OpEx Fuel & Maintenance
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>💰</div>
          <div className="stat-number" style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>
            {formatCurrency(fleetTotals.totalMonthlyNet)}
          </div>
          <div className="stat-title">Net Monthly Fleet Cashflow</div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
            {fleetTotals.avgMargin.toFixed(1)}% Fleetwide Profit Margin
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>📏</div>
          <div className="stat-number" style={{ fontFamily: 'var(--font-mono)', color: '#d97706' }}>
            GHS {fleetTotals.avgCostPerKm.toFixed(2)}
          </div>
          <div className="stat-title">Blended Cost per Km (CPK)</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Target: &lt; GHS 0.95/km for commercial taxi
          </div>
        </div>
      </div>

      {/* TAB 1: FLEET TCO OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* COMPARISON BAR CHART */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Monthly Revenue vs Total Cost of Ownership by Vehicle</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Visual comparison of monthly cashflow generation against blended CapEx & OpEx burden
                </p>
              </div>

              {/* Fuel filter */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-input)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                {['ALL', 'PETROL', 'HYBRID', 'EV'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterType(f)}
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: filterType === f ? 'var(--byt-sea)' : 'transparent',
                      color: filterType === f ? '#fff' : 'var(--color-text-secondary)'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body" style={{ height: 320, padding: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="plate" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val: number) => `₵${(val / 1000).toFixed(1)}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val || 0)), '']}
                    contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.78rem', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
                  <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NetProfit" fill="#0891b2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FLEET TCO TABLE */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Fleet Lifecycle Profitability Matrix</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Click any vehicle to inspect detailed cost per kilometer, adjust parameters, or model lease-to-own terms
                </p>
              </div>
            </div>

            <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-input)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px' }}>Vehicle / Plate</th>
                    <th style={{ padding: '12px 14px' }}>Driver</th>
                    <th style={{ padding: '12px 14px' }}>Fuel Type</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>CapEx (Purchase)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Monthly Cost</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Monthly Revenue</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Net Profit</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Cost / KM</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Payback</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map(r => {
                    const tier = TIER_COLORS[r.profitabilityTier];
                    const isSelected = r.vehicleId === selectedVehicleId;
                    return (
                      <tr
                        key={r.vehicleId}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                          background: isSelected ? 'rgba(8, 145, 178, 0.04)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
                              {r.plateNumber}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{r.profile.make} {r.profile.model} ({r.profile.year})</div>
                        </td>

                        <td style={{ padding: '12px 14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                          {r.profile.assignedDriverName}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: r.profile.fuelType === 'EV' ? 'rgba(16, 185, 129, 0.15)' : r.profile.fuelType === 'HYBRID' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: r.profile.fuelType === 'EV' ? '#059669' : r.profile.fuelType === 'HYBRID' ? '#0284c7' : '#d97706',
                          }}>
                            {r.profile.fuelType === 'EV' ? '⚡ EV Clean' : r.profile.fuelType === 'HYBRID' ? '🌱 Hybrid' : '⛽ Petrol'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(r.profile.purchasePriceGhs)}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 600 }}>
                          {formatCurrency(r.totalMonthlyCost)}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 600 }}>
                          {formatCurrency(r.monthlyGrossRevenue)}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.monthlyNetProfit >= 0 ? 'var(--byt-sea-dark)' : '#ef4444' }}>
                          {formatCurrency(r.monthlyNetProfit)}
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{r.profitMarginPercent}% margin</div>
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          GHS {r.totalCostPerKm.toFixed(2)}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.breakevenMonths <= 30 ? '#059669' : '#d97706' }}>
                          {r.breakevenMonths} mos
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: tier.bg,
                            color: tier.text,
                            border: `1px solid ${tier.border}`
                          }}>
                            {tier.label}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectVehicle(r.vehicleId);
                              setActiveTab('VEHICLE_DEEPDIVE');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE DEEP DIVE */}
      {activeTab === 'VEHICLE_DEEPDIVE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* VEHICLE PICKER STRIP */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {results.map(r => (
              <button
                key={r.vehicleId}
                type="button"
                onClick={() => handleSelectVehicle(r.vehicleId)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedVehicleId === r.vehicleId ? '2px solid var(--byt-sea)' : '1px solid var(--color-border)',
                  background: selectedVehicleId === r.vehicleId ? 'rgba(8, 145, 178, 0.08)' : 'var(--color-bg-card)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '170px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text)' }}>{r.plateNumber}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: r.profile.fuelType === 'EV' ? '#059669' : '#0891b2' }}>
                    {r.profile.fuelType}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{r.profile.model}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--byt-sea-dark)', marginTop: '4px' }}>
                  {formatCurrency(r.monthlyNetProfit)}/mo
                </div>
              </button>
            ))}
          </div>

          <div className="grid-2">
            {/* PIE BREAKDOWN */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Monthly Cost Composition: {selectedVehicleResult.plateNumber}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Total monthly burden: {formatCurrency(selectedVehicleResult.totalMonthlyCost)}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: TIER_COLORS[selectedVehicleResult.profitabilityTier].bg,
                  color: TIER_COLORS[selectedVehicleResult.profitabilityTier].text,
                  border: `1px solid ${TIER_COLORS[selectedVehicleResult.profitabilityTier].border}`
                }}>
                  {TIER_COLORS[selectedVehicleResult.profitabilityTier].label}
                </span>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '100%', height: 230 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={selectedCostBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {selectedCostBreakdown.map((entry, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => [formatCurrency(Number(val || 0)), '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCostBreakdown.map((item, idx) => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                        <span style={{ color: 'var(--color-text-secondary)' }}>{item.name}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.value)}
                        <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.7rem', marginLeft: '6px' }}>
                          ({((item.value / (selectedVehicleResult.totalMonthlyCost || 1)) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIFECYCLE ROI & ACTION RECOMMENDATIONS */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Lifecycle Performance & Breakeven</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Assigned Driver: {selectedVehicleResult.profile.assignedDriverName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditForm({ ...selectedVehicleResult.profile });
                      setIsEditing(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem' }}
                  >
                    ✏️ Edit Cost Baseline
                  </button>
                </div>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Grid stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Purchase / CapEx</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                        {formatCurrency(selectedVehicleResult.profile.purchasePriceGhs)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Residual: {formatCurrency(selectedVehicleResult.profile.salvageValueGhs)} ({selectedVehicleResult.profile.usefulLifeMonths} mos)
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Lifecycle Net ROI</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669' }}>
                        +{selectedVehicleResult.roiPercentage}%
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Net Profit: {formatCurrency(selectedVehicleResult.lifeCycleNetProfit)}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Operating Breakeven</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--byt-sea-dark)' }}>
                        {selectedVehicleResult.breakevenMonths} Months
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Full capital recovery timeline
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Total Cost per KM</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#d97706' }}>
                        GHS {selectedVehicleResult.totalCostPerKm.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Fuel: GHS {selectedVehicleResult.fuelCostPerKm.toFixed(2)} | Maint: GHS {selectedVehicleResult.maintenanceCostPerKm.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Box */}
                  <div style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(8, 145, 178, 0.06)',
                    border: '1px solid rgba(8, 145, 178, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--byt-sea-dark)' }}>
                        AI Fleet Asset Optimization Note:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                        {selectedVehicleResult.efficiencyTip}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Current Odometer: <strong>{selectedVehicleResult.profile.currentMileageKm.toLocaleString()} km</strong>
                </span>
                <Link href={`/admin/reports`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem' }}>
                  Inspect Driver Defect Logs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EV VS PETROL COMPARISON */}
      {activeTab === 'EV_VS_ICE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(8, 145, 178, 0.06) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div className="card-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    Commercial Fleet Transition: SolarTaxi EV vs Traditional Petrol Sedans
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Accra commercial benchmarks: Petrol (GHS 14.80/L, 12.5 km/L) vs EV Commercial Band (GHS 2.10/kWh, 7.5 km/kWh)
                  </p>
                </div>
              </div>

              {petrolAverage && evResult && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Fuel / Energy Expense</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Petrol: {formatCurrency(petrolAverage.avgMonthlyFuel)}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>EV: {formatCurrency(evResult.monthlyFuelCost)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
                      🔻 Save {formatCurrency(petrolAverage.avgMonthlyFuel - evResult.monthlyFuelCost)} / vehicle / month (78% less)
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Routine Maintenance</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Petrol: {formatCurrency(petrolAverage.avgMonthlyMaintenance)}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>EV: {formatCurrency(evResult.monthlyMaintenanceCost)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
                      🔻 Save {formatCurrency(petrolAverage.avgMonthlyMaintenance - evResult.monthlyMaintenanceCost)} (No engine oil/spark plugs)
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Net Monthly Cashflow</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Petrol: {formatCurrency(petrolAverage.avgNetProfit)}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>EV: {formatCurrency(evResult.monthlyNetProfit)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
                      🔼 +{((evResult.monthlyNetProfit - petrolAverage.avgNetProfit) / petrolAverage.avgNetProfit * 100).toFixed(0)}% Higher Net Cashflow
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>3-Year Cumulative Margin</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Petrol: {petrolAverage.avgMargin}%</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>EV: {evResult.profitMarginPercent}%</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--byt-sea-dark)', fontWeight: 700, marginTop: '6px' }}>
                      Total 3-Year EV Profit: {formatCurrency(evResult.lifeCycleNetProfit)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CASHFLOW SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Macro Cashflow & Fuel Shock Simulator</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Simulate the impact of national fuel price inflation or daily driver remittance adjustments on bottom-line profits.
                </p>
              </div>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Control 1: Fuel Price Slider */}
                <div style={{ padding: '16px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Ghana Fuel Price (GHS / Liter)</label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>
                      GHS {simulationFuelPrice.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="25.0"
                    step="0.10"
                    value={simulationFuelPrice}
                    onChange={e => setSimulationFuelPrice(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <span>GHS 10.00 (Low)</span>
                    <span>GHS 14.80 (Current Accra)</span>
                    <span>GHS 25.00 (Shock Scenario)</span>
                  </div>
                </div>

                {/* Control 2: Daily Remittance Slider */}
                <div style={{ padding: '16px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Driver Daily Target Remittance</label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                      GHS {simulationDailyTarget}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="220"
                    step="5"
                    value={simulationDailyTarget}
                    onChange={e => setSimulationDailyTarget(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <span>GHS 80 (Subsidized)</span>
                    <span>GHS 140 (Standard Sedan)</span>
                    <span>GHS 220 (High Season)</span>
                  </div>
                </div>
              </div>

              {/* SIMULATED IMPACT CARD */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: selectedVehicleResult.monthlyNetProfit >= 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${selectedVehicleResult.monthlyNetProfit >= 0 ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    Simulated Output for {selectedVehicleResult.plateNumber} ({selectedVehicleResult.profile.make} {selectedVehicleResult.profile.model})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    At GHS {simulationFuelPrice.toFixed(2)}/L and GHS {simulationDailyTarget}/day remittance:
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Simulated Monthly Fuel</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(selectedVehicleResult.monthlyFuelCost)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Simulated Net Cashflow</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: selectedVehicleResult.monthlyNetProfit >= 0 ? '#059669' : '#dc2626', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(selectedVehicleResult.monthlyNetProfit)}/mo
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Payback Period</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--byt-sea-dark)', fontFamily: 'var(--font-mono)' }}>
                      {selectedVehicleResult.breakevenMonths} Months
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BASELINE MODAL */}
      {isEditing && editForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Edit TCO Assumptions: {editForm.plateNumber}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {editForm.make} {editForm.model} ({editForm.year})
                </p>
              </div>
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Purchase Price (GHS CapEx)
                </label>
                <input
                  type="number"
                  value={editForm.purchasePriceGhs}
                  onChange={e => setEditForm({ ...editForm, purchasePriceGhs: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Salvage Residual Value (GHS)
                </label>
                <input
                  type="number"
                  value={editForm.salvageValueGhs}
                  onChange={e => setEditForm({ ...editForm, salvageValueGhs: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Useful Life (Months)
                </label>
                <input
                  type="number"
                  value={editForm.usefulLifeMonths}
                  onChange={e => setEditForm({ ...editForm, usefulLifeMonths: parseInt(e.target.value, 10) || 48 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Daily Target Remittance (GHS)
                </label>
                <input
                  type="number"
                  value={editForm.dailyTargetRemittanceGhs}
                  onChange={e => setEditForm({ ...editForm, dailyTargetRemittanceGhs: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Fuel Efficiency (km/L or km/kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.fuelEfficiencyKmPerLiter}
                  onChange={e => setEditForm({ ...editForm, fuelEfficiencyKmPerLiter: parseFloat(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Average Daily Distance (km)
                </label>
                <input
                  type="number"
                  value={editForm.avgDailyKm}
                  onChange={e => setEditForm({ ...editForm, avgDailyKm: parseInt(e.target.value, 10) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Monthly Insurance (GHS)
                </label>
                <input
                  type="number"
                  value={editForm.monthlyInsuranceGhs}
                  onChange={e => setEditForm({ ...editForm, monthlyInsuranceGhs: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Service Cost per 10,000 km (GHS)
                </label>
                <input
                  type="number"
                  value={editForm.routineServiceCostPer10kKm}
                  onChange={e => setEditForm({ ...editForm, routineServiceCostPer10kKm: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveProfile(editForm)}
                className="btn btn-primary btn-sm"
              >
                💾 Save Assumptions & Recalculate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
