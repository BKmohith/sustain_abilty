# System Contract & Inter-Laptop Division of Labor
**Project:** Predictive Circular-Resource Grid for a Multi-Building Campus (P2P 2026)  
**Execution Window:** 3 Hours (180 Minutes)  
**Target Git Branches:**
- Laptop 1 (Backend / ML): `branch-ml-engine`
- Laptop 2 (Frontend / UI / Report): `branch-frontend-ui`

---

## 1. High-Level Architectural Contract

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      LAPTOP 1 (Engine)                      │
 │                                                             │
 │  [Raw Datasets] ──► [clean_pipeline.py]                     │
 │                           │                                 │
 │     ┌─────────────────────┴────────────────────┐            │
 │     ▼                                          ▼            │
 │ [train_edge_classifier.py]           [forecast_engine.py]   │
 │     │                                          │            │
 │     ▼                                          ▼            │
 │  waste_events_test_predictions.csv      Root-Cause Engine   │
 │                                                │            │
 │                                                ▼            │
 │                                   artifacts/engine_output.json
 └─────────────────────────────────────────────────┬───────────┘
                                                   │ (Contract File)
                                                   ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     LAPTOP 2 (Product & UI)                 │
 │                                                             │
 │  Schema Interface (`artifacts/engine_output.json`)          │
 │                           │                                 │
 │                           ▼                                 │
 │                 [Dashboard / UI Layer]                      │
 │       ┌───────────────────┼───────────────────┐             │
 │       ▼                   ▼                   ▼             │
 │  Dynamic Sliders     Surge Forecasts     Alerts & Actions   │
 │       │                   │                   │             │
 │       └───────────────────┴───────────────────┘             │
 │                           │                                 │
 │                           ▼                                 │
 │  [Screenshots Package] + [2.5-Min Video] + [3-Page PDF]     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 2. Shared File Contract (`artifacts/engine_output.json`)

Laptop 1 writes to this file; Laptop 2 reads this file directly or stubs against this schema specification.

### JSON Schema Definition

```json
{
  "meta": {
    "generated_at": "ISO-8601 Timestamp string",
    "campus_name": "P2P Synthetic Smart Campus",
    "total_buildings": 8,
    "monitoring_window_days": 120,
    "grid_tariff_inr_per_kwh": 8.00,
    "carbon_factor_kg_per_kwh": 0.70,
    "water_pumping_intensity_kwh_per_kl": 0.85,
    "compost_conversion_ratio": 0.25
  },
  "campus_totals": {
    "active_grid_electricity_kwh": "float",
    "solar_photovoltaic_generation_kwh": "float",
    "water_consumed_litres": "float",
    "organic_waste_diverted_kg": "float",
    "compost_produced_kg": "float (organic_waste_diverted_kg * 0.25)",
    "landfill_waste_prevented_kg": "float",
    "carbon_emissions_avoided_kg": "float",
    "total_utility_cost_savings_inr": "float"
  },
  "buildings": {
    "B01": {
      "id": "B01",
      "name": "Academic Block A",
      "type": "Academic",
      "design_capacity": 1200,
      "floors": 4,
      "has_solar": 1,
      "solar_capacity_kw": 40.0,
      "has_composter": 0,
      "current_status": "online | buffered_sync | offline",
      "buffer_lag_hours": "float",
      "telemetry": {
        "electricity_kwh": "float",
        "water_litres": "float",
        "solar_generation_kwh": "float",
        "footfall": "int"
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": "float",
        "recycled_dry_waste_kg": "float",
        "contamination_pct": "float",
        "landfill_kg": "float"
      },
      "forecast_12h": [
        {
          "step_ahead": "int (1 to 12)",
          "forecast_timestamp": "YYYY-MM-DD HH:MM",
          "predicted_electricity_kwh": "float",
          "predicted_water_litres": "float",
          "is_spike": "boolean",
          "exogenous_driver": "string (e.g. 'Mid-sem Day 3 Theory Exams + High Temp 34C')"
        }
      ]
    }
    // ... B02 through B08
  },
  "edge_classifier_benchmark": {
    "model_name": "Lightweight Optimized Gradient Booster (Edge Quantized)",
    "target_hardware": "Raspberry Pi 4 / ESP32-S3 Dual-Core edge envelope",
    "test_accuracy_pct": "float (MUST BE > 85.0%, e.g. 91.4%)",
    "f1_score_macro": "float (e.g. 0.908)",
    "avg_inference_latency_ms": "float (MUST BE < 2000 ms, e.g. 2.4 ms)",
    "classes": [
      "food_organic",
      "paper_cardboard",
      "plastic",
      "glass",
      "metal",
      "ewaste"
    ],
    "per_class_accuracy": {
      "food_organic": 0.94,
      "plastic": 0.91,
      "paper_cardboard": 0.92,
      "metal": 0.89,
      "glass": 0.86,
      "ewaste": 0.95
    }
  },
  "anomalies_and_attributions": [
    {
      "alert_id": "ALT-101",
      "timestamp": "2026-09-04 22:00",
      "building_id": "B04",
      "building_name": "Engineering Labs & Innovation Centre",
      "severity": "HIGH | MEDIUM | LOW",
      "anomaly_type": "Electricity Surge (+62% above baseline)",
      "observed_value": "184.2 kWh",
      "expected_baseline": "113.7 kWh",
      "root_cause_explanation": "Cross-referenced with calendar: 24-Hour Campus Hackathon + manual log: chiller unit 2 compressor left in override mode.",
      "recommended_action": "1. Reset chiller 2 setpoint to 24°C; 2. Route 25 kWh excess solar battery reserve from B01; 3. Notify facility tech.",
      "estimated_cost_impact_inr": "1,420 INR saved per cycle"
    }
  ],
  "gamified_incentive_loop": [
    {
      "rank": 1,
      "building_id": "B06",
      "building_name": "Girls Hostel",
      "green_credits": 2840,
      "contamination_pct": 4.2,
      "compost_diversion_rate_pct": 91.8,
      "occupant_reward_tier": "Gold Eco-Hostel Tier (Free laundry tokens & mess dessert bonus)",
      "weekly_delta": "+14%"
    }
  ],
  "engineering_envelope": {
    "per_building_hardware_budget_usd": 54.00,
    "hardware_bill_of_materials": [
      {"component": "ESP32-S3 NodeMCU Edge Gateway (Dual Core 240MHz)", "cost_usd": 6.50},
      {"component": "Load Cell + HX711 ADC (Weight sensor)", "cost_usd": 4.20},
      {"component": "Capacitive Dielectric Moisture Probe", "cost_usd": 3.80},
      {"component": "Inductive Proximity Sensor (Metal detection)", "cost_usd": 5.50},
      {"component": "Optical Transmission Photodiode Pair (Transparency)", "cost_usd": 2.50},
      {"component": "Piezoelectric Vibration / Acoustic Sensor", "cost_usd": 3.50},
      {"component": "CT Current Transformer & Pulse Water Flow Meter", "cost_usd": 18.00},
      {"component": "Enclosure, wiring & local flash buffer SD module", "cost_usd": 10.00}
    ],
    "scaling_proof_3_to_30_buildings": "Edge nodes perform local feature extraction, deduplication, and inference. The central server only ingests 1 aggregated telemetry packet per building every 5 minutes (bandwidth < 1.2 KB/min). Total network bandwidth for 30 buildings is < 40 KB/min, requiring zero infrastructure upgrade.",
    "failure_modes": [
      {
        "failure_mode": "Sensor Fouling / Window Dirt Degradation",
        "description": "Optical photodiode windows get covered with food grease and dust over a semester, causing false 'opaque' readings for plastic or glass.",
        "mitigation": "Automated baseline drift detection using daily zero-weight calibration, paired with a monthly custodial lens-wipe prompt triggered by telemetry variance."
      },
      {
        "failure_mode": "Adversarial Gaming of the Green Credit Incentive",
        "description": "Hostel occupants discard heavy bricks or water bottles into smart bins to artificially inflate weight-based recycling credit scores.",
        "mitigation": "Multi-modal cross-sensor verification: weight spikes without matching acoustic impact hardness and metal/plastic dielectric readings are flagged as anomalous and award zero credits."
      }
    ]
  }
}
```

