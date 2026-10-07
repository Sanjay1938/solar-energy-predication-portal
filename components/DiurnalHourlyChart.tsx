"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Sun, Clock, Zap, Info } from "lucide-react";
import { HourlyDataPoint } from "../types/solar";

interface DiurnalHourlyChartProps {
  data: HourlyDataPoint[];
  capacity: number;
}

export function DiurnalHourlyChart({ data, capacity }: DiurnalHourlyChartProps) {
  const [metricMode, setMetricMode] = useState<"power" | "both">("both");

  // Find peak hour
  const peakPoint = [...data].sort((a, b) => b.powerOutput - a.powerOutput)[0];

  return (
    <div className="card chartCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <Sun size={18} className="goldText" />
            <h3 className="cardHeading">24-Hour Diurnal Generation Curve</h3>
          </div>
          <p className="cardDescription">
            Simulated hourly AC power production tracking diurnal solar path and atmospheric conditions.
          </p>
        </div>

        <div className="chartActions">
          <div className="peakBadge">
            <Clock size={13} />
            <span>Peak at {peakPoint?.hour || "12:00"}: <strong>{peakPoint?.powerOutput || 0} kW</strong></span>
          </div>

          <div className="togglePills">
            <button
              className={`togglePill ${metricMode === "power" ? "active" : ""}`}
              onClick={() => setMetricMode("power")}
            >
              Power (kW)
            </button>
            <button
              className={`togglePill ${metricMode === "both" ? "active" : ""}`}
              onClick={() => setMetricMode("both")}
            >
              Power & Irradiance
            </button>
          </div>
        </div>
      </div>

      <div className="chartWrapper" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="solarPowerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.65} />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="irrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />

            <XAxis
              dataKey="hour"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              unit=" kW"
              tick={{ fontSize: 11 }}
            />
            {metricMode === "both" && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#38bdf8"
                tickLine={false}
                axisLine={false}
                unit=" W/m²"
                tick={{ fontSize: 11 }}
              />
            )}

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as HourlyDataPoint;
                  return (
                    <div className="customTooltip">
                      <div className="tooltipTime">
                        <Clock size={12} /> {label}
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#f59e0b" }} />
                        <span>AC Power Output:</span>
                        <strong>{item.powerOutput} kW</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#38bdf8" }} />
                        <span>Solar Irradiance:</span>
                        <strong>{item.solarIrradiance} W/m²</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#a855f7" }} />
                        <span>Sun Elevation:</span>
                        <strong>{item.sunElevation}° above horizon</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="powerOutput"
              name="Power Output (kW)"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#solarPowerGrad)"
            />

            {metricMode === "both" && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="solarIrradiance"
                name="Irradiance (W/m²)"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#irrGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chartFooterNote">
        <Info size={14} />
        <span>
          Bell-shaped diurnal model calculates sun trajectory, angle of incidence on {capacity} kW array, and inverter conversion.
        </span>
      </div>
    </div>
  );
}
