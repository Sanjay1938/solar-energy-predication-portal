"use client";

import React from "react";
import { Sun, Download, Sparkles, FileText, Share2, Layers } from "lucide-react";

interface NavbarProps {
  activePreset: string;
  onSelectPreset: (presetName: string) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onPrintReport: () => void;
}

export function Navbar({
  activePreset,
  onSelectPreset,
  onExportCsv,
  onExportJson,
  onPrintReport,
}: NavbarProps) {
  const presets = [
    { id: "Residential 6kW", label: "Residential 6 kW" },
    { id: "Commercial 50kW", label: "Commercial 50 kW" },
    { id: "Industrial 200kW", label: "Industrial 200 kW" },
    { id: "Utility Scale 2.5MW", label: "Utility 2.5 MW" },
  ];

  return (
    <header className="topNav">
      <div className="navContainer">
        <div className="brandGroup">
          <div className="logoOrb">
            <Sun className="solarIcon" size={24} />
          </div>
          <div>
            <div className="brandTitle">
              <span>SOLAR</span>PREDICT
              <span className="badgePro">PRO v2.4</span>
            </div>
            <p className="brandSubtitle">Physics-Informed Photovoltaic Analytics & Intelligence</p>
          </div>
        </div>

        {/* Presets in header */}
        <div className="presetBar">
          <span className="presetLabel">
            <Layers size={13} /> Presets:
          </span>
          <div className="presetPills">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`presetPill ${activePreset === p.id ? "active" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="navActions">
          <div className="livePill">
            <span className="liveDot" />
            <span>PHYSICS ENGINE ACTIVE</span>
          </div>

          <div className="actionDropdown">
            <button className="navBtn secondary" onClick={onExportCsv} title="Export 7-day and diurnal data to CSV">
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button className="navBtn secondary" onClick={onExportJson} title="Export full scenario JSON data">
              <Share2 size={15} />
              <span>JSON</span>
            </button>
            <button className="navBtn primary" onClick={onPrintReport} title="Print or save PDF report">
              <FileText size={15} />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
