"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sun,
  CloudSun,
  DollarSign,
  Compass,
  RotateCcw,
  BookmarkPlus,
  CloudLightning,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SolarInputParams } from "../types/solar";

interface SystemControlsProps {
  params: SolarInputParams;
  onChange: (updated: Partial<SolarInputParams>) => void;
  onSaveScenario: () => void;
  onReset: () => void;
}

export function SystemControls({
  params,
  onChange,
  onSaveScenario,
  onReset,
}: SystemControlsProps) {
  const [activeTab, setActiveTab] = useState<"system" | "weather" | "financial">("system");

  const applyWeatherPreset = (type: string) => {
    switch (type) {
      case "desert":
        onChange({ irradiance: 1050, temperature: 38, cloudCover: 5, peakSunHours: 6.8 });
        break;
      case "temperate":
        onChange({ irradiance: 820, temperature: 21, cloudCover: 25, peakSunHours: 5.2 });
        break;
      case "overcast":
        onChange({ irradiance: 420, temperature: 19, cloudCover: 80, peakSunHours: 3.1 });
        break;
      case "winter":
        onChange({ irradiance: 620, temperature: 10, cloudCover: 20, peakSunHours: 4.0 });
        break;
    }
  };

  return (
    <aside className="controlPanel">
      <div className="panelHeader">
        <div className="panelHeaderTitle">
          <Sliders size={18} className="goldText" />
          <span>System & Weather Inputs</span>
        </div>
        <button onClick={onReset} className="resetBtn" title="Reset to standard defaults">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabSelector">
        <button
          className={`tabItem ${activeTab === "system" ? "active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <Sun size={14} /> System
        </button>
        <button
          className={`tabItem ${activeTab === "weather" ? "active" : ""}`}
          onClick={() => setActiveTab("weather")}
        >
          <CloudSun size={14} /> Weather
        </button>
        <button
          className={`tabItem ${activeTab === "financial" ? "active" : ""}`}
          onClick={() => setActiveTab("financial")}
        >
          <DollarSign size={14} /> Economics
        </button>
      </div>

      <div className="tabContent">
        {activeTab === "system" && (
          <div className="controlGroup">
            <h4 className="groupTitle">Photovoltaic Array</h4>

            <SliderField
              label="System DC Capacity"
              value={params.capacity}
              unit="kW"
              min={1}
              max={500}
              step={0.5}
              help="Nameplate peak direct-current power"
              onChange={(val) => onChange({ capacity: val })}
            />

            <SliderField
              label="Module Efficiency"
              value={params.efficiency}
              unit="%"
              min={12}
              max={26}
              step={0.1}
              help="N-type TopCon or PERC panel rating"
              onChange={(val) => onChange({ efficiency: val })}
            />

            <SliderField
              label="Array Tilt Angle"
              value={params.tiltAngle}
              unit="°"
              min={0}
              max={60}
              step={1}
              help="Incline relative to horizontal plane (30° optimal)"
              onChange={(val) => onChange({ tiltAngle: val })}
            />

            <SliderField
              label="Azimuth Orientation"
              value={params.azimuthAngle}
              unit="°"
              min={90}
              max={270}
              step={5}
              help="Compass heading (180° = True South)"
              onChange={(val) => onChange({ azimuthAngle: val })}
            />

            <SliderField
              label="System Loss Factor"
              value={params.systemLosses}
              unit="%"
              min={5}
              max={25}
              step={0.5}
              help="Inverter losses, cabling, dust and soiling"
              onChange={(val) => onChange({ systemLosses: val })}
            />
          </div>
        )}

        {activeTab === "weather" && (
          <div className="controlGroup">
            <h4 className="groupTitle">Micro-Climate & Atmosphere</h4>

            <div className="weatherPresets">
              <span className="presetPillLabel">Quick Presets:</span>
              <div className="weatherTags">
                <button type="button" onClick={() => applyWeatherPreset("desert")} className="weatherTag">
                  ☀️ Desert Sun
                </button>
                <button type="button" onClick={() => applyWeatherPreset("temperate")} className="weatherTag">
                  ⛅ Mild Spring
                </button>
                <button type="button" onClick={() => applyWeatherPreset("overcast")} className="weatherTag">
                  🌧️ Overcast
                </button>
                <button type="button" onClick={() => applyWeatherPreset("winter")} className="weatherTag">
                  ❄️ Cold Crisp
                </button>
              </div>
            </div>

            <SliderField
              label="Solar Irradiance (GHI)"
              value={params.irradiance}
              unit="W/m²"
              min={150}
              max={1200}
              step={10}
              help="Global Horizontal Irradiance received"
              onChange={(val) => onChange({ irradiance: val })}
            />

            <SliderField
              label="Ambient Temperature"
              value={params.temperature}
              unit="°C"
              min={-10}
              max={50}
              step={1}
              help="PV cells heat above ambient by irradiance"
              onChange={(val) => onChange({ temperature: val })}
            />

            <SliderField
              label="Cloud Cover Fraction"
              value={params.cloudCover}
              unit="%"
              min={0}
              max={100}
              step={1}
              help="Cloud density scattering direct sunbeams"
              onChange={(val) => onChange({ cloudCover: val })}
            />

            <SliderField
              label="Peak Sun Hours"
              value={params.peakSunHours}
              unit="hrs"
              min={1}
              max={9}
              step={0.1}
              help="Equivalent 1000 W/m² peak sun duration"
              onChange={(val) => onChange({ peakSunHours: val })}
            />
          </div>
        )}

        {activeTab === "financial" && (
          <div className="controlGroup">
            <h4 className="groupTitle">Financial Parameters</h4>

            <SliderField
              label="Grid Electricity Tariff"
              value={params.tariffRate}
              unit="$/kWh"
              min={0.04}
              max={0.5}
              step={0.01}
              help="Displaced cost of utility electricity"
              onChange={(val) => onChange({ tariffRate: val })}
            />

            <SliderField
              label="Turnkey Install Cost"
              value={params.installCostPerWatt}
              unit="$/W"
              min={0.8}
              max={3.5}
              step={0.05}
              help="Fully installed capital expenditure (CAPEX)"
              onChange={(val) => onChange({ installCostPerWatt: val })}
            />

            <div className="capexBox">
              <span>Estimated CAPEX:</span>
              <strong>${(params.capacity * 1000 * params.installCostPerWatt).toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="panelFooter">
        <button className="saveScenarioBtn" onClick={onSaveScenario}>
          <BookmarkPlus size={16} />
          <span>Save Scenario</span>
        </button>
      </div>
    </aside>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  help?: string;
  onChange: (val: number) => void;
}

function SliderField({
  label,
  value,
  unit,
  min,
  max,
  step,
  help,
  onChange,
}: SliderFieldProps) {
  return (
    <div className="sliderField">
      <div className="sliderFieldHeader">
        <span className="fieldLabel">{label}</span>
        <div className="fieldValBadge">
          <input
            type="number"
            className="numberInput"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              if (!isNaN(num)) onChange(num);
            }}
          />
          <span className="fieldUnit">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="rangeTrack"
      />

      {help && <span className="fieldHint">{help}</span>}
    </div>
  );
}
