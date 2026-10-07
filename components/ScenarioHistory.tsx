"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  Play,
  Layers,
  ChevronRight,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";
import { SavedScenario, SolarInputParams } from "../types/solar";

interface ScenarioHistoryProps {
  history: SavedScenario[];
  onLoadScenario: (params: SolarInputParams) => void;
  onDeleteScenario: (id: string) => void;
  onClearHistory: () => void;
}

export function ScenarioHistory({
  history,
  onLoadScenario,
  onDeleteScenario,
  onClearHistory,
}: ScenarioHistoryProps) {
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setComparingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const compareItems = history.filter((item) => comparingIds.includes(item.id));

  return (
    <div className="card historyCard">
      <div className="cardHeaderRow">
        <div>
          <div className="cardTitleWithIcon">
            <History size={18} className="goldText" />
            <h3 className="cardHeading">Scenario Archive & Comparisons</h3>
          </div>
          <p className="cardDescription">
            Saved system runs and meteorological conditions for rapid configuration benchmarking.
          </p>
        </div>

        {history.length > 0 && (
          <button className="clearBtn" onClick={onClearHistory} title="Clear all saved history">
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="emptyHistoryState">
          <BookmarkCheck size={36} className="emptyIcon" />
          <h4>No Saved Scenarios Yet</h4>
          <p>
            Adjust system parameters or weather in the left panel and click <strong>“Save Scenario”</strong> to archive
            configurations here.
          </p>
        </div>
      ) : (
        <div className="historyList">
          {history.map((item) => {
            const isComparing = comparingIds.includes(item.id);
            return (
              <div key={item.id} className={`historyItemRow ${isComparing ? "comparing" : ""}`}>
                <div className="historyItemLeft">
                  <div className="historyBadge">{item.params.capacity} kW</div>
                  <div>
                    <h5 className="historyItemTitle">{item.name}</h5>
                    <div className="historyMetaRow">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{item.params.irradiance} W/m²</span>
                      <span>•</span>
                      <span>{item.params.cloudCover}% clouds</span>
                    </div>
                  </div>
                </div>

                <div className="historyItemRight">
                  <div className="historyMetricsPreview">
                    <div>
                      <strong>{item.dailyKwh} kWh</strong>
                      <small>/ day</small>
                    </div>
                    <div>
                      <strong className="textHighlight">${item.annualSavings}</strong>
                      <small>/ yr</small>
                    </div>
                  </div>

                  <div className="historyActions">
                    <button
                      className={`compareToggleBtn ${isComparing ? "active" : ""}`}
                      onClick={() => toggleCompare(item.id)}
                      title="Select to compare (up to 2)"
                    >
                      Compare
                    </button>
                    <button
                      className="loadBtn"
                      onClick={() => onLoadScenario(item.params)}
                      title="Load into active controls"
                    >
                      <Play size={13} />
                      <span>Load</span>
                    </button>
                    <button
                      className="deleteItemBtn"
                      onClick={() => onDeleteScenario(item.id)}
                      title="Delete scenario"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Drawer / Box if 2 items selected */}
      {compareItems.length === 2 && (
        <div className="compareBox">
          <div className="compareHeader">
            <div className="compareTitle">
              <Layers size={15} className="goldText" />
              <span>Side-by-Side Comparison</span>
            </div>
            <button className="closeCompareBtn" onClick={() => setComparingIds([])}>
              Close
            </button>
          </div>

          <div className="compareGrid">
            <div className="compareCol">
              <h6>{compareItems[0].name}</h6>
              <ul>
                <li>Capacity: <strong>{compareItems[0].params.capacity} kW</strong></li>
                <li>Daily Output: <strong>{compareItems[0].dailyKwh} kWh</strong></li>
                <li>Annual Savings: <strong>${compareItems[0].annualSavings}</strong></li>
                <li>CO₂ Offset: <strong>{(compareItems[0].co2Kg / 1000).toFixed(1)} tons</strong></li>
              </ul>
            </div>

            <div className="compareVs">VS</div>

            <div className="compareCol">
              <h6>{compareItems[1].name}</h6>
              <ul>
                <li>Capacity: <strong>{compareItems[1].params.capacity} kW</strong></li>
                <li>Daily Output: <strong>{compareItems[1].dailyKwh} kWh</strong></li>
                <li>Annual Savings: <strong>${compareItems[1].annualSavings}</strong></li>
                <li>CO₂ Offset: <strong>{(compareItems[1].co2Kg / 1000).toFixed(1)} tons</strong></li>
              </ul>
            </div>
          </div>

          <div className="compareDelta">
            <Sparkles size={14} className="goldText" />
            <span>
              Delta: <strong>{Math.abs(compareItems[0].dailyKwh - compareItems[1].dailyKwh).toFixed(1)} kWh/day</strong> difference (
              {compareItems[0].dailyKwh > compareItems[1].dailyKwh
                ? `${compareItems[0].name} produces +${((compareItems[0].dailyKwh / compareItems[1].dailyKwh - 1) * 100).toFixed(0)}% more`
                : `${compareItems[1].name} produces +${((compareItems[1].dailyKwh / compareItems[0].dailyKwh - 1) * 100).toFixed(0)}% more`}
              )
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
