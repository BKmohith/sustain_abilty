# Problem Statement Analysis: Predictive Circular-Resource Grid for a Multi-Building Campus

## 1. High-Level Context: What is Being Asked?

The challenge is titled **"Predictive Circular-Resource Grid for a Multi-Building Campus"** under the **Prompt-to-Product (P2P 2026)** benchmark.

### The Real-World Operational Pain Point
* **Current State:** Campus facility teams conduct slow, manual, building-by-building audits that lag real-time consumption by days or weeks. When electricity or water spikes occur, facilities teams have no visibility into *why* (exam week? a dining hall rush? an undetected pipe leak? an HVAC chiller fault?). Waste segregation is largely unmonitored until it hits the landfill dump.
* **The Target Objective:** Design and prototype an **end-to-end, edge-resilient AI system** that unifies waste, water, and power into a single predictive circular loop. It must run cost-effectively on edge hardware, predict surges 6–12 hours ahead, identify root causes with explainable actions, and motivate campus occupants to actively reduce waste.

### The Competition Paradigm: "Prompt to Product"
This is not an isolated Kaggle-style ML competition where you only submit an accuracy score. The deliverables explicitly ask for:
1. **Prompt Workbook:** Iteration logs documenting tools used, prompt iterations, and verified public chat share links.
2. **Standardized 3-Page Report (PDF):** System architecture, data handling strategy, and UI screenshots.
3. **2.5-Minute Video Walkthrough:** Continuous screen recording demonstrating live UI dynamic recalculations across campus buildings and prompt tool execution.
4. **UI Screenshots Package:** High-resolution captures of the operational telemetry dashboard, circular waste allocations, and facility alerts.
5. *(Optional)* **Test Stream Predictions:** Automated predictions file (`waste_events_test_predictions.csv` with `event_id` and `predicted_class`).

---

## 2. Deconstructing What is Given in the Dataset

The organizers provided a synthetic yet **heavily engineered operational benchmark** spanning **120 days (June 20 to October 17, 2026)** across **8 buildings** (`B01` to `B08`).

### Core Relational Tables & Hidden Traps

| File | Rows | Schema & Role | The Realities & Traps Planted in the Data |
|---|---|---|---|
| `buildings.xlsx` | 8 | Structural metadata: building type (Hostels, Food Court, Labs, Academic), floor count, area ($m^2$), design capacity, solar presence & kW rating, composter presence. | Different buildings have different circular capabilities (e.g., only Food Court and Hostels have composters; only B01, B04, and B07 have rooftop solar). Cross-building resource balancing is required. |
| `calendar.xlsx` | 120 | Daily academic schedule: `day_type` (working, semester break, weekend, exam, holiday), scheduled campus events (hackathons, exams, fests, orientations), and meteorological feeds (`avg_temp_c`, `rainfall_mm`, `humidity_pct`). | Events are qualitative text strings (e.g., *"24-hour campus hackathon (high lab power & mess footfall)"*). Weather and campus schedule are the exogenous root-cause drivers for HVAC, water, and waste surges. |
| `daily_summary.xlsx` | 960 | Ground-truth daily macroscopic resource ledger: occupancy, grid electricity, water, solar, segregated waste mass (wet, dry, e-waste, hazardous), composted mass, recycled mass, contamination %, and landfill mass. | Acts as the ground-truth macro benchmark. Shows whether circular diversion (composting 4:1 conversion ratio, recycling) is actually keeping waste out of landfills. |
| `hourly_streams.xlsx` | 23,192 | Time-series telemetry: `timestamp`, `received_at`, `building_id`, `electricity_kwh`, `water_litres`, `solar_generation_kwh`, `footfall`. | **Key Trap 1:** Ingestion lag & burst buffering (`delay_hrs` ranges from 1 hour up to **12+ hours**). Buildings go offline, buffer locally, and dump bursts out of chronological order.<br>**Key Trap 2:** Sporadic null readings (~69 missing readings across telemetry channels). |
| `manual_logs.xlsx` | 415 | Field records logged by 9 roles (wardens, technicians, supervisors, volunteers) with fields `building`, `stream`, `value`, `unit`, `note`. | **Key Trap 1 — Alias Chaos:** Over 37 variations of building names (e.g., `'Girls hostle'`, `'GH'`, `'B06'`, `'Eng Labs'`, `'FC'`, `'Canteen'`).<br>**Key Trap 2 — Unit Inconsistency:** `kWh` vs `units`, `L` vs `kL` (1,000L), `kg` vs `bags` (~8kg).<br>**Key Trap 3 — Unstructured Notes:** Freeform text describing pump failures, leakages, and fest preps. |
| `waste_events_train.xlsx` | 6,314 | Multi-sensor smart-bin disposal events with ground-truth `category`: `weight_g`, `moisture_pct`, `metal_signal`, `transparency`, `acoustic_hardness`. | **6 Classes:** `food_organic`, `plastic`, `paper_cardboard`, `metal`, `ewaste`, `glass`.<br>**Key Trap:** Physical sensor noise and missing values (~120 null readings across physical sensors) simulating sensor dropouts in the field. |
| `waste_events_test.xlsx` | 1,601 | Unlabelled active field disposal events across smart bins. | Same 5 physical continuous sensors without the ground truth label. Represents the live stream for edge inference. |

