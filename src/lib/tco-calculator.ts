// Total Cost of Ownership (TCO) & Vehicle Lifecycle Profitability Engine
// Tailored for commercial fleet operations in Ghana (GHS currency, local fuel & maintenance benchmarks)

export interface VehicleTCOProfile {
  vehicleId: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  assignedDriverName: string;
  fuelType: 'PETROL' | 'DIESEL' | 'HYBRID' | 'EV';
  
  // Acquisition & Capital Expenditure
  purchasePriceGhs: number;
  purchaseDate: string;
  salvageValueGhs: number; // Estimated residual value at end of lifecycle
  usefulLifeMonths: number;
  
  // Operational Metrics
  currentMileageKm: number;
  avgDailyKm: number;
  fuelEfficiencyKmPerLiter: number; // or km/kWh for EV
  fuelPricePerLiterGhs: number; // Ghana fuel price (e.g. ~14.8 GHS/L)
  
  // Operating Expenses (Monthly / Periodic)
  monthlyInsuranceGhs: number; // Comprehensive + Third Party
  monthlyRoadworthyGhs: number; // DVLA certification amortized
  monthlyTrackerSimGhs: number; // GPS telemetry & IoT SIM
  
  // Maintenance & Wear
  routineServiceCostPer10kKm: number; // Oil, filters, spark plugs, fluids
  tireReplacementCostSet: number; // 4 tires every 45,000 km
  tireLifeKm: number;
  unplannedRepairReserveMonthly: number; // Contingency fund
  
  // Revenue Generation
  dailyTargetRemittanceGhs: number; // Expected daily driver remittance
  operationalDaysPerMonth: number; // Typically 26 days in Ghana commercial taxi/ride-hail
}

export interface TCOCalculationResult {
  vehicleId: string;
  plateNumber: string;
  model: string;
  
  // Monthly Breakdown
  monthlyCapExDepreciation: number;
  monthlyFuelCost: number;
  monthlyMaintenanceCost: number;
  monthlyInsuranceAndCompliance: number;
  monthlyTelematicsCost: number;
  totalMonthlyOpex: number;
  totalMonthlyCost: number; // CapEx + OpEx
  
  // Revenue & Profitability
  monthlyGrossRevenue: number;
  monthlyNetProfit: number;
  profitMarginPercent: number;
  
  // Cost Per Kilometer (CPK)
  totalCostPerKm: number;
  fuelCostPerKm: number;
  maintenanceCostPerKm: number;
  revenuePerKm: number;
  
  // Payback & Life-Cycle ROI
  breakevenMonths: number;
  lifeCycleTotalCost: number;
  lifeCycleTotalRevenue: number;
  lifeCycleNetProfit: number;
  roiPercentage: number;
  
  // Health & Efficiency Rating
  profitabilityTier: 'EXCELLENT' | 'HEALTHY' | 'MARGINAL' | 'LOSS_MAKING';
  efficiencyTip: string;
}

