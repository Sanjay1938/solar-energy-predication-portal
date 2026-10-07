"use client";

import React from "react";
import { AlertCircle, ShieldCheck, ThermometerSun, Cloud, Compass, Cpu } from "lucide-react";
import { LossItem } from "../types/solar";

interface LossWaterfallCardProps {
  losses: LossItem[];
  performanceRatio: number;
}

export function LossWaterfallCard({ losses, performanceRatio }: LossWaterfallCardProps) {
  const getIcon = (name: string) => {
    if (name.includes("Temperature")) return <ThermometerSun size={15} />;
    if (name.includes("Cloud")) return <Cloud size={15} />;
    if (name.includes("Tilt") || name.includes("Angle")) return <Compass size={15} />;
    return <Cpu size={15} />;
  };

  const totalLossPct = losses.reduce((acc, curr) => acc + curr.lossPct, 0).toFixed(1);

  return (
    <div className="card lossCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <AlertCircle size={18} className="amberText" />
            <h3 className="cardHeading">System Derating & Loss Waterfall</h3>
          </div>
          <p className="cardDescription">
            Physics-informed attenuation factors reducing theoretical irradiance to delivered AC energy.
          </p>
        </div>

        <div className="lossTotalPill">
          <span>Net System Losses:</span>
          <strong>~{totalLossPct}%</strong>
        </div>
      </div>

      <div className="lossItemsList">
        {losses.map((item, index) => (
          <div key={index} className="lossItemRow">
            <div className="lossItemLeft">
              <div className="lossIconWrapper" style={{ color: item.color }}>
                {getIcon(item.name)}
              </div>
              <div>
                <span className="lossItemName">{item.name}</span>
                <span className="lossEnergyText">-{item.energyLossKwh} kWh / day dissipated</span>
              </div>
            </div>

            <div className="lossItemRight">
              <div className="lossBarTrack">
                <div
                  className="lossBarFill"
                  style={{
                    width: `${Math.min(100, item.lossPct * 2.5)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="lossPctValue" style={{ color: item.color }}>
                -{item.lossPct}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="lossSummaryBox">
        <div className="prStatusBadge">
          <ShieldCheck size={16} className="greenText" />
          <span>System Performance Ratio (PR): <strong>{performanceRatio}%</strong></span>
        </div>
        <p className="prExplainer">
          {performanceRatio >= 80
            ? "Array is operating at high engineering efficiency with minimal thermal and cabling derating."
            : "Thermal or cloud derating is currently the primary limiting factor for maximum output."}
        </p>
      </div>
    </div>
  );
}
