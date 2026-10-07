"use client";

import React from "react";
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
import { CalendarRange, SunMedium, Flame, Snowflake } from "lucide-react";
import { SeasonalMonth } from "../types/solar";

interface SeasonalChartProps {
  seasonal: SeasonalMonth[];
  annualKwh: number;
}

export function SeasonalChart({ seasonal, annualKwh }: SeasonalChartProps) {
  const maxMonth = [...seasonal].sort((a, b) => b.monthlyTotalKwh - a.monthlyTotalKwh)[0];
  const minMonth = [...seasonal].sort((a, b) => a.monthlyTotalKwh - b.monthlyTotalKwh)[0];

  return (
    <div className="card seasonalCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <CalendarRange size={18} className="goldText" />
            <h3 className="cardHeading">12-Month Seasonal Yield Model</h3>
          </div>
          <p className="cardDescription">
            Annual solar irradiance variation based on solar declination angles throughout the calendar year.
          </p>
        </div>

        <div className="annualTotalPill">
          <span>Annual Yield:</span>
          <strong>{(annualKwh / 1000).toFixed(1)} MWh</strong>
        </div>
      </div>

      <div className="chartWrapper" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={seasonal} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="month"
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
                  const item = payload[0].payload as SeasonalMonth;
                  return (
                    <div className="customTooltip">
                      <div className="tooltipTime">{label} Projection</div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#f59e0b" }} />
                        <span>Monthly Total:</span>
                        <strong>{item.monthlyTotalKwh.toLocaleString()} kWh</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#38bdf8" }} />
                        <span>Daily Average:</span>
                        <strong>{item.dailyAvgKwh} kWh / day</strong>
                      </div>
                      <div className="tooltipRow">
                        <span className="tooltipDot" style={{ background: "#a855f7" }} />
                        <span>Peak Sun Hours:</span>
                        <strong>{item.sunHours} hrs</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="monthlyTotalKwh" radius={[6, 6, 0, 0]}>
              {seasonal.map((entry, idx) => (
                <Cell
                  key={`seasonal-${idx}`}
                  fill={
                    entry.month === maxMonth?.month
                      ? "#f59e0b"
                      : entry.month === minMonth?.month
                      ? "#38bdf8"
                      : "#0ea5e9"
                  }
                  opacity={entry.month === maxMonth?.month ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="seasonalStatsRow">
        <div className="seasonalStatItem">
          <Flame size={15} className="goldText" />
          <span>Peak Month:</span>
          <strong>{maxMonth?.month} ({maxMonth?.monthlyTotalKwh.toLocaleString()} kWh)</strong>
        </div>
        <div className="seasonalStatItem">
          <Snowflake size={15} className="blueText" />
          <span>Lowest Month:</span>
          <strong>{minMonth?.month} ({minMonth?.monthlyTotalKwh.toLocaleString()} kWh)</strong>
        </div>
        <div className="seasonalStatItem">
          <SunMedium size={15} className="greenText" />
          <span>Summer/Winter Ratio:</span>
          <strong>
            {minMonth?.monthlyTotalKwh > 0
              ? (maxMonth?.monthlyTotalKwh / minMonth?.monthlyTotalKwh).toFixed(1) + "x"
              : "1.0x"}
          </strong>
        </div>
      </div>
    </div>
  );
}
