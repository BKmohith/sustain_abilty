// PCRG — Predictive Circular-Resource Grid Dashboard
// Pixel-Perfect Implementation matching Reference Mockup

let state = {
  raw: null,
  activeSidebarTab: 'dashboard', // 'dashboard' | 'buildings' | 'resources' | 'forecasts' | 'reports' | 'incentives' | 'alerts' | 'settings'
  selectedBuildingId: 'B04',
  searchQuery: '',
  sortBy: 'name',
  diversionSliderPct: 75,
  solarRoutingBufferKwh: 35,
  bufferLagSimHours: 0,
  resolvedAlerts: new Set(),
  dataSource: 'mock'
};

let forecastChartInstance = null;
let edgeChartInstance = null;

// Building Metadata Mapping (Badges, Metrics, and Physical Footprint)
const BUILDING_CARDS_META = {
  B01: { tag: 'Academic', tagClass: 'type-academic', img: 'images/b01.jpg', area: '4,800 sq.m', kwh: '620 kWh', kwhDelta: '↓ 10%', water: '9,400 L', waterDelta: '↓ 7%', waste: '72 kg', wasteDelta: '↓ 14%' },
  B02: { tag: 'Academic', tagClass: 'type-academic', img: 'images/b02.jpg', area: '3,600 sq.m', kwh: '580 kWh', kwhDelta: '↓ 11%', water: '8,900 L', waterDelta: '↓ 6%', waste: '68 kg', wasteDelta: '↓ 12%' },
  B03: { tag: 'Research', tagClass: 'type-research', img: 'images/b03.jpg', area: '5,200 sq.m', kwh: '410 kWh', kwhDelta: '↓ 9%', water: '6,200 L', waterDelta: '↓ 5%', waste: '45 kg', wasteDelta: '↓ 10%' },
  B04: { tag: 'Research', tagClass: 'type-research', img: 'images/b04.jpg', area: '6,400 sq.m', kwh: '760 kWh', kwhDelta: '↓ 13%', water: '11,800 L', waterDelta: '↓ 8%', waste: '90 kg', wasteDelta: '↓ 16%' },
  B05: { tag: 'Hostel', tagClass: 'type-hostel', img: 'images/b05.jpg', area: '4,200 sq.m', kwh: '540 kWh', kwhDelta: '↓ 9%', water: '7,600 L', waterDelta: '↓ 6%', waste: '58 kg', wasteDelta: '↓ 11%' },
  B06: { tag: 'Hostel', tagClass: 'type-hostel', img: 'images/b06.jpg', area: '4,200 sq.m', kwh: '520 kWh', kwhDelta: '↓ 10%', water: '7,200 L', waterDelta: '↓ 5%', waste: '52 kg', wasteDelta: '↓ 9%' },
  B07: { tag: 'Food Court', tagClass: 'type-food', img: 'images/b07.jpg', area: '2,800 sq.m', kwh: '680 kWh', kwhDelta: '↓ 12%', water: '9,800 L', waterDelta: '↓ 7%', waste: '120 kg', wasteDelta: '↓ 18%' },
  B08: { tag: 'Sports & Admin', tagClass: 'type-sports', img: 'images/b08.jpg', area: '3,100 sq.m', kwh: '430 kWh', kwhDelta: '↓ 8%', water: '6,900 L', waterDelta: '↓ 6%', waste: '48 kg', wasteDelta: '↓ 10%' }
};

// Dynamic Live Clock & Date Function (Day, DD Mon YYYY • HH:MM:SS AM/PM)
function initLiveClock() {
  function update() {
    const textEl = document.getElementById('live-datetime-text');
    if (!textEl) return;
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[now.getDay()];
    const dateNum = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');

    textEl.innerHTML = `${dayName}, ${dateNum} ${monthName} ${year} &bull; <strong class="tnum" style="color:#ffffff;">${strHours}:${minutes}:${seconds} ${ampm}</strong>`;
  }
  update();
  setInterval(update, 1000);
}

// Dynamic Live Campus Weather Telemetry (Oscillating 28.4°C - 29.2°C, 68% RH, 785 W/m² solar flux)
function initLiveWeather() {
  let weatherCycle = 0;
  const weatherStates = [
    { temp: '28.4°C', cond: '68% RH &bull; 785 W/m²' },
    { temp: '28.7°C', cond: '67% RH &bull; 788 W/m²' },
    { temp: '29.2°C', cond: '68% RH &bull; 785 W/m²' },
    { temp: '28.9°C', cond: '69% RH &bull; 782 W/m²' }
  ];

  function update() {
    const tempEl = document.getElementById('weather-temp-val');
    const condEl = document.getElementById('weather-cond-val');
    if (!tempEl || !condEl) return;

    const current = weatherStates[weatherCycle % weatherStates.length];
    tempEl.innerText = current.temp;
    condEl.innerHTML = current.cond;
    weatherCycle++;
  }
  update();
  setInterval(update, 3500);
}

// Initialize App
async function initApp() {
  initLiveClock();
  initLiveWeather();
  await loadData();
  renderCurrentView();
}

// Ingest Engine Data
async function loadData() {
  if (window.PCRG_ENGINE_DATA) {
    state.raw = window.PCRG_ENGINE_DATA;
    state.dataSource = 'bundled';
  }

  try {
    const res = await fetch('../artifacts/engine_output.json');
    if (res.ok) {
      state.raw = await res.json();
      state.dataSource = 'live';
      return;
    }
  } catch (err) {}

  try {
    const mockRes = await fetch('mock_engine_output.json');
    if (mockRes.ok) {
      state.raw = await mockRes.json();
      state.dataSource = 'mock';
    }
  } catch (err) {
    console.error('Data load error:', err);
  }
}

// Exact Hardware BOM Table according to ₹4,500 / $54 Station Envelope
const BOM_INR_TABLE = [
  { component: 'ESP32-S3 NodeMCU Edge Gateway (Dual Core 240MHz)', inr: 540 },
  { component: 'Load Cell + HX711 ADC (Weight sensor)', inr: 350 },
  { component: 'Capacitive Dielectric Moisture Probe', inr: 315 },
  { component: 'Inductive Proximity Sensor (Metal detection)', inr: 460 },
  { component: 'Optical Transmission Photodiode Pair (Transparency)', inr: 210 },
  { component: 'Piezoelectric Vibration / Acoustic Sensor', inr: 290 },
  { component: 'CT Current Transformer & Pulse Water Flow Meter', inr: 1500 },
  { component: 'Enclosure, wiring & local flash buffer SD module', inr: 835 }
];

