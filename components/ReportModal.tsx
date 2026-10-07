"use client";

import React from "react";
import { X, Printer, Sun, ShieldCheck, Download } from "lucide-react";
import { PredictionResult, SolarInputParams } from "../types/solar";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SolarInputParams;
  prediction: PredictionResult;
}

export function ReportModal({
  isOpen,
  onClose,
  params,
  prediction,
}: ReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="reportModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="reportModalHeader">
          <div className="reportHeaderBrand">
            <Sun className="solarIcon" size={24} />
            <div>
              <h3>Solar Energy Feasibility & Prediction Report</h3>
              <p>Generated on {todayStr} • SolarPredict Pro Engineering Engine</p>
            </div>
          </div>
          <div className="reportHeaderActions">
            <button className="navBtn primary" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button className="iconBtn closeBtn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="reportScrollableBody printableArea">
          {/* Executive Summary */}
          <div className="reportSection">
            <h4 className="reportSectionTitle">1. Executive Summary</h4>
            <p className="reportText">
              This report provides a physics-informed performance and financial yield estimate for a{" "}
              <strong>{params.capacity} kW DC</strong> photovoltaic system operating under localized ambient solar
              irradiance of <strong>{params.irradiance} W/m²</strong> with <strong>{params.peakSunHours} peak sun hours</strong>.
              The simulated array delivers an estimated <strong>{prediction.dailyKwh} kWh/day</strong>, corresponding to an
              annual clean electricity yield of <strong>{(prediction.annualKwh / 1000).toFixed(2)} MWh</strong>.
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div className="reportSection">
            <h4 className="reportSectionTitle">2. Technical System Parameters</h4>
            <table className="reportTable">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Standard Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Photovoltaic Nameplate Capacity</td>
                  <td><strong>{params.capacity} kW</strong></td>
                  <td>DC Rating at STC (1000 W/m², 25°C)</td>
                </tr>
                <tr>
                  <td>Cell Module Efficiency</td>
                  <td><strong>{params.efficiency}%</strong></td>
                  <td>High-efficiency mono-PERC / TOPCon cells</td>
                </tr>
                <tr>
                  <td>Array Tilt Angle</td>
                  <td><strong>{params.tiltAngle}°</strong></td>
                  <td>Optimized for local latitude</td>
                </tr>
                <tr>
                  <td>Azimuth Orientation</td>
                  <td><strong>{params.azimuthAngle}°</strong></td>
                  <td>180° = True South orientation</td>
                </tr>
                <tr>
                  <td>Ambient Air Temperature</td>
                  <td><strong>{params.temperature}°C</strong></td>
                  <td>NOCT thermal derating modeled</td>
                </tr>
                <tr>
                  <td>Global Horizontal Irradiance (GHI)</td>
                  <td><strong>{params.irradiance} W/m²</strong></td>
                  <td>Clear-sky to diffuse solar fraction</td>
                </tr>
                <tr>
                  <td>System Losses & Inverter Derate</td>
                  <td><strong>{params.systemLosses}%</strong></td>
                  <td>Cabling, soiling, and MPPT efficiency</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Performance & Generation Output */}
          <div className="reportSection">
            <h4 className="reportSectionTitle">3. Energy Yield Estimates</h4>
            <div className="reportKpiGrid">
              <div className="reportKpiBox">
                <span>Daily Generation</span>
                <strong>{prediction.dailyKwh} kWh</strong>
                <small>Average 24-hr output</small>
              </div>
              <div className="reportKpiBox">
                <span>30-Day Monthly Output</span>
                <strong>{prediction.monthlyKwh} kWh</strong>
                <small>Calendar month projection</small>
              </div>
              <div className="reportKpiBox">
                <span>Annual Net Yield</span>
                <strong>{(prediction.annualKwh / 1000).toFixed(2)} MWh</strong>
                <small>365-day cumulative yield</small>
              </div>
              <div className="reportKpiBox">
                <span>Performance Ratio (PR)</span>
                <strong>{prediction.performanceRatio}%</strong>
                <small>Theoretical efficiency rating</small>
              </div>
            </div>
          </div>

          {/* Financial ROI & Economics */}
          <div className="reportSection">
            <h4 className="reportSectionTitle">4. Financial Amortization & Economics</h4>
            <table className="reportTable">
              <tbody>
                <tr>
                  <td>Estimated Turnkey Capital Cost (CAPEX)</td>
                  <td><strong>${prediction.financials.systemCost.toLocaleString()}</strong></td>
                </tr>
                <tr>
                  <td>Utility Grid Tariff Offset</td>
                  <td><strong>${params.tariffRate}/kWh</strong></td>
                </tr>
                <tr>
                  <td>Annual Utility Cost Savings</td>
                  <td><strong>${prediction.financials.annualSavings.toLocaleString()} / year</strong></td>
                </tr>
                <tr>
                  <td>Simple Return on Investment (Payback Period)</td>
                  <td><strong>{prediction.financials.paybackYears} Years</strong></td>
                </tr>
                <tr>
                  <td>10-Year Net Projected Financial Return</td>
                  <td><strong>${prediction.financials.tenYearSavings.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Environmental Impact */}
          <div className="reportSection">
            <h4 className="reportSectionTitle">5. Decarbonization & ESG Impact</h4>
            <div className="reportKpiGrid">
              <div className="reportKpiBox">
                <span>CO₂ Avoided</span>
                <strong>{(prediction.financials.co2AvoidedAnnualKg / 1000).toFixed(1)} Tons / yr</strong>
                <small>Grid displacement</small>
              </div>
              <div className="reportKpiBox">
                <span>Forest Carbon Absorption</span>
                <strong>{prediction.financials.treesEquivalent.toLocaleString()} Trees</strong>
                <small>Equivalent seedlings for 10 yrs</small>
              </div>
              <div className="reportKpiBox">
                <span>Vehicle Miles Replaced</span>
                <strong>{prediction.financials.carMilesOffset.toLocaleString()} Miles</strong>
                <small>Gasoline automobile offset</small>
              </div>
            </div>
          </div>

          <div className="reportDisclaimer">
            <p>
              * Disclaimer: Predictions are calculated using physics-informed mathematical models (NOCT thermal derating,
              GHI optical transposition, and atmospheric scattering coefficients). Actual operational performance may vary
              based on real-time microclimate conditions, localized shading, snow/dust accumulation, and hardware degradation over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
