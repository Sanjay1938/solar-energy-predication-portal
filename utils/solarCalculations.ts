import {
  SolarInputParams,
  PredictionResult,
  HourlyDataPoint,
  ForecastDay,
  SeasonalMonth,
  LossItem,
  FinancialSummary,
} from "../types/solar";

export const SYSTEM_PRESETS: Record<string, Partial<SolarInputParams>> = {
  "Residential 6kW": {
    capacity: 6,
    efficiency: 21.5,
    irradiance: 850,
    temperature: 28,
    cloudCover: 20,
    peakSunHours: 5.5,
    tiltAngle: 28,
    azimuthAngle: 180,
    systemLosses: 14,
    tariffRate: 0.18,
    installCostPerWatt: 2.2,
  },
  "Commercial 50kW": {
    capacity: 50,
    efficiency: 22.0,
    irradiance: 890,
    temperature: 30,
    cloudCover: 15,
    peakSunHours: 5.8,
    tiltAngle: 20,
    azimuthAngle: 180,
    systemLosses: 12,
    tariffRate: 0.15,
    installCostPerWatt: 1.6,
  },
  "Industrial 200kW": {
    capacity: 200,
    efficiency: 22.4,
    irradiance: 920,
    temperature: 32,
    cloudCover: 10,
    peakSunHours: 6.0,
    tiltAngle: 15,
    azimuthAngle: 180,
    systemLosses: 11,
    tariffRate: 0.13,
    installCostPerWatt: 1.25,
  },
  "Utility Scale 2.5MW": {
    capacity: 2500,
    efficiency: 23.0,
    irradiance: 950,
    temperature: 34,
    cloudCover: 10,
    peakSunHours: 6.2,
    tiltAngle: 30,
    azimuthAngle: 180,
    systemLosses: 9.5,
    tariffRate: 0.08,
    installCostPerWatt: 0.95,
  },
};