// Dynamic Recalculation Formulas
function calculateDerivedMetrics() {
  if (!state.raw) return {};

  const baseTotals = state.raw.campus_totals;
  const meta = state.raw.meta;

  const baseDiverted = baseTotals.organic_waste_diverted_kg;
  const effectiveDiversionRate = state.diversionSliderPct / 75;
  const currentDivertedKg = Math.round(baseDiverted * effectiveDiversionRate);
  const currentCompostKg = Math.round(currentDivertedKg * meta.compost_conversion_ratio);

  const solarBufferKwh = state.solarRoutingBufferKwh;
  const avoidedGridTariff = solarBufferKwh * meta.grid_tariff_inr_per_kwh;

  let extraAlertSavings = 0;
  state.resolvedAlerts.forEach(id => {
    const alert = state.raw.anomalies_and_attributions.find(a => a.alert_id === id);
    if (alert) {
      const match = alert.estimated_cost_impact_inr.match(/\d+[\d,]*/);
      if (match) extraAlertSavings += parseInt(match[0].replace(',', ''), 10);
    }
  });

  // Base monthly savings of ₹2,72,500 with real-time slider and alert execution adjustments
  const baseMonthlySavings = 272500;
  const deltaSavings = Math.round((state.solarRoutingBufferKwh - 35) * 8 * 30 + (state.diversionSliderPct - 75) * 120 + extraAlertSavings);
  const currentSavingsInr = Math.max(100000, baseMonthlySavings + deltaSavings);

  // Dynamic Sustainability Score: Baseline 82/100, increases with sliders and +2 per verified alert execution
  const baseScore = 82;
  const deltaScore = Math.min(100, Math.round(baseScore + (state.diversionSliderPct - 75) * 0.12 + (state.solarRoutingBufferKwh - 35) * 0.08 + state.resolvedAlerts.size * 2));

  return {
    divertedKg: currentDivertedKg,
    compostKg: currentCompostKg,
    savingsInr: currentSavingsInr,
    score: Math.max(50, Math.min(100, deltaScore))
  };
}

// Sidebar Navigation Switcher
window.switchNavTab = function(tabName) {
  state.activeSidebarTab = tabName;
  document.querySelectorAll('.menu-item-link').forEach(link => {
    link.classList.toggle('active', link.dataset.tab === tabName);
  });
  renderCurrentView();
};

// Render Main Canvas based on active sidebar tab
function renderCurrentView() {
  const container = document.getElementById('main-content-viewport');
  if (!container || !state.raw) return;

  if (state.activeSidebarTab === 'dashboard') {
    renderDashboardView(container);
  } else if (state.activeSidebarTab === 'buildings') {
    renderBuildingsView(container);
  } else if (state.activeSidebarTab === 'forecasts') {
    renderForecastsView(container);
  } else if (state.activeSidebarTab === 'resources') {
    renderResourcesView(container);
  } else if (state.activeSidebarTab === 'reports') {
    renderReportsView(container);
  } else if (state.activeSidebarTab === 'incentives') {
    renderIncentivesView(container);
  } else if (state.activeSidebarTab === 'alerts') {
    renderAlertsView(container);
  } else if (state.activeSidebarTab === 'settings') {
    renderSettingsView(container);
  }
}

// VIEW 1: Campus Overview (The Exact Reference Layout)
function renderDashboardView(container) {
  const derived = calculateDerivedMetrics();
  const unresolvedAlertCount = state.raw.anomalies_and_attributions.length - state.resolvedAlerts.size;

  // Update notification badge count in top bar and sidebar
  const notifBadge = document.getElementById('notif-badge-count');
  if (notifBadge) notifBadge.innerText = unresolvedAlertCount;
  const sideBadge = document.getElementById('sidebar-alert-badge');
  if (sideBadge) sideBadge.innerText = unresolvedAlertCount;

  // SVG Sparkline Strings
  const greenSparkline = `
    <svg class="sparkline-svg" viewBox="0 0 80 28" fill="none">
      <path d="M2 20 Q 20 8, 38 18 T 78 4" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;
  const blueSparkline = `
    <svg class="sparkline-svg" viewBox="0 0 80 28" fill="none">
      <path d="M2 18 Q 22 24, 40 14 T 78 8" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;

  // Circular Score Ring Calculations
  const score = derived.score;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  container.innerHTML = `
    <!-- Campus Overview Title -->
    <div class="overview-title-block">
      <h2>Campus Overview</h2>
      <p>Monitor resources, track performance and build a sustainable tomorrow.</p>
    </div>

    <!-- Top 4 Summary Cards Row -->
    <div class="summary-kpi-grid">
      <!-- Card 1: Total Electricity -->
      <div class="kpi-metric-card">
        <div class="kpi-card-top">
          <div class="metric-icon-circle yellow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div class="kpi-title-text">Total Electricity (Today)</div>
            <div class="kpi-big-number tnum">2,480 kWh</div>
          </div>
        </div>
        <div class="kpi-card-bottom">
          <div class="delta-stat positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            12% <span class="delta-vs-text">vs. last week</span>
          </div>
          ${greenSparkline}
        </div>
      </div>

      <!-- Card 2: Total Water -->
      <div class="kpi-metric-card">
        <div class="kpi-card-top">
          <div class="metric-icon-circle blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div>
            <div class="kpi-title-text">Total Water (Today)</div>
            <div class="kpi-big-number tnum">48,200 L</div>
          </div>
        </div>
        <div class="kpi-card-bottom">
          <div class="delta-stat neutral">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            8% <span class="delta-vs-text">vs. last week</span>
          </div>
          ${blueSparkline}
        </div>
      </div>

      <!-- Card 3: Total Waste -->
      <div class="kpi-metric-card">
        <div class="kpi-card-top">
          <div class="metric-icon-circle green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5M11 19h8.2a1.8 1.8 0 0 0 1.57-.88 1.79 1.79 0 0 0 .004-1.78L16.8 9.5M11 5l1.6 2.8M7.2 9.5h9.6"/>
            </svg>
          </div>
          <div>
            <div class="kpi-title-text">Total Waste (Today)</div>
            <div class="kpi-big-number tnum">320 kg</div>
          </div>
        </div>
        <div class="kpi-card-bottom">
          <div class="delta-stat positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            15% <span class="delta-vs-text">vs. last week</span>
          </div>
          ${greenSparkline}
        </div>
      </div>

      <!-- Card 4: Campus Sustainability Score -->
      <div class="kpi-metric-card">
        <div class="kpi-card-top">
          <div class="metric-icon-circle emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            </svg>
          </div>
          <div>
            <div class="kpi-title-text">Campus Sustainability Score</div>
            <div class="kpi-big-number tnum">${score} <span style="font-size:1.1rem; color:#94a3b8; font-weight:normal;">/ 100</span></div>
          </div>
        </div>
        <div class="kpi-card-bottom">
          <div class="delta-stat positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            6% <span class="delta-vs-text">vs. last week</span>
          </div>
          <div class="score-circular-ring">
            <svg>
              <circle cx="22" cy="22" r="${radius}" stroke="#e2e8f0" stroke-width="3.5" fill="none"/>
              <circle cx="22" cy="22" r="${radius}" stroke="#10b981" stroke-width="3.5" fill="none"
                stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round"/>
            </svg>
            <span class="score-pct-text">${score}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Integrated Dynamic Simulation Console (Dynamic Recalculations criteria) -->
    <div class="dynamic-controls-card">
      <div class="controls-banner-top">
        <div class="controls-banner-title">
          <span class="controls-badge-tag">Dynamic Simulator</span>
          <span class="controls-heading-text">Microgrid & Circular What-If Controls</span>
          <span style="font-size:0.82rem; color:var(--text-muted);">&bull; Real-time client-side formulas without dataset mutation</span>
        </div>
        <button class="btn-reset-light" onclick="resetSimulators()">Reset All Sliders</button>
      </div>

      <div class="sliders-3col-grid">
        <!-- Slider 1 -->
        <div class="slider-unit">
          <div class="slider-unit-header">
            <span class="slider-unit-label">Organic Waste Diversion</span>
            <span class="slider-unit-val" id="dash-div-readout">${state.diversionSliderPct}%</span>
          </div>
          <input type="range" class="range-light-slider" min="20" max="100" value="${state.diversionSliderPct}" step="1"
            oninput="updateDiversionSlider(this.value)">
          <div class="slider-unit-hint">4:1 conversion ratio &bull; Diverted: ${(derived.divertedKg / 1000).toFixed(1)}T &bull; Compost: ${(derived.compostKg / 1000).toFixed(2)}T</div>
        </div>

        <!-- Slider 2 -->
        <div class="slider-unit">
          <div class="slider-unit-header">
            <span class="slider-unit-label">Solar Peak Shaving Reserve</span>
            <span class="slider-unit-val" id="dash-solar-readout">${state.solarRoutingBufferKwh} kWh</span>
          </div>
          <input type="range" class="range-light-slider" min="0" max="100" value="${state.solarRoutingBufferKwh}" step="5"
            oninput="updateSolarSlider(this.value)">
          <div class="slider-unit-hint">Clips evening surge on non-solar blocks &bull; Tariff: ₹8.00/kWh</div>
        </div>

        <!-- Slider 3 -->
        <div class="slider-unit">
          <div class="slider-unit-header">
            <span class="slider-unit-label">Gateway Telemetry Lag Sim</span>
            <span class="slider-unit-val" id="dash-lag-readout">${state.bufferLagSimHours.toFixed(1)}h</span>
          </div>
          <input type="range" class="range-light-slider" min="0" max="8" value="${state.bufferLagSimHours}" step="0.5"
            oninput="updateLagSlider(this.value)">
          <div class="slider-unit-hint">Simulates offline building dropouts & deterministic buffer ingestion</div>
        </div>
      </div>
    </div>

    <!-- Buildings Section Header -->
    <div class="buildings-header-bar">
      <div class="buildings-title-group">
        <h3>Buildings</h3>
        <span class="buildings-count-text">8 buildings</span>
      </div>

      <div class="buildings-filter-controls">
        <div class="search-input-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search buildings..." value="${state.searchQuery}" oninput="filterBuildings(this.value)">
        </div>

        <select class="sort-select-box" onchange="sortBuildings(this.value)">
          <option value="name">Sort by: Name</option>
          <option value="kwh">Sort by: Electricity</option>
          <option value="water">Sort by: Water</option>
          <option value="waste">Sort by: Waste</option>
        </select>
      </div>
    </div>

    <!-- 8 Building Cards 4x2 Responsive Grid -->
    <div class="buildings-photogrid" id="buildings-photogrid-container">
      ${renderBuildingPhotoCardsHtml()}
    </div>
  `;
}