---

## 3. Brainstorming the 8 Mandatory Constraints

The problem statement requires satisfying **all 8 constraints simultaneously**:

### 1. Multi-Modal Sensor Fusion under Asynchronous Noise
* **The Core Requirement:** Unify 3 radically different data rhythms:
  1. High-frequency physical sensor signals (smart-bin events happening in seconds).
  2. Hourly IoT telemetry (power, water, footfall arriving with up to 12-hour delays).
  3. Sporadic, unstructured human logs (written in text with spelling errors and mixed units).
* **The Challenge:** How to merge continuous time-series with discrete human text logs without discarding buildings that temporarily go offline. The dashboard must maintain state estimation and reconcile cleanly when the burst arrives.

### 2. Real-Time Edge Classification (>85% Accuracy, <2 sec, Constrained Hardware)
* **The Core Requirement:** The smart bin must identify what was just thrown in (food, plastic, paper, metal, glass, e-waste) instantly.
* **The Challenge:** 
  * Cannot rely on heavy cloud GPUs or costly Vision LLM APIs for every piece of trash (violates the latency (<2s) and budget constraints).
  * Relies on 5 continuous physical sensor readings (`weight_g`, `moisture_pct`, `metal_signal`, `transparency`, `acoustic_hardness`).
  * Models must be lightweight enough to run on microcontrollers/edge processors (e.g., Raspberry Pi / ESP32 envelope) and handle missing sensor readings without crashing.

### 3. Short-Horizon Forecasting (6–12 Hours Ahead), Not Just Monitoring
* **The Core Requirement:** Predict spikes *before* they occur (e.g., predicting dinner rush in the Food Court, power draw in the lab complex before a hackathon or midsem practical, or water spikes in hostels).
* **The Challenge:**
  * Naive lag models (ARIMA or moving averages) fail when events or weather shift abruptly.
  * Must correlate **calendar events** + **weather** (temp/humidity) + **historical turnstile footfall** to forecast the next 6–12 hours.
  * Must explicitly justify the **compute vs. accuracy trade-off** for edge deployment.

### 4. Intermittent Connectivity & Data Integrity (Offline Resilience)
* **The Core Requirement:** Buildings frequently drop offline for 2 to 12 hours.
* **The Challenge:**
  * When a building reconnects and pushes 10 hours of buffered readings at once out of chronological order, the system must ingest them without double-counting, overwriting newer state, or corrupting aggregate historical statistics.
  * Deduplication and timestamp alignment (`timestamp` vs `received_at`) must be deterministic.

