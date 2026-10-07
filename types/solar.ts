export interface SolarInputParams {
  capacity: number;          // kW DC rating
  efficiency: number;        // % panel efficiency (typically 15-24%)
  irradiance: number;        // W/m² global horizontal irradiance
  temperature: number;       // °C ambient temperature
  cloudCover: number;        // % cloud cover (0-100)
  peakSunHours: number;      // Peak sun hours (1-10)
  tiltAngle: number;         // degrees (0-90)
  azimuthAngle: number;      // degrees (0-360, 180 = south)
  systemLosses: number;      // % total losses (soiling, cabling, inverter: typically 10-18%)
  tariffRate: number;        // $/kWh grid electricity cost
  installCostPerWatt: number;// $/W installed cost for ROI calculation
  presetName?: string;
}

export interface HourlyDataPoint {
  hour: string;
  hourNumber: number;
  solarIrradiance: number;   // W/m²
  powerOutput: number;       // kW
  sunElevation: number;      // degrees above horizon
}

export interface ForecastDay {
  day: string;
  date: string;
  condition: "Sunny" | "Partly Cloudy" | "Cloudy" | "Overcast" | "Clear";
  energyKwh: number;
  peakKw: number;
  sunHours: number;
  temp: number;
  cloud: number;
}

export interface SeasonalMonth {
  month: string;
  dailyAvgKwh: number;
  monthlyTotalKwh: number;
  sunHours: number;
}

export interface FinancialSummary {
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  systemCost: number;
  paybackYears: number;
  tenYearSavings: number;
  co2AvoidedAnnualKg: number;
  treesEquivalent: number;
  carMilesOffset: number;
}

export interface LossItem {
  name: string;
  lossPct: number;
  energyLossKwh: number;
  color: string;
}

export interface PredictionResult {
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  capacityFactor: number;
  performanceRatio: number;
  peakHourlyKw: number;
  hourlyData: HourlyDataPoint[];
  forecast: ForecastDay[];
  seasonal: SeasonalMonth[];
  lossBreakdown: LossItem[];
  financials: FinancialSummary;
}

export interface SavedScenario {
  id: string;
  timestamp: string;
  name: string;
  dailyKwh: number;
  annualKwh: number;
  annualSavings: number;
  co2Kg: number;
  params: SolarInputParams;
}