---

## 3. Secondary Output Contract: `artifacts/waste_events_test_predictions.csv`

Laptop 1 outputs this file for benchmark scoring:

| Column | Type | Description |
|---|---|---|
| `event_id` | String | Matches `event_id` from `waste_events_test.xlsx` (e.g., `E00005`) |
| `predicted_class` | String | One of: `food_organic`, `paper_cardboard`, `plastic`, `glass`, `metal`, `ewaste` |
| `confidence` | Float | Probability confidence score (0.0 to 1.0) |
| `inference_ms` | Float | Edge inference execution time in milliseconds (< 2000 ms) |

---

## 4. Laptop-by-Laptop Concrete Task Breakdown

### 💻 Laptop 1 (ML, Data Fusion & Hardware Spec)
1. **Script 1:** `src/clean_and_fuse.py`
   - Normalizes manual log building aliases and converts units (`kL` $\to$ `L`, `units` $\to$ `kWh`, `bags` $\to$ `kg`).
   - Fixes hourly streams: detects dropout gaps, sorts chronologically, deduplicates retries.
2. **Script 2:** `src/train_classifier.py`
   - Trains a `RandomForestClassifier` or `HistGradientBoostingClassifier` on `waste_events_train.xlsx`.
   - Reaches **>85% accuracy** and logs the evaluation metrics.
   - Evaluates `waste_events_test.xlsx` and exports `artifacts/waste_events_test_predictions.csv`.
3. **Script 3:** `src/forecast_and_attribute.py`
   - Trains 6–12h ahead regressor on `hourly_streams.xlsx` + `calendar.xlsx`.
   - Generates root-cause attribution matching events and notes.
   - Outputs the final `artifacts/engine_output.json`.
4. **Report Section Contributions:**
   - Prepares technical text for Hardware BOM, Scaling proof, and the 2 Failure Modes.

---

### 💻 Laptop 2 (UI Dashboard, Video Walkthrough & Report Lead)
1. **Dashboard Setup:** `app.py` (Streamlit)
   - Loads [`mock_engine_output.json`](file:///c:/Users/mohit/sustain_abilty/mock_engine_output.json) immediately.
   - Tab 1: **Campus Circular Grid Overview** (Live circular flow: solar sharing, composting 4:1 recalculation slider).
   - Tab 2: **Building Deep Dive & 6–12h Forecast Surge** (Plotly graph showing actual vs predicted spikes).
   - Tab 3: **Edge Smart-Bin Classifier Studio** (Displays accuracy >85%, latency <2s, and live test stream feed).
   - Tab 4: **Explainable Anomaly & Root-Cause Actions** (Alert cards with clear "Why" and "Action").
   - Tab 5: **Gamified Green Credit Leaderboard** (Hostel rankings, contamination penalties).
2. **Integration:**
   - Pulls Laptop 1's branch and switches from `mock_engine_output.json` to `artifacts/engine_output.json`.
3. **Deliverables:**
   - Saves 5 high-res UI screenshots to `screenshots/`.
   - Records the **2.5-minute video walkthrough** with a live screen demo.
   - Compiles the **Standardized 3-Page Report (PDF)**.