### 5. Root-Cause Attribution & Explainable Action Recommendations
* **The Core Requirement:** Avoid a "dumb dashboard" that only renders lines when metrics exceed a threshold.
* **The Challenge:** 
  * The system must answer: **Why did it spike, who is responsible, and what should facilities do right now?**
  * *Example:* If B04 power spikes at 2 AM, the system must cross-reference `calendar.xlsx` ("24-hour campus hackathon") and `manual_logs.xlsx` ("chiller servicing") to state: *"Anomaly attributed to overnight hackathon computing load and unoptimized HVAC. Action recommendation: Divert excess solar reserve from B01, adjust HVAC setpoint to 24°C, estimated saving: Rs. 1,400."*

### 6. Behavioural + Economic Incentive Loop (Closing the Circular Loop)
* **The Core Requirement:** Technology alone doesn't reduce waste; human behavior does. The prompt demands a closed-loop mechanism (gamification, green credits, inter-hostel leaderboards, dynamic tariff pricing).
* **The Challenge:**
  * Must define concrete measurement metrics (e.g., tracking `contamination_pct` reduction, ratio of `composted_kg` vs `landfill_kg`, per-capita footfall electricity reduction).
  * Feedback loops must be visible and actionable for students, mess workers, and facility admins.

### 7. Cost & Scale Envelope ($ Budget & 3 to 30+ Buildings)
* **The Core Requirement:** Provide a realistic engineering bill of materials (BOM) per building and an architectural scaling proof.
* **The Challenge:**
  * Formulate and justify a hardware budget per building (sensors: inductive probe, load cell, optical diode, piezo sensor; edge compute: ESP32 / Raspberry Pi gateway; sub-meters).
  * Show why the architecture scales from 8 to 30 buildings without exponential cloud costs or gateway bandwidth bottlenecks (decentralized edge preprocessing vs. centralized lightweight aggregation).

### 8. Failure-Mode Awareness & Mitigations
* **The Core Requirement:** Engineering honesty — identify at least two realistic failure modes and propose concrete mitigations:
  1. *Sensor drift / fouling:* Grease/dirt coating the optical transparency photodiode or moisture probe in food bins over a semester.
  2. *Gaming the incentive system:* Students throwing heavy weights/stones into recycling bins to harvest "weight-based green points".
  3. *Model degradation:* Post-exam vacation periods causing forecasting models trained on regular academic weeks to mispredict baseline loads.

---

## 4. End-to-End System Conceptual Architecture

```
                                    INPUT STREAMS
  [Edge Smart Bins]               [Hourly Telemetry]              [Field Manual Logs]
  - 5 Physical Sensors            - Power, Water, Solar, Footfall - Varied units (kL, bags, units)
  - Missing/Noisy readings        - 1-12hr gateway delay/dropouts - Human aliases ("Girls hostle")
          │                               │                               │
          └───────────────────────┬───────┴───────────────────────────────┘
                                  ▼
                   ┌──────────────────────────────┐
                   │    DATA RECONCILIATION &     │
                   │     MULTI-MODAL FUSION       │
                   └──────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  EDGE INFERENCE  │    │ 6-12HR SURGE     │    │ ROOT-CAUSE       │
│  6-Class Waste   │    │ FORECASTING      │    │ ATTRIBUTION      │
│  (>85%, <2 sec)  │    │ (Weather+Events) │    │ (Why + Actions)  │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                   ┌──────────────────────────────┐
                   │   CIRCULAR RESOURCE GRID &   │
                   │    INTERACTIVE DASHBOARD     │
                   │ - Composting & Solar routing │
                   │ - Gamified Incentive Nudges  │
                   │ - Hardware Budget & Scale    │
                   └──────────────────────────────┘
```

---

## 5. Engineering Baselines & Constants Defined by the Benchmark

* **Grid Carbon Emission Factor:** 0.70 kg $CO_2$ per kWh.
* **Commercial Utility Electricity Tariff:** Rs. 8.00 per kWh.
* **Water Pumping & Treatment Energy Intensity:** 0.85 kWh per 1,000 L.
* **Composting Diversion Potential:** Diverted wet organic waste yields high-grade compost at an average 4:1 conversion ratio by mass.
