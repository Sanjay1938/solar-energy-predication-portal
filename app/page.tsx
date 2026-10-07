"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Sun,
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  Download,
  Info,
  Layers,
  Activity,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { SolarInputParams, SavedScenario } from "../types/solar";
import { calculateSolarPrediction, SYSTEM_PRESETS } from "../utils/solarCalculations";
import { Navbar } from "../components/Navbar";
import { SystemControls } from "../components/SystemControls";
import { MetricsOverview } from "../components/MetricsOverview";
import { DiurnalHourlyChart } from "../components/DiurnalHourlyChart";
import { ForecastChart } from "../components/ForecastChart";
import { SeasonalChart } from "../components/SeasonalChart";
import { LossWaterfallCard } from "../components/LossWaterfallCard";
import { FinancialRoiCard } from "../components/FinancialRoiCard";
import { ScenarioHistory } from "../components/ScenarioHistory";
import { ReportModal } from "../components/ReportModal";

const DEFAULT_PARAMS: SolarInputParams = {
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
  presetName: "Residential 6kW",
};

export default function Home() {
  const [params, setParams] = useState<SolarInputParams>(DEFAULT_PARAMS);
  const [activePreset, setActivePreset] = useState<string>("Residential 6kW");
  const [history, setHistory] = useState<SavedScenario[]>([]);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("solar_scenarios_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync history to localStorage
  const saveHistoryList = (newList: SavedScenario[]) => {
    setHistory(newList);
    try {
      localStorage.setItem("solar_scenarios_history", JSON.stringify(newList));
    } catch {
      // Ignore
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  // Prediction calculations
  const prediction = useMemo(() => {
    return calculateSolarPrediction(params);
  }, [params]);

  // Handle parameter changes
  const handleParamChange = (updated: Partial<SolarInputParams>) => {
    setParams((prev) => ({ ...prev, ...updated, presetName: "Custom" }));
    setActivePreset("Custom");
  };

  // Handle selecting a preset
  const handleSelectPreset = (presetName: string) => {
    const preset = SYSTEM_PRESETS[presetName];
    if (preset) {
      setParams((prev) => ({ ...prev, ...preset, presetName }));
      setActivePreset(presetName);
      showToast(`Applied preset: ${presetName}`);
    }
  };

  // Save current scenario
  const handleSaveScenario = () => {
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      name: `${params.capacity} kW (${params.irradiance} W/m², ${params.cloudCover}% clouds)`,
      dailyKwh: prediction.dailyKwh,
      annualKwh: prediction.annualKwh,
      annualSavings: prediction.financials.annualSavings,
      co2Kg: prediction.financials.co2AvoidedAnnualKg,
      params: { ...params },
    };

    const updated = [newScenario, ...history].slice(0, 10);
    saveHistoryList(updated);
    showToast("Scenario saved to archive!");
  };

  // Load a scenario
  const handleLoadScenario = (loadedParams: SolarInputParams) => {
    setParams({ ...loadedParams });
    setActivePreset(loadedParams.presetName || "Custom");
    showToast("Scenario restored into active model!");
  };

  // Delete a scenario
  const handleDeleteScenario = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryList(updated);
  };

  // Clear history
  const handleClearHistory = () => {
    saveHistoryList([]);
    showToast("History cleared.");
  };

  // Reset to default
  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setActivePreset("Residential 6kW");
    showToast("Reset parameters to default Residential 6 kW configuration.");
  };

  // Export CSV
  const handleExportCsv = () => {
    const forecastRows = [
      ["--- 7-DAY FORECAST ---"],
      ["Day", "Date", "Condition", "Predicted kWh", "Peak kW", "Sun Hours", "Temperature C", "Cloud Cover %"],
      ...prediction.forecast.map((f) => [
        f.day,
        f.date,
        f.condition,
        f.energyKwh,
        f.peakKw,
        f.sunHours,
        f.temp,
        f.cloud,
      ]),
      [""],
      ["--- 24-HOUR DIURNAL PRODUCTION ---"],
      ["Hour", "Power Output kW", "Solar Irradiance W/m2", "Sun Elevation deg"],
      ...prediction.hourlyData.map((h) => [
        h.hour,
        h.powerOutput,
        h.solarIrradiance,
        h.sunElevation,
      ]),
      [""],
      ["--- 12-MONTH SEASONAL PROJECTION ---"],
      ["Month", "Daily Avg kWh", "Monthly Total kWh", "Sun Hours"],
      ...prediction.seasonal.map((s) => [
        s.month,
        s.dailyAvgKwh,
        s.monthlyTotalKwh,
        s.sunHours,
      ]),
    ];

    const csvContent = forecastRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solar-prediction-${params.capacity}kW-${Date.now()}.csv`;
    link.click();
    showToast("CSV dataset downloaded.");
  };

  // Export JSON
  const handleExportJson = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      parameters: params,
      predictionSummary: {
        dailyKwh: prediction.dailyKwh,
        monthlyKwh: prediction.monthlyKwh,
        annualKwh: prediction.annualKwh,
        capacityFactor: prediction.capacityFactor,
        performanceRatio: prediction.performanceRatio,
        financials: prediction.financials,
      },
      forecast: prediction.forecast,
      seasonal: prediction.seasonal,
      lossBreakdown: prediction.lossBreakdown,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solar-scenario-${params.capacity}kW.json`;
    link.click();
    showToast("JSON scenario exported.");
  };

  return (
    <div className="mainAppContainer">
      <Navbar
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        onPrintReport={() => setIsReportOpen(true)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="toastNotification">
          <Sparkles size={16} className="goldText" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="portalHero">
        <div className="heroInner">
          <div className="heroText">
            <div className="heroBadge">
              <Sparkles size={14} />
              <span>HIGH-FIDELITY PHOTOVOLTAIC PREDICTOR</span>
            </div>
            <h1>
              Solar Generation & <em>Energy Intelligence</em>
            </h1>
            <p>
              Physics-informed mathematical modelling calculating real-time solar irradiance attenuation, NOCT cell
              temperature degradation, atmospheric scattering, and financial ROI yields.
            </p>
          </div>

          <div className="heroStatStrip">
            <div className="heroStatItem">
              <span className="heroStatLabel">Active Array</span>
              <strong className="heroStatVal">{params.capacity} kW DC</strong>
            </div>
            <div className="heroStatDivider" />
            <div className="heroStatItem">
              <span className="heroStatLabel">Irradiance (GHI)</span>
              <strong className="heroStatVal">{params.irradiance} W/m²</strong>
            </div>
            <div className="heroStatDivider" />
            <div className="heroStatItem">
              <span className="heroStatLabel">Cell Temp Derate</span>
              <strong className="heroStatVal">
                {params.temperature > 25 ? `-${((params.temperature - 25) * 0.38).toFixed(1)}%` : "0% (STC)"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <main className="dashboardGridContainer">
        {/* Left Column: Interactive Controls */}
        <SystemControls
          params={params}
          onChange={handleParamChange}
          onSaveScenario={handleSaveScenario}
          onReset={handleReset}
        />

        {/* Right Column: Visualizations & Analytics */}
        <div className="dashboardMainContent">
          {/* Key Metrics */}
          <MetricsOverview prediction={prediction} params={params} />

          {/* Row 1: Diurnal Hourly Curve & 7-Day Forecast */}
          <div className="analyticsTwoCol">
            <DiurnalHourlyChart data={prediction.hourlyData} capacity={params.capacity} />
            <ForecastChart forecast={prediction.forecast} onExportCsv={handleExportCsv} />
          </div>

          {/* Row 2: 12-Month Seasonal Yield & Loss Waterfall */}
          <div className="analyticsTwoCol">
            <SeasonalChart seasonal={prediction.seasonal} annualKwh={prediction.annualKwh} />
            <LossWaterfallCard
              losses={prediction.lossBreakdown}
              performanceRatio={prediction.performanceRatio}
            />
          </div>

          {/* Row 3: Financial ROI & Saved Scenarios Archive */}
          <div className="analyticsTwoCol">
            <FinancialRoiCard financials={prediction.financials} capacity={params.capacity} />
            <ScenarioHistory
              history={history}
              onLoadScenario={handleLoadScenario}
              onDeleteScenario={handleDeleteScenario}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Engineering Footer */}
          <footer className="portalFooter">
            <div className="footerInner">
              <div className="footerInfo">
                <Info size={15} />
                <span>
                  Physical simulation model incorporates Global Horizontal Irradiance (GHI), Nominal Operating Cell
                  Temperature (NOCT: 45°C), optical transposition algorithms, and empirical inverter conversion factors.
                </span>
              </div>
              <div className="footerRight">
                <span>SolarPredict Pro v2.4</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Engineering Feasibility Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        params={params}
        prediction={prediction}
      />
    </div>
  );
}