// Generate the 8 Photo Building Cards exactly as shown in screenshot
function renderBuildingPhotoCardsHtml() {
  const buildings = Object.values(state.raw.buildings);
  
  // Filter by search query
  let filtered = buildings.filter(b => 
    b.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
    b.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Sorting
  if (state.sortBy === 'name') {
    filtered.sort((a, b) => a.id.localeCompare(b.id));
  } else if (state.sortBy === 'kwh') {
    filtered.sort((a, b) => b.telemetry.electricity_kwh - a.telemetry.electricity_kwh);
  } else if (state.sortBy === 'water') {
    filtered.sort((a, b) => b.telemetry.water_litres - a.telemetry.water_litres);
  } else if (state.sortBy === 'waste') {
    filtered.sort((a, b) => b.circular_metrics.diverted_wet_waste_kg - a.circular_metrics.diverted_wet_waste_kg);
  }

  let html = '';
  filtered.forEach(bld => {
    const meta = BUILDING_CARDS_META[bld.id] || {
      tag: bld.type,
      tagClass: 'type-academic',
      img: 'images/b01.jpg',
      kwh: `${Math.round(bld.telemetry.electricity_kwh)} kWh`,
      kwhDelta: '↓ 10%',
      water: `${bld.telemetry.water_litres.toLocaleString()} L`,
      waterDelta: '↓ 7%',
      waste: `${Math.round(bld.circular_metrics.diverted_wet_waste_kg)} kg`,
      wasteDelta: '↓ 12%'
    };

    html += `
      <div class="building-photo-card" id="card-${bld.id}">
        <div class="card-photo-wrapper">
          <img src="${meta.img}" alt="${bld.name}">
          <span class="photo-type-badge ${meta.tagClass}">${meta.tag}</span>
        </div>

        <div class="card-body-content">
          <div>
            <div class="card-title-row">
              <span class="bld-name-strong" title="${bld.id} ${bld.name}">${bld.id} ${bld.name}</span>
              <span class="bld-status-online-dot">Online</span>
            </div>
            <div class="bld-type-subtext">${bld.type}</div>
          </div>

          <div class="card-metrics-triplet">
            <div class="triplet-item">
              <span class="triplet-val">⚡ ${meta.kwh}</span>
              <span class="triplet-delta">${meta.kwhDelta}</span>
            </div>
            <div class="triplet-item">
              <span class="triplet-val">💧 ${meta.water}</span>
              <span class="triplet-delta">${meta.waterDelta}</span>
            </div>
            <div class="triplet-item">
              <span class="triplet-val">♻ ${meta.waste}</span>
              <span class="triplet-delta">${meta.wasteDelta}</span>
            </div>
          </div>

          <a class="card-link-bottom" onclick="inspectBuildingDetails('${bld.id}')">
            View Details &rarr;
          </a>
        </div>
      </div>
    `;
  });

  return html;
}

// Search and Sort Event Handlers
window.filterBuildings = function(q) {
  state.searchQuery = q;
  const grid = document.getElementById('buildings-photogrid-container');
  if (grid) grid.innerHTML = renderBuildingPhotoCardsHtml();
};

window.sortBuildings = function(sortKey) {
  state.sortBy = sortKey;
  const grid = document.getElementById('buildings-photogrid-container');
  if (grid) grid.innerHTML = renderBuildingPhotoCardsHtml();
};

// Slider Change Handlers
window.updateDiversionSlider = function(val) {
  state.diversionSliderPct = parseInt(val, 10);
  const readout = document.getElementById('dash-div-readout');
  if (readout) readout.innerText = `${state.diversionSliderPct}%`;
  renderCurrentView();
};

window.updateSolarSlider = function(val) {
  state.solarRoutingBufferKwh = parseInt(val, 10);
  const readout = document.getElementById('dash-solar-readout');
  if (readout) readout.innerText = `${state.solarRoutingBufferKwh} kWh`;
  renderCurrentView();
};

window.updateLagSlider = function(val) {
  state.bufferLagSimHours = parseFloat(val);
  const readout = document.getElementById('dash-lag-readout');
  if (readout) readout.innerText = `${state.bufferLagSimHours.toFixed(1)}h`;
};

window.resetSimulators = function() {
  state.diversionSliderPct = 75;
  state.solarRoutingBufferKwh = 35;
  state.bufferLagSimHours = 0;
  renderCurrentView();
};

// Inspect Building Details -> Opens Forecasts View focused on that building
window.inspectBuildingDetails = function(bldId) {
  state.selectedBuildingId = bldId;
  switchNavTab('forecasts');
};

window.selectForecastBuilding = function(bldId) {
  state.selectedBuildingId = bldId;
  renderCurrentView();
};

// TAB 2: Buildings (Dedicated Full-Width Facilities Directory with Deep Metadata)
function renderBuildingsView(container) {
  const buildings = Object.values(state.raw.buildings);

  // Filter & sort
  let filtered = buildings.filter(b => 
    b.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
    b.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  if (state.sortBy === 'name') {
    filtered.sort((a, b) => a.id.localeCompare(b.id));
  } else if (state.sortBy === 'kwh') {
    filtered.sort((a, b) => b.telemetry.electricity_kwh - a.telemetry.electricity_kwh);
  } else if (state.sortBy === 'water') {
    filtered.sort((a, b) => b.telemetry.water_litres - a.telemetry.water_litres);
  } else if (state.sortBy === 'waste') {
    filtered.sort((a, b) => b.circular_metrics.diverted_wet_waste_kg - a.circular_metrics.diverted_wet_waste_kg);
  }

  let html = `
    <div class="overview-title-block" style="margin-bottom:16px;">
      <h2>Campus Facilities Directory & Asset Intelligence</h2>
      <p>Dedicated full-width physical infrastructure directory across 8 facilities with live telemetry & circular resource metrics</p>
    </div>

    <!-- 4 Facility Summary KPI Badges -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px; margin-bottom:24px;">
      <div class="subview-surface-card" style="padding:18px 20px;">
        <div style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase;">Monitored Buildings</div>
        <div style="font-size:1.85rem; font-weight:800; color:#0f172a; margin:4px 0;" class="tnum">8 Facilities</div>
        <div style="font-size:0.78rem; color:#15803d; font-weight:600;">✔ 100% Online & Synced</div>
      </div>
      <div class="subview-surface-card" style="padding:18px 20px;">
        <div style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase;">Total Rooftop Solar PV</div>
        <div style="font-size:1.85rem; font-weight:800; color:#0f766e; margin:4px 0;" class="tnum">185 kWp</div>
        <div style="font-size:0.78rem; color:#0f766e; font-weight:600;">Distributed microgrid arrays</div>
      </div>
      <div class="subview-surface-card" style="padding:18px 20px;">
        <div style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase;">Design Capacity</div>
        <div style="font-size:1.85rem; font-weight:800; color:#1d4ed8; margin:4px 0;" class="tnum">6,450</div>
        <div style="font-size:0.78rem; color:#475569; font-weight:500;">Occupant design envelope</div>
      </div>
      <div class="subview-surface-card" style="padding:18px 20px;">
        <div style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase;">Daily Footfall</div>
        <div style="font-size:1.85rem; font-weight:800; color:#b45309; margin:4px 0;" class="tnum">4,120</div>
        <div style="font-size:0.78rem; color:#b45309; font-weight:600;">Active sensor count</div>
      </div>
    </div>

    <!-- Search and Controls Bar -->
    <div class="buildings-header-bar" style="margin-bottom:20px;">
      <div class="buildings-title-group">
        <h3>Campus Buildings Matrix</h3>
        <span class="buildings-count-text">${filtered.length} facilities displayed</span>
      </div>

      <div class="buildings-filter-controls">
        <div class="search-input-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search facilities..." value="${state.searchQuery}" oninput="filterBuildingsTab(this.value)">
        </div>

        <select class="sort-select-box" onchange="sortBuildingsTab(this.value)">
          <option value="name" ${state.sortBy === 'name' ? 'selected' : ''}>Sort by: Facility ID</option>
          <option value="kwh" ${state.sortBy === 'kwh' ? 'selected' : ''}>Sort by: Electricity</option>
          <option value="water" ${state.sortBy === 'water' ? 'selected' : ''}>Sort by: Water</option>
          <option value="waste" ${state.sortBy === 'waste' ? 'selected' : ''}>Sort by: Waste Diverted</option>
        </select>
      </div>
    </div>

    <!-- 8 Deep-Dive Building Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:22px;">
  `;

  filtered.forEach(bld => {
    const meta = BUILDING_CARDS_META[bld.id] || {
      tag: bld.type,
      tagClass: 'type-academic',
      img: 'images/b01.jpg'
    };

    html += `
      <div class="subview-surface-card" style="padding:0; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="position:relative; width:100%; height:150px; background:#e2e8f0; overflow:hidden;">
          <img src="${meta.img}" alt="${bld.name}" style="width:100%; height:100%; object-fit:cover;">
          <span class="photo-type-badge ${meta.tagClass}" style="position:absolute; top:12px; left:12px;">${bld.type}</span>
          <span style="position:absolute; top:12px; right:12px; background:rgba(15, 23, 42, 0.75); color:#ffffff; padding:4px 10px; border-radius:6px; font-size:0.75rem; font-weight:700; backdrop-filter:blur(4px);">
            ${bld.id}
          </span>
        </div>

        <div style="padding:18px 20px; display:flex; flex-direction:column; gap:14px; flex:1;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;">${bld.name}</h4>
              <span class="bld-status-online-dot">Online</span>
            </div>
            <div style="font-size:0.82rem; color:#475569; margin-top:3px;">
              ${bld.floors} Floors &bull; Area: <strong>${meta.area || '4,200 sq.m'}</strong> &bull; Capacity: ${bld.design_capacity} occupants
            </div>
          </div>

          <!-- Physical Specs Grid -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:0.8rem; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            <div><span style="color:#64748b;">Solar PV:</span> <strong style="color:#0f766e;">${bld.has_solar ? `${bld.solar_capacity_kw} kWp` : 'None'}</strong></div>
            <div><span style="color:#64748b;">Composter:</span> <strong style="color:#15803d;">${bld.has_composter ? '✔ Active (On-Site)' : 'Central Hub'}</strong></div>
            <div><span style="color:#64748b;">Buffer Lag:</span> <strong style="color:#0284c7;">${bld.buffer_lag_hours}h</strong></div>
            <div><span style="color:#64748b;">Footfall:</span> <strong style="color:#0f172a;">${bld.telemetry.footfall}</strong></div>
          </div>

          <!-- Live Telemetry & Circular Resource Readouts -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; padding:10px 0; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">
            <div>
              <div style="font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase;">Electricity</div>
              <div style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-top:2px;">${Math.round(bld.telemetry.electricity_kwh)} kWh</div>
            </div>
            <div>
              <div style="font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase;">Water Flow</div>
              <div style="font-size:0.92rem; font-weight:800; color:#0284c7; margin-top:2px;">${bld.telemetry.water_litres.toLocaleString()} L</div>
            </div>
            <div>
              <div style="font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase;">Organic Divert</div>
              <div style="font-size:0.92rem; font-weight:800; color:#15803d; margin-top:2px;">${Math.round(bld.circular_metrics.diverted_wet_waste_kg)} kg</div>
            </div>
          </div>

          <button class="card-link-bottom" style="width:100%; border:none;" onclick="inspectBuildingDetails('${bld.id}')">
            Deep-Dive 12h Surge Forecast &rarr;
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

window.filterBuildingsTab = function(q) {
  state.searchQuery = q;
  renderCurrentView();
};

window.sortBuildingsTab = function(k) {
  state.sortBy = k;
  renderCurrentView();
};

// TAB 3: 12-Hour Forecasts & Surge Horizon
function renderForecastsView(container) {
  const bld = state.raw.buildings[state.selectedBuildingId] || state.raw.buildings['B01'];

  // Building selector chips HTML
  const buildingChipsHtml = Object.values(state.raw.buildings).map(b => `
    <button class="bld-chip-btn ${b.id === state.selectedBuildingId ? 'active' : ''}"
      onclick="selectForecastBuilding('${b.id}')">
      ${b.id} &bull; ${b.name.split('&')[0].trim()}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="overview-title-block" style="margin-bottom:12px;">
      <h2>12-Hour Surge Forecasts & Exogenous Analytics</h2>
      <p>Short-horizon predictive telemetry correlating campus events, exams, ambient weather & solar peak shaving</p>
    </div>

    <!-- Building Quick-Switcher Chips -->
    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:16px;">
      ${buildingChipsHtml}
    </div>

    <div class="subview-surface-card" style="margin-bottom:20px;">
      <div class="controls-banner-top" style="margin-bottom:16px;">
        <div>
          <span class="controls-heading-text">Solar Peak Shaving Simulation</span>
          <p style="font-size:0.85rem; color:var(--text-muted);">Adjust solar reserve to shave projected demand peaks in real-time</p>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; color:#0d9488;">${state.solarRoutingBufferKwh} kWh Shave</span>
          <input type="range" class="range-light-slider" style="width:200px;" min="0" max="100" value="${state.solarRoutingBufferKwh}" step="5"
            oninput="updateSolarSlider(this.value)">
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main);">
          ${bld.id}: ${bld.name} — 12-Hour Surge Curve
        </h3>
        <div style="display:flex; gap:16px; font-size:0.85rem; font-family:var(--font-mono);">
          <span style="color:#0284c7;">&bull; Baseline Expected</span>
          <span style="color:#ef4444;">&bull; 12h Predicted Surge</span>
          <span style="color:#10b981;">&bull; Solar Shaved Peak</span>
        </div>
      </div>

      <div style="position:relative; width:100%; height:380px;">
        <canvas id="forecastCanvasPCRG"></canvas>
      </div>

      <div style="margin-top:24px;">
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:12px;">Detected Surge Spikes & Exogenous Drivers</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;" id="forecast-spikes-container"></div>
      </div>
    </div>
  `;

  renderForecastChartPCRG(bld);
}

function renderForecastChartPCRG(bld) {
  const ctx = document.getElementById('forecastCanvasPCRG');
  if (!ctx) return;

  const steps = bld.forecast_12h;
  const labels = steps.map(s => `T+${s.step_ahead}h (${s.forecast_timestamp})`);
  const baseline = steps.map(s => Math.round(s.predicted_electricity_kwh * 0.72));
  const predicted = steps.map(s => s.predicted_electricity_kwh);
  
  const clipped = steps.map((s, idx) => {
    if (s.is_spike && state.solarRoutingBufferKwh > 0) {
      return Math.max(baseline[idx], s.predicted_electricity_kwh - state.solarRoutingBufferKwh);
    }
    return s.predicted_electricity_kwh;
  });

  if (forecastChartInstance) forecastChartInstance.destroy();

  forecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Baseline Expected',
          data: baseline,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: '12h Predicted Surge',
          data: predicted,
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          borderDash: [5, 4],
          tension: 0.35,
          borderWidth: 2.2,
          pointRadius: steps.map(s => s.is_spike ? 6 : 3),
          pointBackgroundColor: steps.map(s => s.is_spike ? '#ef4444' : '#fca5a5')
        },
        {
          label: 'Solar Shaved Peak',
          data: clipped,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3.5,
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } }
        }
      }
    }
  });

  const spikesContainer = document.getElementById('forecast-spikes-container');
  if (spikesContainer) {
    const spikes = steps.filter(s => s.is_spike);
    let html = '';
    spikes.forEach(s => {
      html += `
        <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:14px 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:#e11d48;">Step T+${s.step_ahead}h (${s.forecast_timestamp})</span>
            <span style="font-size:0.75rem; font-weight:700; color:#e11d48;">DEMAND SURGE</span>
          </div>
          <div style="font-size:1.15rem; font-weight:800; color:#0f172a;" class="tnum">${s.predicted_electricity_kwh} kWh &bull; ${s.predicted_water_litres} L</div>
          <div style="font-size:0.85rem; color:#475569; margin-top:4px;">Root Driver: <strong>${s.exogenous_driver}</strong></div>
        </div>
      `;
    });
    spikesContainer.innerHTML = html;
  }
}

// VIEW 3: Resources & Edge Classifier Studio
function renderResourcesView(container) {
  const edge = state.raw.edge_classifier_benchmark;
  container.innerHTML = `
    <div class="overview-title-block" style="margin-bottom:12px;">
      <h2>Resource Intelligence & Edge Smart-Bin AI</h2>
      <p>Multi-modal sensor fusion across 5 physical sensors and 6-class waste sorting benchmark</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
      <div class="subview-surface-card">
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:4px;">Edge Hardware Classifier Specifications</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:18px;">Quantized gradient booster executing on edge microcontrollers</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div style="font-size:0.82rem; font-weight:600; color:#64748b; text-transform:uppercase;">Test Accuracy</div>
            <div style="font-size:2rem; font-weight:800; color:#10b981;" class="tnum">${edge.test_accuracy_pct}%</div>
            <div style="font-size:0.78rem; color:#059669;">✔ Target > 85.0%</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div style="font-size:0.82rem; font-weight:600; color:#64748b; text-transform:uppercase;">Edge Latency</div>
            <div style="font-size:2rem; font-weight:800; color:#0284c7;" class="tnum">${edge.avg_inference_latency_ms} ms</div>
            <div style="font-size:0.78rem; color:#0284c7;">✔ Target < 2,000 ms</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div style="font-size:0.82rem; font-weight:600; color:#64748b; text-transform:uppercase;">Macro F1 Score</div>
            <div style="font-size:1.6rem; font-weight:800; color:#7c3aed;" class="tnum">${edge.f1_score_macro}</div>
            <div style="font-size:0.78rem; color:#64748b;">Balanced 6-Class Score</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div style="font-size:0.82rem; font-weight:600; color:#64748b; text-transform:uppercase;">Target Envelope</div>
            <div style="font-size:1.15rem; font-weight:700; color:#0f172a; margin-top:4px;">ESP32-S3 / Pi 4</div>
            <div style="font-size:0.78rem; color:#64748b;">240MHz &bull; 1.4MB RAM</div>
          </div>
        </div>

        <div style="background:#0f172a; border-radius:8px; padding:16px; font-family:var(--font-mono); font-size:0.82rem; color:#38bdf8; line-height:1.6;">
          <div style="color:#fff; font-weight:700; margin-bottom:6px;">[EDGE SENSOR TELEMETRY BUS]</div>
          <div>&bull; Load Cell HX711: weight_g = 248.5g</div>
          <div>&bull; Dielectric Moisture: moisture_pct = 72.4%</div>
          <div>&bull; Inductive Sensor: metal_signal = 0.00</div>
          <div>&bull; Optical Photodiode: transparency = 0.08</div>
          <div>&bull; Piezo Impact: hardness = 12.3</div>
          <div style="color:#34d399; font-weight:700; margin-top:6px;">&gt;&gt; INFERRED: food_organic &bull; Conf: 94.2% &bull; Latency: 2.4ms</div>
        </div>
      </div>

      <div class="subview-surface-card">
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:4px;">6-Class Classification Breakdown</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:18px;">Per-class test set evaluation metrics</p>
        <div style="position:relative; width:100%; height:340px;">
          <canvas id="edgeBarChartPCRG"></canvas>
        </div>
      </div>
    </div>
  `;

  renderEdgeBarChartPCRG();
}

function renderEdgeBarChartPCRG() {
  const ctx = document.getElementById('edgeBarChartPCRG');
  if (!ctx || !state.raw) return;

  const edge = state.raw.edge_classifier_benchmark;
  const labels = edge.classes.map(c => c.replace('_', ' ').toUpperCase());
  const values = edge.classes.map(c => Math.round(edge.per_class_accuracy[c] * 100));

  if (edgeChartInstance) edgeChartInstance.destroy();

  edgeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#10b981',
          '#0284c7',
          '#06b6d4',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444'
        ],
        borderRadius: 6,
        barThickness: 34
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          min: 75,
          max: 100,
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 }, callback: v => `${v}%` }
        }
      }
    }
  });
}

// VIEW 4: Alerts & Root-Cause Actions
function renderAlertsView(container) {
  const alerts = state.raw.anomalies_and_attributions;
  let html = `
    <div class="overview-title-block" style="margin-bottom:16px;">
      <h2>Operational Alerts & Root-Cause Action Triage</h2>
      <p>Correlating consumption anomalies with calendar events, academic exams and field log notes</p>
    </div>
    <div style="display:flex; flex-direction:column; gap:18px;">
  `;

  alerts.forEach(alert => {
    const isMitigated = state.resolvedAlerts.has(alert.alert_id);
    html += `
      <div class="subview-surface-card" style="border-left:5px solid ${alert.severity === 'HIGH' ? '#ef4444' : alert.severity === 'MEDIUM' ? '#f59e0b' : '#0284c7'}; opacity:${isMitigated ? '0.65' : '1'};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:#fff; background:${alert.severity === 'HIGH' ? '#ef4444' : alert.severity === 'MEDIUM' ? '#f59e0b' : '#0284c7'}; padding:3px 8px; border-radius:4px;">
            ${alert.severity} SEVERITY &bull; ${alert.alert_id}
          </span>
          <span style="font-family:var(--font-mono); font-size:0.82rem; color:#64748b;">${alert.timestamp}</span>
        </div>
        <div style="font-size:1.2rem; font-weight:700; color:#0f172a;">${alert.anomaly_type}</div>
        <div style="font-size:0.9rem; color:#0284c7; margin-bottom:14px;">${alert.building_name} (${alert.building_id})</div>

        <div style="display:grid; grid-template-columns:1fr 1.6fr 1.6fr; gap:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px; margin-bottom:16px;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase;">Observed vs Expected</div>
            <p style="font-size:0.92rem; color:#0f172a; margin-top:2px;"><strong>${alert.observed_value}</strong><br><span style="font-size:0.82rem; color:#64748b;">Baseline: ${alert.expected_baseline}</span></p>
          </div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase;">Root-Cause Attribution</div>
            <p style="font-size:0.9rem; color:#334155; margin-top:2px;">${alert.root_cause_explanation}</p>
          </div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase;">Recommended Action</div>
            <p style="font-size:0.9rem; color:#334155; margin-top:2px;">${alert.recommended_action}</p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:var(--font-mono); font-size:0.95rem; font-weight:700; color:#10b981;">
            💰 Impact: ${alert.estimated_cost_impact_inr}
          </span>
          <button style="background:${isMitigated ? '#e2e8f0' : '#10b981'}; color:${isMitigated ? '#64748b' : '#fff'}; border:none; padding:9px 18px; border-radius:6px; font-weight:600; cursor:${isMitigated ? 'default' : 'pointer'};"
            onclick="toggleAlertResolution('${alert.alert_id}')">
            ${isMitigated ? '✔ Action Executed & Verified' : 'Execute Facility Action'}
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

window.toggleAlertResolution = function(id) {
  if (state.resolvedAlerts.has(id)) {
    state.resolvedAlerts.delete(id);
  } else {
    state.resolvedAlerts.add(id);
  }
  renderCurrentView();
};

// VIEW 5: Incentives & Hostel Circular Standings
function renderIncentivesView(container) {
  const ranks = state.raw.gamified_incentive_loop;
  const env = state.raw.engineering_envelope;

  let html = `
    <div class="overview-title-block" style="margin-bottom:16px;">
      <h2>Hostel Circular Incentives & Hardware Envelope</h2>
      <p>Gamified student occupant incentive loop tracking green credits and per-building ₹4,500 budget</p>
    </div>

    <!-- Full-Width Inter-Hostel Circular Standings Card -->
    <div class="subview-surface-card" style="margin-bottom:24px; overflow-x:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="font-size:1.2rem; font-weight:700; color:#0f172a;">Inter-Hostel Circular Standings Leaderboard</h3>
          <p style="font-size:0.85rem; color:#475569; margin-top:2px;">Rankings based on waste diversion volume, contamination penalties, and energy conservation</p>
        </div>
        <span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:700; white-space:nowrap;">
          8 Campus Facilities Active
        </span>
      </div>

      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:2px solid #cbd5e1; font-size:0.8rem; text-transform:uppercase; color:#334155; letter-spacing:0.03em;">
            <th style="padding:12px 14px; width:70px;">Rank</th>
            <th style="padding:12px 14px;">Facility</th>
            <th style="padding:12px 14px; white-space:nowrap;">Green Credits</th>
            <th style="padding:12px 14px; white-space:nowrap;">Contamination</th>
            <th style="padding:12px 14px; white-space:nowrap;">Compost Rate</th>
            <th style="padding:12px 14px; white-space:nowrap;">Weekly Trend</th>
            <th style="padding:12px 14px; white-space:nowrap;">Occupant Reward Tier</th>
          </tr>
        </thead>
        <tbody>
  `;

  ranks.forEach(r => {
    const rankBadgeStyle = r.rank === 1 ? 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;' :
                           r.rank === 2 ? 'background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;' :
                           r.rank === 3 ? 'background:#ffedd5; color:#c2410c; border:1px solid #fed7aa;' :
                           'background:#f8fafc; color:#64748b; border:1px solid #e2e8f0;';

    html += `
      <tr style="border-bottom:1px solid #e2e8f0; font-size:0.9rem;">
        <td style="padding:14px; white-space:nowrap;">
          <span style="${rankBadgeStyle} display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:50%; font-weight:800; font-size:0.85rem;">
            #${r.rank}
          </span>
        </td>
        <td style="padding:14px; color:#0f172a; white-space:nowrap;">
          <strong>${r.building_name}</strong>
          <span style="font-size:0.75rem; color:#64748b; margin-left:4px;">(${r.building_id})</span>
        </td>
        <td style="padding:14px; font-family:var(--font-mono); font-weight:700; color:#b45309; white-space:nowrap;">
          ${r.green_credits.toLocaleString()} pts
        </td>
        <td style="padding:14px; font-weight:700; color:${r.contamination_pct > 6 ? '#dc2626' : '#15803d'}; white-space:nowrap;">
          ${r.contamination_pct}%
        </td>
        <td style="padding:14px; font-weight:700; color:#15803d; white-space:nowrap;">
          ${r.compost_diversion_rate_pct}%
        </td>
        <td style="padding:14px; font-family:var(--font-mono); font-weight:700; color:${r.weekly_delta && r.weekly_delta.startsWith('+') ? '#15803d' : '#dc2626'}; white-space:nowrap;">
          ${r.weekly_delta || '0%'}
        </td>
        <td style="padding:14px; white-space:nowrap;">
          <span style="background:${r.contamination_pct > 6 ? '#fff1f2' : '#ecfdf5'}; color:${r.contamination_pct > 6 ? '#be123c' : '#047857'}; border:1px solid ${r.contamination_pct > 6 ? '#fecdd3' : '#a7f3d0'}; padding:4px 10px; border-radius:4px; font-size:0.75rem; font-weight:600; white-space:nowrap;">
            ${r.occupant_reward_tier}
          </span>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>

    <!-- 2 Balanced Lower Cards: Hardware BOM + Circular Incentive Loop Policy -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
      
      <!-- Hardware BOM Card -->
      <div class="subview-surface-card">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a;">Hardware Bill of Materials (INR ₹)</h3>
            <p style="font-size:0.85rem; color:#475569;">Edge monitoring station BOM capped at ₹4,500 / building</p>
          </div>
          <span style="font-family:var(--font-mono); font-size:0.95rem; font-weight:800; color:#15803d; background:#ecfdf5; border:1px solid #a7f3d0; padding:4px 10px; border-radius:6px;">
            Total: ₹4,500.00
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
  `;

  BOM_INR_TABLE.forEach(item => {
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:0.86rem;">
        <span style="color:#1e293b; font-weight:500;">${item.component}</span>
        <span style="font-family:var(--font-mono); font-weight:700; color:#0f766e; white-space:nowrap;">₹${item.inr.toLocaleString('en-IN')}</span>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- Incentive Policy & Anti-Gaming Verification -->
      <div class="subview-surface-card">
        <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin-bottom:4px;">Occupant Reward Structure & Verification</h3>
        <p style="font-size:0.85rem; color:#475569; margin-bottom:16px;">Gamified behavioral engineering with automated fraud deterrence</p>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <div style="border-left:4px solid #10b981; padding-left:12px;">
            <strong style="font-size:0.9rem; color:#0f172a;">Tier 1: Gold Eco-Hostel (> 2,500 Green Credits)</strong>
            <p style="font-size:0.82rem; color:#475569; margin-top:2px;">Awards free weekend laundry tokens, special dinner mess dessert vouchers, and priority campus gym slots.</p>
          </div>
          <div style="border-left:4px solid #0284c7; padding-left:12px;">
            <strong style="font-size:0.9rem; color:#0f172a;">Tier 2: Silver Circular Hostel (1,800 – 2,500 Credits)</strong>
            <p style="font-size:0.82rem; color:#475569; margin-top:2px;">Qualifies hostel block for energy conservation rebates applied directly toward student club event sponsorships.</p>
          </div>
          <div style="border-left:4px solid #f59e0b; padding-left:12px;">
            <strong style="font-size:0.9rem; color:#0f172a;">Contamination Penalty Threshold (> 6.0%)</strong>
            <p style="font-size:0.82rem; color:#475569; margin-top:2px;">Smart bins deduct 150 green credits per contaminated bag and automatically flag custodial inspection prompts.</p>
          </div>
          <div style="border-left:4px solid #dc2626; padding-left:12px;">
            <strong style="font-size:0.9rem; color:#0f172a;">Anti-Gaming Sensor Fusion Defense</strong>
            <p style="font-size:0.82rem; color:#475569; margin-top:2px;">Prevents adversarial discards (e.g. heavy bricks/water bottles): weight spikes without acoustic impact and dielectric metal/plastic signals award zero credits.</p>
          </div>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

// VIEW 6: Dedicated Institutional Reports (All in Indian Rupees ₹)
function renderReportsView(container) {
  const derived = calculateDerivedMetrics();
  const env = state.raw.engineering_envelope;

  const monthlySavingsInr = derived.savingsInr;
  const annualSavingsInr = monthlySavingsInr * 12;
  const perBuildingBOM = 4500;
  const campusCapexInr = perBuildingBOM * 8; // 8 buildings = ₹36,000

  let html = `
    <div class="overview-title-block" style="margin-bottom:16px;">
      <h2>Campus Sustainability & Institutional Utility Audit Report</h2>
      <p>Certified circular resource accounting, grid tariff arbitrage, and ₹4,500 per-station edge hardware ROI breakdown</p>
    </div>

    <!-- 4 High-Contrast Financial Impact Cards in Rupees -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px; margin-bottom:24px;">
      <div class="subview-surface-card" style="padding:20px;">
        <div style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase;">Monthly Utility Savings</div>
        <div style="font-size:1.85rem; font-weight:800; color:#15803d; margin:6px 0;" class="tnum">₹${monthlySavingsInr.toLocaleString('en-IN')}</div>
        <div style="font-size:0.78rem; color:#15803d; font-weight:600;">✔ Net of tariff arbitrage & circular diversion</div>
      </div>

      <div class="subview-surface-card" style="padding:20px;">
        <div style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase;">Annual Projected Savings</div>
        <div style="font-size:1.85rem; font-weight:800; color:#0f766e; margin:6px 0;" class="tnum">₹${annualSavingsInr.toLocaleString('en-IN')}</div>
        <div style="font-size:0.78rem; color:#0f766e; font-weight:600;">✔ 12-Month run-rate projection</div>
      </div>

      <div class="subview-surface-card" style="padding:20px;">
        <div style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase;">Campus Hardware Capex</div>
        <div style="font-size:1.85rem; font-weight:800; color:#1d4ed8; margin:6px 0;" class="tnum">₹${campusCapexInr.toLocaleString('en-IN')}</div>
        <div style="font-size:0.78rem; color:#475569; font-weight:500;">8 Buildings @ ₹4,500 / station</div>
      </div>

      <div class="subview-surface-card" style="padding:20px;">
        <div style="font-size:0.8rem; font-weight:700; color:#475569; text-transform:uppercase;">Simple Payback Period</div>
        <div style="font-size:1.85rem; font-weight:800; color:#b45309; margin:6px 0;" class="tnum">0.13 Mo</div>
        <div style="font-size:0.78rem; color:#b45309; font-weight:600;">✔ Under 4 days capital recoup</div>
      </div>
    </div>

    <!-- 2 Column Financial Ledger + Hardware BOM in Rupees -->
    <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:24px; margin-bottom:24px;">
      
      <!-- Financial Circularity Ledger -->
      <div class="subview-surface-card">
        <h3 style="font-size:1.2rem; font-weight:700; color:#0f172a; margin-bottom:6px;">Monthly Circular Accounting Ledger</h3>
        <p style="font-size:0.85rem; color:#475569; margin-bottom:16px;">Breakdown of utility avoidance, water recirculation, and organic soil recovery</p>
        
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="border-bottom:2px solid #cbd5e1; font-size:0.8rem; text-transform:uppercase; color:#334155;">
              <th style="padding:10px 12px;">Resource Stream</th>
              <th style="padding:10px 12px;">Monthly Volume</th>
              <th style="padding:10px 12px;">Tariff Rate</th>
              <th style="padding:10px 12px; text-align:right;">Financial Value (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0; font-size:0.9rem;">
              <td style="padding:12px; font-weight:600; color:#0f172a;">⚡ Solar Peak Shaving Avoidance</td>
              <td style="padding:12px; font-family:var(--font-mono); color:#334155;">${state.solarRoutingBufferKwh * 30} kWh</td>
              <td style="padding:12px; color:#475569;">₹ 8.00 / kWh</td>
              <td style="padding:12px; text-align:right; font-family:var(--font-mono); font-weight:700; color:#15803d;">₹${(state.solarRoutingBufferKwh * 30 * 8).toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0; font-size:0.9rem;">
              <td style="padding:12px; font-weight:600; color:#0f172a;">💧 Recirculated Greywater Recovery</td>
              <td style="padding:12px; font-family:var(--font-mono); color:#334155;">124,000 L</td>
              <td style="padding:12px; color:#475569;">₹ 0.085 / L</td>
              <td style="padding:12px; text-align:right; font-family:var(--font-mono); font-weight:700; color:#0369a1;">₹10,540</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0; font-size:0.9rem;">
              <td style="padding:12px; font-weight:600; color:#0f172a;">♻ Organic Compost Certified Soil</td>
              <td style="padding:12px; font-family:var(--font-mono); color:#334155;">${derived.compostKg} kg</td>
              <td style="padding:12px; color:#475569;">₹ 15.00 / kg</td>
              <td style="padding:12px; text-align:right; font-family:var(--font-mono); font-weight:700; color:#0f766e;">₹${(derived.compostKg * 15).toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0; font-size:0.9rem;">
              <td style="padding:12px; font-weight:600; color:#0f172a;">🛡 Anomaly Leak & Tamper Mitigation</td>
              <td style="padding:12px; font-family:var(--font-mono); color:#334155;">3 Active Events</td>
              <td style="padding:12px; color:#475569;">Triaged T+0</td>
              <td style="padding:12px; text-align:right; font-family:var(--font-mono); font-weight:700; color:#b45309;">₹5,800</td>
            </tr>
            <tr style="background:#f8fafc; font-size:0.95rem; font-weight:700;">
              <td colspan="3" style="padding:14px; color:#0f172a;">Total Institutional Net Monthly Return</td>
              <td style="padding:14px; text-align:right; font-family:var(--font-mono); color:#15803d; font-size:1.1rem;">₹${monthlySavingsInr.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Itemized Hardware Bill of Materials (Rupees ₹) -->
      <div class="subview-surface-card">
        <h3 style="font-size:1.2rem; font-weight:700; color:#0f172a; margin-bottom:4px;">Hardware Bill of Materials (INR ₹)</h3>
        <p style="font-size:0.85rem; color:#475569; margin-bottom:14px;">Complete edge sensor station BOM capped strictly at ₹4,500 / building</p>

        <div style="display:flex; flex-direction:column; gap:8px;">
  `;

  BOM_INR_TABLE.forEach(item => {
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:0.85rem;">
        <span style="color:#1e293b; font-weight:500;">${item.component}</span>
        <span style="font-family:var(--font-mono); font-weight:700; color:#0f766e;">₹${item.inr.toLocaleString('en-IN')}</span>
      </div>
    `;
  });

  html += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:6px; font-size:0.92rem; font-weight:700; margin-top:6px;">
            <span style="color:#14532d;">Per-Station Budget Capped</span>
            <span style="font-family:var(--font-mono); color:#15803d; font-size:1.05rem;">₹4,500.00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scaling Proof & Reliability Envelope -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
      <div class="subview-surface-card">
        <h4 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-bottom:8px;">Campus Scaling Proof (3 to 30 Buildings)</h4>
        <p style="font-size:0.88rem; color:#334155; line-height:1.6; margin-bottom:12px;">${env.scaling_proof_3_to_30_buildings}</p>
        <div style="background:#f1f5f9; padding:12px 16px; border-radius:6px; border-left:4px solid #0f766e; font-size:0.85rem; color:#1e293b;">
          <strong>Total 30-Building Capex:</strong> ₹1,35,000 (30 &times; ₹4,500) &bull; Bandwidth consumption: &lt; 40 KB/min
        </div>
      </div>

      <div class="subview-surface-card">
        <h4 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-bottom:8px;">Sensor Fouling & Anti-Gaming Resilience</h4>
        <div style="display:flex; flex-direction:column; gap:12px;">
  `;

  env.failure_modes.forEach(fm => {
    html += `
      <div style="border-left:3px solid #1d4ed8; padding-left:12px;">
        <div style="font-size:0.88rem; font-weight:700; color:#0f172a;">${fm.failure_mode}</div>
        <div style="font-size:0.82rem; color:#475569; margin-top:2px;">${fm.mitigation}</div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// VIEW 6: Settings
function renderSettingsView(container) {
  container.innerHTML = `
    <div class="overview-title-block" style="margin-bottom:16px;">
      <h2>System Settings & Telemetry Protocol</h2>
      <p>Configure MQTT gateway endpoints, polling intervals, and baseline tariff definitions</p>
    </div>
    <div class="subview-surface-card" style="max-width:600px;">
      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; margin-bottom:4px;">Campus Commercial Utility Tariff (INR/kWh)</label>
        <input type="text" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="₹ 8.00 per kWh" readonly>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; margin-bottom:4px;">Grid Carbon Intensity Factor</label>
        <input type="text" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="0.70 kg CO2 / kWh" readonly>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; margin-bottom:4px;">Water Pumping Energy Intensity</label>
        <input type="text" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="0.85 kWh / 1,000 L" readonly>
      </div>
      <div>
        <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; margin-bottom:4px;">Organic Composting Mass Conversion Ratio</label>
        <input type="text" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="4:1 Ratio (0.25)" readonly>
      </div>
    </div>
  `;
}

window.toggleSidebarTheme = function() {
  const sidebar = document.querySelector('.pcrg-sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('dark-mode');
  const isDark = sidebar.classList.contains('dark-mode');
  try {
    localStorage.setItem('pcrg_sidebar_theme', isDark ? 'dark' : 'light');
  } catch (e) {}
};

function applySavedTheme() {
  try {
    const saved = localStorage.getItem('pcrg_sidebar_theme');
    const sidebar = document.querySelector('.pcrg-sidebar');
    if (saved === 'dark' && sidebar) {
      sidebar.classList.add('dark-mode');
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  initApp();
});
