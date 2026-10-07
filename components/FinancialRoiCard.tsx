"use client";

import React from "react";
import {
  DollarSign,
  Leaf,
  Trees,
  Car,
  PiggyBank,
  TrendingUp,
  Coins,
  ShieldAlert,
} from "lucide-react";
import { FinancialSummary } from "../types/solar";

interface FinancialRoiCardProps {
  financials: FinancialSummary;
  capacity: number;
}

export function FinancialRoiCard({ financials, capacity }: FinancialRoiCardProps) {
  const {
    dailySavings,
    monthlySavings,
    annualSavings,
    systemCost,
    paybackYears,
    tenYearSavings,
    co2AvoidedAnnualKg,
    treesEquivalent,
    carMilesOffset,
  } = financials;

  const co2Tons = (co2AvoidedAnnualKg / 1000).toFixed(1);

  return (
    <div className="card roiCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <DollarSign size={18} className="goldText" />
            <h3 className="cardHeading">Financial ROI & Environmental Impact</h3>
          </div>
          <p className="cardDescription">
            Estimated capital amortization, utility bill savings, and lifetime decarbonization metrics.
          </p>
        </div>

        <div className="tenYearPill">
          <span>10-Yr Net Profit:</span>
          <strong>${tenYearSavings > 0 ? `+${tenYearSavings.toLocaleString()}` : tenYearSavings.toLocaleString()}</strong>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="roiFinancialGrid">
        <div className="roiStatBox">
          <div className="roiStatIcon greenGlow">
            <Coins size={18} />
          </div>
          <div className="roiStatInfo">
            <span className="roiStatLabel">Estimated CAPEX</span>
            <strong className="roiStatVal">${systemCost.toLocaleString()}</strong>
            <span className="roiStatSub">Installed system cost</span>
          </div>
        </div>

        <div className="roiStatBox">
          <div className="roiStatIcon goldGlow">
            <PiggyBank size={18} />
          </div>
          <div className="roiStatInfo">
            <span className="roiStatLabel">Annual Utility Savings</span>
            <strong className="roiStatVal">${annualSavings.toLocaleString()}</strong>
            <span className="roiStatSub">${monthlySavings}/month average</span>
          </div>
        </div>

        <div className="roiStatBox">
          <div className="roiStatIcon blueGlow">
            <TrendingUp size={18} />
          </div>
          <div className="roiStatInfo">
            <span className="roiStatLabel">Simple Payback</span>
            <strong className="roiStatVal">{paybackYears} Years</strong>
            <span className="roiStatSub">Full break-even timeline</span>
          </div>
        </div>
      </div>

      {/* Environmental ESG Impact */}
      <div className="esgSection">
        <h4 className="esgTitle">
          <Leaf size={15} className="greenText" /> Clean Energy & Decarbonization Footprint
        </h4>

        <div className="esgGrid">
          <div className="esgItem">
            <div className="esgIconWrapper greenBg">
              <Leaf size={16} />
            </div>
            <div>
              <strong className="esgVal">{co2Tons} Metric Tons</strong>
              <span className="esgDesc">CO₂ offset annually</span>
            </div>
          </div>

          <div className="esgItem">
            <div className="esgIconWrapper emeraldBg">
              <Trees size={16} />
            </div>
            <div>
              <strong className="esgVal">{treesEquivalent.toLocaleString()} Trees</strong>
              <span className="esgDesc">Carbon absorption equivalent</span>
            </div>
          </div>

          <div className="esgItem">
            <div className="esgIconWrapper tealBg">
              <Car size={16} />
            </div>
            <div>
              <strong className="esgVal">{carMilesOffset.toLocaleString()} Miles</strong>
              <span className="esgDesc">Gasoline car travel avoided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