// Preset Ghana fleet benchmark profiles
export const DEFAULT_TCO_PROFILES: VehicleTCOProfile[] = [
  {
    vehicleId: 'v1',
    plateNumber: 'GR-1234-22',
    make: 'Toyota',
    model: 'Corolla 1.8L',
    year: 2019,
    assignedDriverName: 'Kwame Asante',
    fuelType: 'PETROL',
    purchasePriceGhs: 145000,
    purchaseDate: '2023-01-15',
    salvageValueGhs: 55000,
    usefulLifeMonths: 48,
    currentMileageKm: 78500,
    avgDailyKm: 145,
    fuelEfficiencyKmPerLiter: 11.5,
    fuelPricePerLiterGhs: 14.80,
    monthlyInsuranceGhs: 280,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 650,
    tireReplacementCostSet: 2200,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 250,
    dailyTargetRemittanceGhs: 140,
    operationalDaysPerMonth: 26,
  },
  {
    vehicleId: 'v2',
    plateNumber: 'GR-5678-21',
    make: 'Toyota',
    model: 'Yaris 1.3L',
    year: 2020,
    assignedDriverName: 'Ama Mensah',
    fuelType: 'PETROL',
    purchasePriceGhs: 120000,
    purchaseDate: '2023-04-10',
    salvageValueGhs: 48000,
    usefulLifeMonths: 48,
    currentMileageKm: 64200,
    avgDailyKm: 130,
    fuelEfficiencyKmPerLiter: 14.2,
    fuelPricePerLiterGhs: 14.80,
    monthlyInsuranceGhs: 240,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 550,
    tireReplacementCostSet: 1800,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 180,
    dailyTargetRemittanceGhs: 130,
    operationalDaysPerMonth: 26,
  },
  {
    vehicleId: 'v3',
    plateNumber: 'GE-9012-23',
    make: 'Hyundai',
    model: 'i10 1.2L',
    year: 2021,
    assignedDriverName: 'Kofi Boateng',
    fuelType: 'PETROL',
    purchasePriceGhs: 105000,
    purchaseDate: '2023-08-01',
    salvageValueGhs: 42000,
    usefulLifeMonths: 48,
    currentMileageKm: 52100,
    avgDailyKm: 155,
    fuelEfficiencyKmPerLiter: 15.0,
    fuelPricePerLiterGhs: 14.80,
    monthlyInsuranceGhs: 220,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 500,
    tireReplacementCostSet: 1600,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 200,
    dailyTargetRemittanceGhs: 125,
    operationalDaysPerMonth: 26,
  },
  {
    vehicleId: 'v4',
    plateNumber: 'GW-3456-20',
    make: 'Kia',
    model: 'Picanto 1.0L',
    year: 2020,
    assignedDriverName: 'Yaa Serwaa',
    fuelType: 'PETROL',
    purchasePriceGhs: 95000,
    purchaseDate: '2023-09-12',
    salvageValueGhs: 38000,
    usefulLifeMonths: 48,
    currentMileageKm: 58900,
    avgDailyKm: 125,
    fuelEfficiencyKmPerLiter: 16.5,
    fuelPricePerLiterGhs: 14.80,
    monthlyInsuranceGhs: 210,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 480,
    tireReplacementCostSet: 1500,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 190,
    dailyTargetRemittanceGhs: 120,
    operationalDaysPerMonth: 26,
  },
  {
    vehicleId: 'v5',
    plateNumber: 'GS-7890-22',
    make: 'Honda',
    model: 'Fit Hybrid (e:HEV)',
    year: 2022,
    assignedDriverName: 'Kwesi Appiah',
    fuelType: 'HYBRID',
    purchasePriceGhs: 155000,
    purchaseDate: '2024-02-01',
    salvageValueGhs: 65000,
    usefulLifeMonths: 60,
    currentMileageKm: 34100,
    avgDailyKm: 160,
    fuelEfficiencyKmPerLiter: 21.0,
    fuelPricePerLiterGhs: 14.80,
    monthlyInsuranceGhs: 310,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 700,
    tireReplacementCostSet: 2000,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 220,
    dailyTargetRemittanceGhs: 150,
    operationalDaysPerMonth: 26,
  },
  {
    vehicleId: 'v6',
    plateNumber: 'GT-4567-24',
    make: 'SolarTaxi',
    model: 'Cherry EQ1 EV',
    year: 2024,
    assignedDriverName: 'Akua Donkor',
    fuelType: 'EV',
    purchasePriceGhs: 175000,
    purchaseDate: '2024-05-15',
    salvageValueGhs: 80000,
    usefulLifeMonths: 60,
    currentMileageKm: 21400,
    avgDailyKm: 150,
    fuelEfficiencyKmPerLiter: 7.5, // represents km per kWh
    fuelPricePerLiterGhs: 2.10, // electricity tariff per kWh in Ghana commercial band
    monthlyInsuranceGhs: 340,
    monthlyRoadworthyGhs: 45,
    monthlyTrackerSimGhs: 35,
    routineServiceCostPer10kKm: 220, // EVs have minimal brake pad wear & zero oil/spark plug expense
    tireReplacementCostSet: 1900,
    tireLifeKm: 45000,
    unplannedRepairReserveMonthly: 150,
    dailyTargetRemittanceGhs: 145,
    operationalDaysPerMonth: 26,
  },
];

