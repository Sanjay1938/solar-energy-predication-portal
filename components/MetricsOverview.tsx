"use client";

import React from "react";
import { Zap, TrendingUp, Gauge, DollarSign, ArrowUpRight, Activity } from "lucide-react";
import { PredictionResult, SolarInputParams } from "../types/solar";

interface MetricsOverviewProps {
  prediction: PredictionResult;
  params: SolarInputParams;
}

export function MetricsOverview({ prediction, params }: MetricsOverviewProps) {
  const { dailyKwh, monthlyKwh, annualKwh, capacityFactor, performanceRatio, peakHourlyKw, financials } = prediction;

  const annualMwh = (annualKwh / 1000).toFixed(2);

  return (
    <div className="metricsGrid">
      {/* 1. Daily Output */}
      <div className="metricCard highlight">
        <div className="metricCardTop">
          <div className="metricIconBox goldGlow">
            <Zap size={20} />
          </div>
          <span className="metricPill active">
            <Activity size={12} /> Peak {peakHourlyKw} kW
          </span>
        </div>
        <div className="metricValueRow">
          <span className="metricNumber">{dailyKwh.toLocaleString()}</span>
          <span className="metricUnit">kWh / day</span>
        </div>
        <div className="metricFooter">
          <span>Est. 24h Generation</span>
          <span className="metricSubInfo">{(dailyKwh / params.capacity).toFixed(2)} kWh/kWp</span>
        </div>
      </div>

      {/* 2. Monthly & Annual Projection */}
      <div className="metricCard">
        <div className="metricCardTop">
          <div className="metricIconBox blueGlow">
            <TrendingUp size={20} />
          </div>
          <span className="metricPill">30-Day Window</span>
        </div>
        <div className="metricValueRow">
          <span className="metricNumber">{monthlyKwh.toLocaleString()}</span>
          <span className="metricUnit">kWh / mo</span>
        </div>
        <div className="metricFooter">
          <span>Annual Projection</span>
          <span className="metricSubInfo textHighlight">{annualMwh} MWh / yr</span>
        </div>
      </div>

      {/* 3. System Efficiency & PR */}
      <div className="metricCard">
        <div className="metricCardTop">
          <div className="metricIconBox greenGlow">
            <Gauge size={20} />
          </div>
          <span className="metricPill greenTag">
            CF {capacityFactor}%
          </span>
        </div>
        <div className="metricValueRow">
          <span className="metricNumber">{performanceRatio}%</span>
          <span className="metricUnit">PR Ratio</span>
        </div>
        <div className="metricFooter">
          <span>Performance Ratio</span>
          <span className="metricSubInfo">
            {performanceRatio >= 80 ? "Optimal Efficiency" : performanceRatio >= 70 ? "Normal Range" : "De-rated"}
          </span>
        </div>
      </div>

      {/* 4. Financial Savings */}
      <div className="metricCard">
        <div className="metricCardTop">
          <div className="metricIconBox amberGlow">
            <DollarSign size={20} />
          </div>
          <span className="metricPill amberTag">
            ROI {financials.paybackYears} yrs
          </span>
        </div>
        <div className="metricValueRow">
          <span className="metricNumber">${financials.annualSavings.toLocaleString()}</span>
          <span className="metricUnit">/ year</span>
        </div>
        <div className="metricFooter">
          <span>Est. Cost Savings</span>
          <span className="metricSubInfo textHighlight">${financials.monthlySavings}/mo</span>
        </div>
      </div>
    </div>
  );
}