export function calculateSolarPrediction(params: SolarInputParams): PredictionResult {
  const {
    capacity,
    efficiency,
    irradiance,
    temperature,
    cloudCover,
    peakSunHours,
    tiltAngle,
    azimuthAngle,
    systemLosses,
    tariffRate,
    installCostPerWatt,
  } = params;

  // 1. Temperature derating factor
  // Cell temperature estimation under irradiance: T_cell = T_amb + (NOCT - 20)/800 * G
  const cellTemp = temperature + (45 - 20) * (irradiance / 800);
  const tempCoeff = -0.0038; // -0.38% per degree above 25°C
  const tempDerate = Math.max(0.65, Math.min(1.08, 1 + tempCoeff * (cellTemp - 25)));

  // 2. Cloud attenuation factor (direct beam attenuation + diffuse sky retention)
  const cloudFraction = cloudCover / 100;
  const cloudFactor = Math.max(0.18, 1 - Math.pow(cloudFraction, 1.1) * 0.74);

  // 3. Tilt & Azimuth optical geometry factor
  // Optimal tilt is typically ~30° facing true South (180°) in northern hemisphere
  const tiltDeviation = Math.abs(tiltAngle - 30);
  const tiltEfficiency = Math.max(0.85, 1 - 0.00015 * Math.pow(tiltDeviation, 2));

  const azimuthDeviation = Math.abs(azimuthAngle - 180);
  const azimuthEfficiency = Math.max(0.78, Math.cos((azimuthDeviation * Math.PI) / 360));

  const orientationFactor = tiltEfficiency * azimuthEfficiency;

  // 4. Irradiance normalization relative to standard test condition (1000 W/m²)
  const irrFactor = Math.max(0.1, Math.min(1.3, irradiance / 1000));

  // 5. System loss derating factor (inverter, soiling, AC wiring, mismatch)
  const systemDerate = Math.max(0.7, 1 - systemLosses / 100);

  // 6. Panel module efficiency factor normalized to baseline 20%
  const panelEfficiencyFactor = efficiency / 20.0;

  // 7. Base Daily Output (kWh)
  // Physics formula: Energy = Capacity_kW * PeakSunHours * factors
  const dailyKwh = Math.max(
    0.1,
    capacity *
      peakSunHours *
      panelEfficiencyFactor *
      irrFactor *
      tempDerate *
      cloudFactor *
      orientationFactor *
      systemDerate
  );

  const monthlyKwh = dailyKwh * 30.41;
  const annualKwh = dailyKwh * 365.25;

  // Capacity factor: Daily energy / (Capacity * 24 hours) * 100%
  const capacityFactor = Math.min(100, (dailyKwh / (capacity * 24)) * 100);

  // Performance ratio (PR): Actual output / (Theoretical STC rating * in-plane irradiance)
  const theoreticalOutput = capacity * peakSunHours * (irradiance / 1000);
  const performanceRatio = theoreticalOutput > 0 ? Math.min(95, Math.max(45, (dailyKwh / theoreticalOutput) * 100)) : 75;

  // Peak hourly AC output (typically occurring at solar noon)
  const peakHourlyKw = Math.min(
    capacity * 1.05,
    (dailyKwh / Math.max(2.5, peakSunHours)) * 1.45
  );

  // 8. 24-Hour Diurnal Curve Simulation
  const hourlyData: HourlyDataPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const hourLabel = `${h.toString().padStart(2, "0")}:00`;
    let sunElevation = 0;
    let powerOutput = 0;
    let hourlyIrr = 0;

    // Daylight window roughly 6am to 19pm
    if (h >= 6 && h <= 18) {
      const sunPhase = (h - 6) / 12; // 0 to 1
      const sinTheta = Math.sin(sunPhase * Math.PI);
      sunElevation = Math.max(0, Math.round(sinTheta * 72)); // peak sun elevation ~72 deg

      const bellCurve = Math.pow(sinTheta, 1.4);
      hourlyIrr = Math.round(irradiance * bellCurve * (0.95 + 0.1 * Math.sin(h)));
      powerOutput = Number((peakHourlyKw * bellCurve * cloudFactor * tempDerate).toFixed(2));
    }

    hourlyData.push({
      hour: hourLabel,
      hourNumber: h,
      solarIrradiance: hourlyIrr,
      powerOutput: Math.max(0, powerOutput),
      sunElevation,
    });
  }

  // 9. 7-Day Dynamic Forecast with realistic meteorological variability
  type ForecastCondition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Overcast" | "Clear";
  const weatherVariations: { day: string; cloudShift: number; irrFactor: number; condition: ForecastCondition }[] = [
    { day: "Today", cloudShift: 0, irrFactor: 1.0, condition: cloudCover > 50 ? "Cloudy" : "Sunny" },
    { day: "Tomorrow", cloudShift: -5, irrFactor: 1.04, condition: "Sunny" },
    { day: "Day +2", cloudShift: 15, irrFactor: 0.92, condition: "Partly Cloudy" },
    { day: "Day +3", cloudShift: -10, irrFactor: 1.08, condition: "Clear" },
    { day: "Day +4", cloudShift: 30, irrFactor: 0.81, condition: "Overcast" },
    { day: "Day +5", cloudShift: 5, irrFactor: 0.98, condition: "Partly Cloudy" },
    { day: "Day +6", cloudShift: -8, irrFactor: 1.05, condition: "Sunny" },
  ];

  const now = new Date();
  const forecast: ForecastDay[] = weatherVariations.map((item, index) => {
    const fDate = new Date();
    fDate.setDate(now.getDate() + index);
    const dateStr = fDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayCloud = Math.min(100, Math.max(0, cloudCover + item.cloudShift));
    const dayEnergy = Number((dailyKwh * item.irrFactor * (1 - (item.cloudShift / 200))).toFixed(1));
    const dayPeak = Number((peakHourlyKw * item.irrFactor).toFixed(1));

    return {
      day: item.day,
      date: dateStr,
      condition: item.condition,
      energyKwh: dayEnergy,
      peakKw: dayPeak,
      sunHours: Number((peakSunHours * item.irrFactor).toFixed(1)),
      temp: Math.round(temperature + (index % 2 === 0 ? 1 : -1) * (index * 0.8)),
      cloud: dayCloud,
    };
  });

  // 10. 12-Month Seasonal Yield Projection
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Solar irradiance seasonal curve (Northern Hemisphere peak in Jun/Jul)
  const seasonalFactors = [0.72, 0.81, 0.96, 1.08, 1.18, 1.24, 1.22, 1.15, 1.02, 0.88, 0.76, 0.69];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const seasonal: SeasonalMonth[] = months.map((m, i) => {
    const factor = seasonalFactors[i];
    const mDaily = Number((dailyKwh * factor).toFixed(1));
    const mTotal = Number((mDaily * daysInMonth[i]).toFixed(0));
    return {
      month: m,
      dailyAvgKwh: mDaily,
      monthlyTotalKwh: mTotal,
      sunHours: Number((peakSunHours * factor).toFixed(1)),
    };
  });

  // 11. Loss Waterfall Breakdown
  const rawTheoreticalEnergy = capacity * peakSunHours * (irradiance / 1000);
  const tempLossEnergy = rawTheoreticalEnergy * Math.max(0, 1 - tempDerate);
  const cloudLossEnergy = rawTheoreticalEnergy * Math.max(0, 1 - cloudFactor);
  const angleLossEnergy = rawTheoreticalEnergy * Math.max(0, 1 - orientationFactor);
  const systemLossEnergy = rawTheoreticalEnergy * (systemLosses / 100);

  const lossBreakdown: LossItem[] = [
    {
      name: "Ambient Temperature Derating",
      lossPct: Number(((1 - tempDerate) * 100).toFixed(1)),
      energyLossKwh: Number(tempLossEnergy.toFixed(1)),
      color: "#f87171",
    },
    {
      name: "Cloud & Atmospheric Scattering",
      lossPct: Number(((1 - cloudFactor) * 100).toFixed(1)),
      energyLossKwh: Number(cloudLossEnergy.toFixed(1)),
      color: "#94a3b8",
    },
    {
      name: "Tilt & Azimuth Angle Losses",
      lossPct: Number(((1 - orientationFactor) * 100).toFixed(1)),
      energyLossKwh: Number(angleLossEnergy.toFixed(1)),
      color: "#fb923c",
    },
    {
      name: "Inverter, Soiling & Cabling",
      lossPct: Number(systemLosses.toFixed(1)),
      energyLossKwh: Number(systemLossEnergy.toFixed(1)),
      color: "#eab308",
    },
  ];

  // 12. Financial and ESG Impact
  const dailySavings = dailyKwh * tariffRate;
  const monthlySavings = monthlyKwh * tariffRate;
  const annualSavings = annualKwh * tariffRate;
  const systemCost = capacity * 1000 * installCostPerWatt;
  const paybackYears = annualSavings > 0 ? Number((systemCost / annualSavings).toFixed(1)) : 0;
  const tenYearSavings = annualSavings * 10 - systemCost;

  // Environmental equivalencies:
  // 0.708 kg CO2 per kWh grid emissions factor
  const co2AvoidedAnnualKg = Number((annualKwh * 0.708).toFixed(0));
  // 1 mature tree absorbs ~21.77 kg CO2 / year
  const treesEquivalent = Math.round(co2AvoidedAnnualKg / 21.77);
  // Average passenger vehicle emits ~0.404 kg CO2 per mile
  const carMilesOffset = Math.round(co2AvoidedAnnualKg / 0.404);

  const financials: FinancialSummary = {
    dailySavings: Number(dailySavings.toFixed(2)),
    monthlySavings: Number(monthlySavings.toFixed(2)),
    annualSavings: Number(annualSavings.toFixed(2)),
    systemCost: Number(systemCost.toFixed(0)),
    paybackYears,
    tenYearSavings: Number(tenYearSavings.toFixed(0)),
    co2AvoidedAnnualKg,
    treesEquivalent,
    carMilesOffset,
  };

  return {
    dailyKwh: Number(dailyKwh.toFixed(2)),
    monthlyKwh: Number(monthlyKwh.toFixed(1)),
    annualKwh: Number(annualKwh.toFixed(0)),
    capacityFactor: Number(capacityFactor.toFixed(1)),
    performanceRatio: Number(performanceRatio.toFixed(1)),
    peakHourlyKw: Number(peakHourlyKw.toFixed(2)),
    hourlyData,
    forecast,
    seasonal,
    lossBreakdown,
    financials,
  };
}