export function calculateTCO(profile: VehicleTCOProfile): TCOCalculationResult {
  const monthlyKm = profile.avgDailyKm * profile.operationalDaysPerMonth;

  // 1. Depreciation (Straight-line CapEx)
  const netDepreciationTotal = Math.max(profile.purchasePriceGhs - profile.salvageValueGhs, 0);
  const monthlyCapExDepreciation = netDepreciationTotal / (profile.usefulLifeMonths || 48);

  // 2. Fuel / Energy Cost
  const litersOrKwhUsed = monthlyKm / Math.max(profile.fuelEfficiencyKmPerLiter, 1);
  const monthlyFuelCost = litersOrKwhUsed * profile.fuelPricePerLiterGhs;

  // 3. Maintenance Cost (Routine + Tires + Reserve)
  const routineCostPerKm = profile.routineServiceCostPer10kKm / 10000;
  const tireCostPerKm = profile.tireReplacementCostSet / (profile.tireLifeKm || 45000);
  const monthlyRoutineAndTires = monthlyKm * (routineCostPerKm + tireCostPerKm);
  const monthlyMaintenanceCost = monthlyRoutineAndTires + profile.unplannedRepairReserveMonthly;

  // 4. Compliance & Telematics
  const monthlyInsuranceAndCompliance = profile.monthlyInsuranceGhs + profile.monthlyRoadworthyGhs;
  const monthlyTelematicsCost = profile.monthlyTrackerSimGhs;

  // Totals
  const totalMonthlyOpex = monthlyFuelCost + monthlyMaintenanceCost + monthlyInsuranceAndCompliance + monthlyTelematicsCost;
  const totalMonthlyCost = monthlyCapExDepreciation + totalMonthlyOpex;

  // Revenue & Profit
  const monthlyGrossRevenue = profile.dailyTargetRemittanceGhs * profile.operationalDaysPerMonth;
  const monthlyNetProfit = monthlyGrossRevenue - totalMonthlyCost;
  const profitMarginPercent = monthlyGrossRevenue > 0 ? (monthlyNetProfit / monthlyGrossRevenue) * 100 : 0;

  // Per-KM figures
  const totalCostPerKm = monthlyKm > 0 ? totalMonthlyCost / monthlyKm : 0;
  const fuelCostPerKm = monthlyKm > 0 ? monthlyFuelCost / monthlyKm : 0;
  const maintenanceCostPerKm = monthlyKm > 0 ? monthlyMaintenanceCost / monthlyKm : 0;
  const revenuePerKm = monthlyKm > 0 ? monthlyGrossRevenue / monthlyKm : 0;

  // Life-Cycle totals (usefulLifeMonths)
  const lifeCycleTotalRevenue = monthlyGrossRevenue * profile.usefulLifeMonths;
  const lifeCycleTotalCost = (totalMonthlyOpex * profile.usefulLifeMonths) + netDepreciationTotal;
  const lifeCycleNetProfit = lifeCycleTotalRevenue - lifeCycleTotalCost;
  const roiPercentage = profile.purchasePriceGhs > 0 ? (lifeCycleNetProfit / profile.purchasePriceGhs) * 100 : 0;

  // Payback period (Breakeven months from net monthly contribution: Revenue - OpEx)
  const monthlyOperatingContribution = monthlyGrossRevenue - totalMonthlyOpex;
  const breakevenMonths = monthlyOperatingContribution > 0 ? Math.round(profile.purchasePriceGhs / monthlyOperatingContribution) : 999;

  // Tier classification
  let profitabilityTier: 'EXCELLENT' | 'HEALTHY' | 'MARGINAL' | 'LOSS_MAKING' = 'HEALTHY';
  if (profitMarginPercent >= 40 && roiPercentage >= 65) {
    profitabilityTier = 'EXCELLENT';
  } else if (profitMarginPercent >= 22) {
    profitabilityTier = 'HEALTHY';
  } else if (profitMarginPercent >= 5) {
    profitabilityTier = 'MARGINAL';
  } else {
    profitabilityTier = 'LOSS_MAKING';
  }

  // Actionable tip
  let efficiencyTip = '';
  if (profile.fuelType === 'EV') {
    efficiencyTip = 'Zero oil changes and 75% lower fuel per km. Highest long-term ROI in the fleet.';
  } else if (fuelCostPerKm > 1.3) {
    efficiencyTip = 'Fuel consumption is eating 35%+ of daily revenue. Check oxygen sensors & tire inflation.';
  } else if (breakevenMonths <= 28) {
    efficiencyTip = 'Rapid payback vehicle. Optimal asset for fleet lease-to-own expansion.';
  } else if (profitabilityTier === 'MARGINAL') {
    efficiencyTip = 'High maintenance drag. Consider scheduling scheduled major overhaul or retiring early.';
  } else {
    efficiencyTip = 'Consistent healthy margins with steady driver remittance compliance.';
  }

  return {
    vehicleId: profile.vehicleId,
    plateNumber: profile.plateNumber,
    model: profile.model,
    monthlyCapExDepreciation: Math.round(monthlyCapExDepreciation),
    monthlyFuelCost: Math.round(monthlyFuelCost),
    monthlyMaintenanceCost: Math.round(monthlyMaintenanceCost),
    monthlyInsuranceAndCompliance: Math.round(monthlyInsuranceAndCompliance),
    monthlyTelematicsCost: Math.round(monthlyTelematicsCost),
    totalMonthlyOpex: Math.round(totalMonthlyOpex),
    totalMonthlyCost: Math.round(totalMonthlyCost),
    monthlyGrossRevenue: Math.round(monthlyGrossRevenue),
    monthlyNetProfit: Math.round(monthlyNetProfit),
    profitMarginPercent: Number(profitMarginPercent.toFixed(1)),
    totalCostPerKm: Number(totalCostPerKm.toFixed(2)),
    fuelCostPerKm: Number(fuelCostPerKm.toFixed(2)),
    maintenanceCostPerKm: Number(maintenanceCostPerKm.toFixed(2)),
    revenuePerKm: Number(revenuePerKm.toFixed(2)),
    breakevenMonths,
    lifeCycleTotalCost: Math.round(lifeCycleTotalCost),
    lifeCycleTotalRevenue: Math.round(lifeCycleTotalRevenue),
    lifeCycleNetProfit: Math.round(lifeCycleNetProfit),
    roiPercentage: Number(roiPercentage.toFixed(1)),
    profitabilityTier,
    efficiencyTip,
  };
}

export function getStoredTCOProfiles(): VehicleTCOProfile[] {
  if (typeof window === 'undefined') return DEFAULT_TCO_PROFILES;
  try {
    const saved = localStorage.getItem('byt-tco-profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_TCO_PROFILES;
}

export function saveStoredTCOProfiles(profiles: VehicleTCOProfile[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('byt-tco-profiles', JSON.stringify(profiles));
    window.dispatchEvent(new Event('byt-tco-updated'));
  } catch {}
}
