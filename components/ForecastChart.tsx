"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Calendar,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  Download,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ForecastDay } from "../types/solar";

interface ForecastChartProps {
  forecast: ForecastDay[];
  onExportCsv: () => void;
}

export function ForecastChart({ forecast, onExportCsv }: ForecastChartProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const selectedDay = forecast[selectedDayIndex] || forecast[0];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Sunny":
      case "Clear":
        return <Sun size={18} className="goldText" />;
      case "Partly Cloudy":
        return <CloudSun size={18} className="amberText" />;
      case "Cloudy":
      case "Overcast":
        return <Cloud size={18} className="slateText" />;
      default:
        return <CloudSun size={18} className="goldText" />;
    }
  };

  return (
    <div className="card forecastCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <Calendar size={18} className="goldText" />
            <h3 className="cardHeading">7-Day Meteorological Generation Forecast</h3>
          </div>
          <p className="cardDescription">
            Continuous dynamic projection based on expected weather systems, cloud index, and temperature shifts.
          </p>
        </div>

        <button className="iconActionBtn" onClick={onExportCsv} title="Download 7-Day CSV">
          <Download size={15} />
          <span>Export Forecast CSV</span>
        </button>
      </div>

      {/* 7-Day Cards Bar */}
      <div className="forecastDaysGrid">
        {forecast.map((item, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <div
              key={item.day}
              className={`forecastDayPill ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <div className="dayPillHeader">
                <span className="dayPillName">{item.day}</span>
                <span className="dayPillDate">{item.date}</span>
              </div>
              <div className="dayPillIcon">{getWeatherIcon(item.condition)}</div>
              <div className="dayPillEnergy">
                <strong>{item.energyKwh}</strong>
                <small>kWh</small>
              </div>
              <div className="dayPillMeta">
                <span>{item.temp}°C</span>
                <span>{item.cloud}% cld</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart visualization */}
      <div className="chartWrapper" style={{ height: 260, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              unit=" kWh"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ForecastDay;
                  return (
                    <div className="customTooltip">
                      <div className="tooltipTime">{label} ({item.date})</div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#f59e0b" }} />
                        <span>Predicted Output:</span>
                        <strong>{item.energyKwh} kWh</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#38bdf8" }} />
                        <span>Peak Capacity:</span>
                        <strong>{item.peakKw} kW</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#10b981" }} />
                        <span>Condition:</span>
                        <strong>{item.condition} ({item.temp}°C)</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="energyKwh" radius={[6, 6, 0, 0]}>
              {forecast.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={selectedDayIndex === idx ? "#f59e0b" : "#b45309"}
                  opacity={selectedDayIndex === idx ? 1.0 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Day Insight Callout */}
      <div className="forecastSelectedCallout">
        <div className="calloutBadge">
          <Sparkles size={14} />
          <span>Day Insight: {selectedDay.day} ({selectedDay.date})</span>
        </div>
        <p className="calloutText">
          Expected production of <strong>{selectedDay.energyKwh} kWh</strong> with peak AC rating at <strong>{selectedDay.peakKw} kW</strong>.{" "}
          Atmosphere condition is characterized as <strong>{selectedDay.condition}</strong> with {selectedDay.cloud}% cloud cover and {selectedDay.sunHours} peak sun hours.
        </p>
      </div>
    </div>
  );
}
