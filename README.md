# SolarPredict Pro — Solar Energy Prediction Portal

A modern, high-fidelity, physics-informed solar photovoltaic (PV) generation prediction and intelligence platform built with **Next.js 14**, **React 18**, and **Recharts**.

---

## 🌟 Key Features

### 1. Physics-Informed Generation Modeling
- **NOCT Thermal Derating**: Models cell heating based on irradiance ($T_{\text{cell}} = T_{\text{amb}} + \frac{NOCT - 20}{800} \cdot G$) and temperature power coefficient ($\gamma = -0.38\% / ^\circ\text{C}$).
- **Optical Geometry & Transposition**: Models array tilt angle and azimuth alignment relative to true solar noon and local latitude.
- **Atmospheric & Cloud Attenuation**: Separates direct normal and diffuse sky retention.
- **Balance of System (BOS) Losses**: Accounts for inverter conversion efficiency, cabling losses, mismatch, and dust/soiling.

### 2. Comprehensive Visual Analytics
- **24-Hour Diurnal Curve**: Real-time hourly simulation displaying AC power output (kW), solar irradiance ($W/m^2$), and sun elevation angle.
- **7-Day Dynamic Forecast**: Interactive meteorological forecast with weather conditions, day-by-day kWh output, and peak kW ratings.
- **12-Month Seasonal Yield Projection**: Calendar-year solar yield model mapping seasonal solstice and equinox variations.
- **System Derating & Loss Waterfall**: Itemized loss breakdown (Temperature derating, Cloud scattering, Tilt mismatch, System losses) and system Performance Ratio (PR %).

### 3. Financial Economics & ROI
- **Installed CAPEX Modeling**: Turnkey capital cost calculations based on system capacity and $/W install cost.
- **Utility Bill Savings**: Real-time daily, monthly, and annual utility bill offsets with custom grid electricity tariffs.
- **Payback Period**: Simple amortization break-even timeline and 10-year net cash flow projections.

### 4. ESG & Environmental Impact
- Metric tons of $\text{CO}_2$ emissions avoided annually.
- Equivalent carbon absorption in mature trees.
- Gasoline passenger vehicle miles eliminated.

### 5. Scenarios, Comparisons & Data Export
- **One-Click Presets**: Residential (6 kW), Commercial (50 kW), Industrial (200 kW), and Utility Scale (2.5 MW).
- **Scenario Archive**: Save simulation runs, load them back, or compare any two scenarios side-by-side with calculated deltas.
- **Data Export**: Export forecast datasets and diurnal telemetry to CSV and JSON.
- **Engineering Feasibility Report**: Modal view with a printable/PDF-ready technical summary sheet.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

```
solar-energy-prediction-portal/
├── app/
│   ├── globals.css           # Design system tokens, dark obsidian theme, print styles
│   ├── layout.tsx            # HTML layout and metadata
│   └── page.tsx              # Main dashboard application page
├── components/
│   ├── Navbar.tsx            # Header, presets, export actions, and live engine status
│   ├── SystemControls.tsx    # Categorized inputs: PV array, weather, and financial sliders
│   ├── MetricsOverview.tsx   # Top KPI metrics (Daily kWh, monthly/annual yield, PR %, ROI)
│   ├── DiurnalHourlyChart.tsx# 24-hour diurnal power & irradiance curve
│   ├── ForecastChart.tsx     # 7-day weather cards and generation bar charts
│   ├── SeasonalChart.tsx     # 12-month annual yield model
│   ├── LossWaterfallCard.tsx # Loss derating waterfall and system health status
│   ├── FinancialRoiCard.tsx  # CAPEX, payback period, and ESG metrics
│   ├── ScenarioHistory.tsx   # Saved scenarios archive and side-by-side comparison
│   └── ReportModal.tsx       # Printable engineering feasibility report modal
├── types/
│   └── solar.ts              # TypeScript interfaces for simulation parameters and outputs
├── utils/
│   └── solarCalculations.ts  # Physics modeling formulas, presets, and data generators
├── postcss.config.js         # PostCSS configuration
├── package.json
└── tsconfig.json
```

---

## 📜 Physics & Engineering References
- **Standard Test Conditions (STC)**: $1000\text{ W/m}^2$, $25^\circ\text{C}$ cell temperature, AM 1.5 spectrum.
- **Nominal Operating Cell Temperature (NOCT)**: $45^\circ\text{C}$ nominal rating.
- **Emission Factor**: $0.708\text{ kg CO}_2 / \text{kWh}$ displaced from standard grid generation mix.