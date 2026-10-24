window.PCRG_ENGINE_DATA = {
  "meta": {
    "generated_at": "2026-10-24T12:00:00Z",
    "campus_name": "P2P Synthetic Smart Campus",
    "total_buildings": 8,
    "monitoring_window_days": 120,
    "grid_tariff_inr_per_kwh": 8.0,
    "carbon_factor_kg_per_kwh": 0.7,
    "water_pumping_intensity_kwh_per_kl": 0.85,
    "compost_conversion_ratio": 0.25
  },
  "campus_totals": {
    "active_grid_electricity_kwh": 482150.0,
    "solar_photovoltaic_generation_kwh": 124800.0,
    "water_consumed_litres": 3840000.0,
    "organic_waste_diverted_kg": 48200.0,
    "compost_produced_kg": 12050.0,
    "landfill_waste_prevented_kg": 61400.0,
    "carbon_emissions_avoided_kg": 87360.0,
    "total_utility_cost_savings_inr": 998400.0
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
      "current_status": "online",
      "buffer_lag_hours": 0.2,
      "telemetry": {
        "electricity_kwh": 142.5,
        "water_litres": 1200.0,
        "solar_generation_kwh": 36.8,
        "footfall": 640
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 85.0,
        "recycled_dry_waste_kg": 120.0,
        "contamination_pct": 6.2,
        "landfill_kg": 24.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 145.0,
          "predicted_water_litres": 1250.0,
          "is_spike": false,
          "exogenous_driver": "Regular Lecture Schedule"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 150.2,
          "predicted_water_litres": 1400.0,
          "is_spike": false,
          "exogenous_driver": "Lunch Break Transition"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 162.8,
          "predicted_water_litres": 1320.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Seminars"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 158.0,
          "predicted_water_litres": 1180.0,
          "is_spike": false,
          "exogenous_driver": "Lab Practical Sessions"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 148.5,
          "predicted_water_litres": 1050.0,
          "is_spike": false,
          "exogenous_driver": "Evening Class Departure"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 130.0,
          "predicted_water_litres": 920.0,
          "is_spike": false,
          "exogenous_driver": "Campus Library Shift"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 110.4,
          "predicted_water_litres": 750.0,
          "is_spike": false,
          "exogenous_driver": "Base Standby Load"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 95.0,
          "predicted_water_litres": 620.0,
          "is_spike": false,
          "exogenous_driver": "Night Security Lighting"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 82.0,
          "predicted_water_litres": 510.0,
          "is_spike": false,
          "exogenous_driver": "Off-peak Night Grid"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 70.0,
          "predicted_water_litres": 450.0,
          "is_spike": false,
          "exogenous_driver": "Base Server Operations"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 65.0,
          "predicted_water_litres": 400.0,
          "is_spike": false,
          "exogenous_driver": "Idle Overnight Baseline"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 60.0,
          "predicted_water_litres": 380.0,
          "is_spike": false,
          "exogenous_driver": "Idle Overnight Baseline"
        }
      ]
    },
    "B02": {
      "id": "B02",
      "name": "Academic Block B",
      "type": "Academic",
      "design_capacity": 1000,
      "floors": 3,
      "has_solar": 0,
      "solar_capacity_kw": 0.0,
      "has_composter": 0,
      "current_status": "buffered_sync",
      "buffer_lag_hours": 3.5,
      "telemetry": {
        "electricity_kwh": 98.4,
        "water_litres": 850.0,
        "solar_generation_kwh": 0.0,
        "footfall": 480
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 60.0,
        "recycled_dry_waste_kg": 95.0,
        "contamination_pct": 8.5,
        "landfill_kg": 32.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 102.0,
          "predicted_water_litres": 900.0,
          "is_spike": false,
          "exogenous_driver": "Midday Lectures"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 95.0,
          "predicted_water_litres": 780.0,
          "is_spike": false,
          "exogenous_driver": "Break Period"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 138.5,
          "predicted_water_litres": 1250.0,
          "is_spike": true,
          "exogenous_driver": "Mid-sem Day 3 Theory Exams + High Temp 34C"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 142.0,
          "predicted_water_litres": 1300.0,
          "is_spike": true,
          "exogenous_driver": "Mid-sem Examination Session 2"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 115.0,
          "predicted_water_litres": 950.0,
          "is_spike": false,
          "exogenous_driver": "Exam Dismissal"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 88.0,
          "predicted_water_litres": 650.0,
          "is_spike": false,
          "exogenous_driver": "Evening Wind-down"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 72.0,
          "predicted_water_litres": 500.0,
          "is_spike": false,
          "exogenous_driver": "Standby Off-peak"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 60.0,
          "predicted_water_litres": 410.0,
          "is_spike": false,
          "exogenous_driver": "Standby Off-peak"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 52.0,
          "predicted_water_litres": 350.0,
          "is_spike": false,
          "exogenous_driver": "Idle"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 48.0,
          "predicted_water_litres": 300.0,
          "is_spike": false,
          "exogenous_driver": "Idle"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 45.0,
          "predicted_water_litres": 280.0,
          "is_spike": false,
          "exogenous_driver": "Night Security"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 42.0,
          "predicted_water_litres": 260.0,
          "is_spike": false,
          "exogenous_driver": "Night Security"
        }
      ]
    },
    "B03": {
      "id": "B03",
      "name": "Central Library",
      "type": "Academic",
      "design_capacity": 800,
      "floors": 3,
      "has_solar": 0,
      "solar_capacity_kw": 0.0,
      "has_composter": 0,
      "current_status": "online",
      "buffer_lag_hours": 0.5,
      "telemetry": {
        "electricity_kwh": 76.2,
        "water_litres": 420.0,
        "solar_generation_kwh": 0.0,
        "footfall": 310
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 35.0,
        "recycled_dry_waste_kg": 145.0,
        "contamination_pct": 3.8,
        "landfill_kg": 15.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 78.0,
          "predicted_water_litres": 430.0,
          "is_spike": false,
          "exogenous_driver": "Quiet Study Hours"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 72.0,
          "predicted_water_litres": 400.0,
          "is_spike": false,
          "exogenous_driver": "Lunch Hours"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 85.0,
          "predicted_water_litres": 490.0,
          "is_spike": false,
          "exogenous_driver": "Study Surge"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 92.0,
          "predicted_water_litres": 550.0,
          "is_spike": false,
          "exogenous_driver": "Exam Revision"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 98.0,
          "predicted_water_litres": 620.0,
          "is_spike": false,
          "exogenous_driver": "Late Afternoon Revision"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 105.0,
          "predicted_water_litres": 680.0,
          "is_spike": false,
          "exogenous_driver": "Evening Peak"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 112.0,
          "predicted_water_litres": 740.0,
          "is_spike": false,
          "exogenous_driver": "Reading Hall Crowds"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 118.0,
          "predicted_water_litres": 800.0,
          "is_spike": false,
          "exogenous_driver": "Pre-Dinner Crowd"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 100.0,
          "predicted_water_litres": 650.0,
          "is_spike": false,
          "exogenous_driver": "Dinner Reduction"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 85.0,
          "predicted_water_litres": 480.0,
          "is_spike": false,
          "exogenous_driver": "Late Night Scholars"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 55.0,
          "predicted_water_litres": 320.0,
          "is_spike": false,
          "exogenous_driver": "Closing Time"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 35.0,
          "predicted_water_litres": 200.0,
          "is_spike": false,
          "exogenous_driver": "Security Lighting"
        }
      ]
    },
    "B04": {
      "id": "B04",
      "name": "Engineering Labs & Innovation Centre",
      "type": "Research & Labs",
      "design_capacity": 950,
      "floors": 4,
      "has_solar": 1,
      "solar_capacity_kw": 50.0,
      "has_composter": 0,
      "current_status": "online",
      "buffer_lag_hours": 0.1,
      "telemetry": {
        "electricity_kwh": 184.2,
        "water_litres": 2100.0,
        "solar_generation_kwh": 44.5,
        "footfall": 520
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 92.0,
        "recycled_dry_waste_kg": 210.0,
        "contamination_pct": 5.1,
        "landfill_kg": 48.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 188.0,
          "predicted_water_litres": 2150.0,
          "is_spike": false,
          "exogenous_driver": "Lab Server Load"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 182.0,
          "predicted_water_litres": 2000.0,
          "is_spike": false,
          "exogenous_driver": "Shift Handover"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 195.0,
          "predicted_water_litres": 2200.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Research"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 190.0,
          "predicted_water_litres": 2100.0,
          "is_spike": false,
          "exogenous_driver": "Hardware Testing"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 185.0,
          "predicted_water_litres": 1950.0,
          "is_spike": false,
          "exogenous_driver": "Prototype Deployment"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 192.0,
          "predicted_water_litres": 2050.0,
          "is_spike": false,
          "exogenous_driver": "Evening Hackathon Setup"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 215.0,
          "predicted_water_litres": 2400.0,
          "is_spike": true,
          "exogenous_driver": "24-Hour Campus Hackathon Kickoff"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 235.0,
          "predicted_water_litres": 2700.0,
          "is_spike": true,
          "exogenous_driver": "24-Hour Campus Hackathon Peak Computing"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 242.0,
          "predicted_water_litres": 2850.0,
          "is_spike": true,
          "exogenous_driver": "Hackathon + HVAC Chiller Override"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 240.0,
          "predicted_water_litres": 2800.0,
          "is_spike": true,
          "exogenous_driver": "Hackathon Coding Sprint 1"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 232.0,
          "predicted_water_litres": 2600.0,
          "is_spike": true,
          "exogenous_driver": "Midnight Hackathon Surge"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 225.0,
          "predicted_water_litres": 2450.0,
          "is_spike": true,
          "exogenous_driver": "Continuous Lab Cluster Utilization"
        }
      ]
    },
    "B05": {
      "id": "B05",
      "name": "Boys Hostel",
      "type": "Hostel",
      "design_capacity": 750,
      "floors": 5,
      "has_solar": 0,
      "solar_capacity_kw": 0.0,
      "has_composter": 1,
      "current_status": "online",
      "buffer_lag_hours": 0.4,
      "telemetry": {
        "electricity_kwh": 112.0,
        "water_litres": 4800.0,
        "solar_generation_kwh": 0.0,
        "footfall": 680
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 195.0,
        "recycled_dry_waste_kg": 85.0,
        "contamination_pct": 7.4,
        "landfill_kg": 52.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 95.0,
          "predicted_water_litres": 2200.0,
          "is_spike": false,
          "exogenous_driver": "Class Hours Low Occupancy"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 92.0,
          "predicted_water_litres": 2400.0,
          "is_spike": false,
          "exogenous_driver": "Lunch Return"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 88.0,
          "predicted_water_litres": 1800.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Classes"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 90.0,
          "predicted_water_litres": 1900.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Classes"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 110.0,
          "predicted_water_litres": 2600.0,
          "is_spike": false,
          "exogenous_driver": "Return from Academic Complex"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 128.0,
          "predicted_water_litres": 3400.0,
          "is_spike": false,
          "exogenous_driver": "Sports & Shower Hours"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 145.0,
          "predicted_water_litres": 4200.0,
          "is_spike": true,
          "exogenous_driver": "Evening Peak Water Heating + Room Power"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 152.0,
          "predicted_water_litres": 4600.0,
          "is_spike": true,
          "exogenous_driver": "Hostel Dinner Gathering"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 140.0,
          "predicted_water_litres": 3800.0,
          "is_spike": false,
          "exogenous_driver": "Common Room Activities"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 138.0,
          "predicted_water_litres": 3200.0,
          "is_spike": false,
          "exogenous_driver": "Evening Study Period"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 130.0,
          "predicted_water_litres": 2800.0,
          "is_spike": false,
          "exogenous_driver": "Night Study"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 122.0,
          "predicted_water_litres": 2400.0,
          "is_spike": false,
          "exogenous_driver": "Night Study"
        }
      ]
    },
    "B06": {
      "id": "B06",
      "name": "Girls Hostel",
      "type": "Hostel",
      "design_capacity": 700,
      "floors": 5,
      "has_solar": 0,
      "solar_capacity_kw": 0.0,
      "has_composter": 1,
      "current_status": "online",
      "buffer_lag_hours": 0.3,
      "telemetry": {
        "electricity_kwh": 104.5,
        "water_litres": 4500.0,
        "solar_generation_kwh": 0.0,
        "footfall": 640
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 210.0,
        "recycled_dry_waste_kg": 92.0,
        "contamination_pct": 4.2,
        "landfill_kg": 38.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 88.0,
          "predicted_water_litres": 2100.0,
          "is_spike": false,
          "exogenous_driver": "Low Day Occupancy"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 85.0,
          "predicted_water_litres": 2200.0,
          "is_spike": false,
          "exogenous_driver": "Lunch Break Return"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 80.0,
          "predicted_water_litres": 1700.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Classes"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 82.0,
          "predicted_water_litres": 1800.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Classes"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 102.0,
          "predicted_water_litres": 2500.0,
          "is_spike": false,
          "exogenous_driver": "Evening Return"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 118.0,
          "predicted_water_litres": 3200.0,
          "is_spike": false,
          "exogenous_driver": "Sports & Leisure"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 135.0,
          "predicted_water_litres": 4100.0,
          "is_spike": false,
          "exogenous_driver": "Evening Peak Water Draw"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 142.0,
          "predicted_water_litres": 4400.0,
          "is_spike": true,
          "exogenous_driver": "Pre-Dinner Electrical Surge"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 130.0,
          "predicted_water_litres": 3600.0,
          "is_spike": false,
          "exogenous_driver": "Dinner Period"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 128.0,
          "predicted_water_litres": 3000.0,
          "is_spike": false,
          "exogenous_driver": "Study & Room Lighting"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 120.0,
          "predicted_water_litres": 2600.0,
          "is_spike": false,
          "exogenous_driver": "Night Study"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 112.0,
          "predicted_water_litres": 2200.0,
          "is_spike": false,
          "exogenous_driver": "Night Study"
        }
      ]
    },
    "B07": {
      "id": "B07",
      "name": "Food Court & Central Mess",
      "type": "Food Court",
      "design_capacity": 1500,
      "floors": 2,
      "has_solar": 1,
      "solar_capacity_kw": 35.0,
      "has_composter": 1,
      "current_status": "online",
      "buffer_lag_hours": 0.2,
      "telemetry": {
        "electricity_kwh": 165.0,
        "water_litres": 6200.0,
        "solar_generation_kwh": 31.0,
        "footfall": 1420
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 480.0,
        "recycled_dry_waste_kg": 160.0,
        "contamination_pct": 3.5,
        "landfill_kg": 42.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 195.0,
          "predicted_water_litres": 7200.0,
          "is_spike": true,
          "exogenous_driver": "Lunch Hour Mess Rush + Dishwashing"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 210.0,
          "predicted_water_litres": 8400.0,
          "is_spike": true,
          "exogenous_driver": "Peak Campus Dining Crowd (1,400+ Footfall)"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 160.0,
          "predicted_water_litres": 5500.0,
          "is_spike": false,
          "exogenous_driver": "Post-Lunch Kitchen Cleanliness Cycle"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 115.0,
          "predicted_water_litres": 3200.0,
          "is_spike": false,
          "exogenous_driver": "Mid-Afternoon Prep"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 125.0,
          "predicted_water_litres": 3800.0,
          "is_spike": false,
          "exogenous_driver": "Evening Tea & Snacks Setup"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 140.0,
          "predicted_water_litres": 4500.0,
          "is_spike": false,
          "exogenous_driver": "Snack Rush"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 165.0,
          "predicted_water_litres": 5600.0,
          "is_spike": false,
          "exogenous_driver": "Dinner Preparation Starts"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 205.0,
          "predicted_water_litres": 7900.0,
          "is_spike": true,
          "exogenous_driver": "Hostel Dinner Rush Batch 1"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 220.0,
          "predicted_water_litres": 8800.0,
          "is_spike": true,
          "exogenous_driver": "Peak Dinner Service + Dishwashing"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 175.0,
          "predicted_water_litres": 6200.0,
          "is_spike": false,
          "exogenous_driver": "Dining Hall Wind-down"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 130.0,
          "predicted_water_litres": 4200.0,
          "is_spike": false,
          "exogenous_driver": "Late Night Sanitization"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 85.0,
          "predicted_water_litres": 2100.0,
          "is_spike": false,
          "exogenous_driver": "Overnight Cool Storage"
        }
      ]
    },
    "B08": {
      "id": "B08",
      "name": "Sports Complex & Administration",
      "type": "Sports & Admin",
      "design_capacity": 500,
      "floors": 2,
      "has_solar": 0,
      "solar_capacity_kw": 0.0,
      "has_composter": 0,
      "current_status": "offline",
      "buffer_lag_hours": 6.8,
      "telemetry": {
        "electricity_kwh": 45.0,
        "water_litres": 950.0,
        "solar_generation_kwh": 0.0,
        "footfall": 180
      },
      "circular_metrics": {
        "diverted_wet_waste_kg": 25.0,
        "recycled_dry_waste_kg": 45.0,
        "contamination_pct": 9.1,
        "landfill_kg": 22.0
      },
      "forecast_12h": [
        {
          "step_ahead": 1,
          "forecast_timestamp": "12:00",
          "predicted_electricity_kwh": 48.0,
          "predicted_water_litres": 980.0,
          "is_spike": false,
          "exogenous_driver": "Admin Workday"
        },
        {
          "step_ahead": 2,
          "forecast_timestamp": "13:00",
          "predicted_electricity_kwh": 42.0,
          "predicted_water_litres": 850.0,
          "is_spike": false,
          "exogenous_driver": "Lunch Break"
        },
        {
          "step_ahead": 3,
          "forecast_timestamp": "14:00",
          "predicted_electricity_kwh": 46.0,
          "predicted_water_litres": 920.0,
          "is_spike": false,
          "exogenous_driver": "Afternoon Office Hours"
        },
        {
          "step_ahead": 4,
          "forecast_timestamp": "15:00",
          "predicted_electricity_kwh": 45.0,
          "predicted_water_litres": 900.0,
          "is_spike": false,
          "exogenous_driver": "Office Hours"
        },
        {
          "step_ahead": 5,
          "forecast_timestamp": "16:00",
          "predicted_electricity_kwh": 65.0,
          "predicted_water_litres": 1400.0,
          "is_spike": false,
          "exogenous_driver": "Evening Badminton & Gym Opening"
        },
        {
          "step_ahead": 6,
          "forecast_timestamp": "17:00",
          "predicted_electricity_kwh": 85.0,
          "predicted_water_litres": 2200.0,
          "is_spike": false,
          "exogenous_driver": "Peak Sports Arena Activity"
        },
        {
          "step_ahead": 7,
          "forecast_timestamp": "18:00",
          "predicted_electricity_kwh": 95.0,
          "predicted_water_litres": 2600.0,
          "is_spike": true,
          "exogenous_driver": "Floodlights + Indoor Courts Utilization"
        },
        {
          "step_ahead": 8,
          "forecast_timestamp": "19:00",
          "predicted_electricity_kwh": 92.0,
          "predicted_water_litres": 2500.0,
          "is_spike": true,
          "exogenous_driver": "Sports Complex Floodlights Active"
        },
        {
          "step_ahead": 9,
          "forecast_timestamp": "20:00",
          "predicted_electricity_kwh": 78.0,
          "predicted_water_litres": 1900.0,
          "is_spike": false,
          "exogenous_driver": "Court Closing Handover"
        },
        {
          "step_ahead": 10,
          "forecast_timestamp": "21:00",
          "predicted_electricity_kwh": 40.0,
          "predicted_water_litres": 1100.0,
          "is_spike": false,
          "exogenous_driver": "Admin Shutdown"
        },
        {
          "step_ahead": 11,
          "forecast_timestamp": "22:00",
          "predicted_electricity_kwh": 28.0,
          "predicted_water_litres": 600.0,
          "is_spike": false,
          "exogenous_driver": "Night Security Only"
        },
        {
          "step_ahead": 12,
          "forecast_timestamp": "23:00",
          "predicted_electricity_kwh": 25.0,
          "predicted_water_litres": 550.0,
          "is_spike": false,
          "exogenous_driver": "Night Security Only"
        }
      ]
    }
  },
  "edge_classifier_benchmark": {
    "model_name": "Lightweight Optimized Gradient Booster (Edge Quantized)",
    "target_hardware": "Raspberry Pi 4 / ESP32-S3 Dual-Core edge envelope",
    "test_accuracy_pct": 91.4,
    "f1_score_macro": 0.908,
    "avg_inference_latency_ms": 2.4,
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
      "severity": "HIGH",
      "anomaly_type": "Electricity Surge (+62% above baseline)",
      "observed_value": "184.2 kWh",
      "expected_baseline": "113.7 kWh",
      "root_cause_explanation": "Cross-referenced with calendar: 24-Hour Campus Hackathon + manual log: chiller unit 2 compressor left in override mode.",
      "recommended_action": "1. Reset chiller 2 setpoint to 24\u00b0C; 2. Route 25 kWh excess solar battery reserve from B01; 3. Notify facility tech.",
      "estimated_cost_impact_inr": "1,420 INR saved per cycle"
    },
    {
      "alert_id": "ALT-102",
      "timestamp": "2026-09-08 13:30",
      "building_id": "B07",
      "building_name": "Food Court & Central Mess",
      "severity": "HIGH",
      "anomaly_type": "Water Surge (+78% above baseline)",
      "observed_value": "8,400 L/hr",
      "expected_baseline": "4,720 L/hr",
      "root_cause_explanation": "Cross-referenced with calendar: Freshers Orientation Luncheon + technician note: scullery dishwashing booster valve stuck open.",
      "recommended_action": "1. Actuate solenoid cutoff on scullery valve line; 2. Balance dishwasher load balance; 3. Shift greywater recycle to grounds.",
      "estimated_cost_impact_inr": "980 INR saved per cycle"
    },
    {
      "alert_id": "ALT-103",
      "timestamp": "2026-09-12 15:00",
      "building_id": "B02",
      "building_name": "Academic Block B",
      "severity": "MEDIUM",
      "anomaly_type": "HVAC Power Spike & Delayed Telemetry Packet",
      "observed_value": "138.5 kWh (buffered 3.5h lag)",
      "expected_baseline": "98.4 kWh",
      "root_cause_explanation": "Mid-sem examinations in halls 201-204 coinciding with 34\u00b0C peak ambient heatwave; edge gateway buffered 3.5 hours during sub-station packet drop.",
      "recommended_action": "1. Ingest buffered bursts deterministically; 2. Pre-cool lecture halls at 07:00 using off-peak rates; 3. Route rooftop solar from B01.",
      "estimated_cost_impact_inr": "650 INR saved per cycle"
    },
    {
      "alert_id": "ALT-104",
      "timestamp": "2026-09-18 19:15",
      "building_id": "B05",
      "building_name": "Boys Hostel",
      "severity": "LOW",
      "anomaly_type": "Recycling Stream Contamination Warning",
      "observed_value": "7.4% contamination",
      "expected_baseline": "< 5.0% threshold",
      "root_cause_explanation": "Hostel fest preparation weekend: unrinsed food takeout cartons disposed into dry cardboard bins.",
      "recommended_action": "1. Trigger mobile push notification to Wing C residents; 2. Deduct 25 Green Credits from weekly hostel bonus pool.",
      "estimated_cost_impact_inr": "320 INR avoided processing fee"
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
    },
    {
      "rank": 2,
      "building_id": "B05",
      "building_name": "Boys Hostel",
      "green_credits": 2490,
      "contamination_pct": 7.4,
      "compost_diversion_rate_pct": 84.5,
      "occupant_reward_tier": "Silver Eco-Hostel Tier (Priority gym slots)",
      "weekly_delta": "+8%"
    },
    {
      "rank": 3,
      "building_id": "B07",
      "building_name": "Food Court & Central Mess",
      "green_credits": 2210,
      "contamination_pct": 3.5,
      "compost_diversion_rate_pct": 94.2,
      "occupant_reward_tier": "Green Dining Partner (Organic garden recognition)",
      "weekly_delta": "+11%"
    },
    {
      "rank": 4,
      "building_id": "B03",
      "building_name": "Central Library",
      "green_credits": 1980,
      "contamination_pct": 3.8,
      "compost_diversion_rate_pct": 78.0,
      "occupant_reward_tier": "Bronze Tier (Paper recycling champion)",
      "weekly_delta": "+5%"
    },
    {
      "rank": 5,
      "building_id": "B01",
      "building_name": "Academic Block A",
      "green_credits": 1820,
      "contamination_pct": 6.2,
      "compost_diversion_rate_pct": 72.4,
      "occupant_reward_tier": "Standard Eco Tier",
      "weekly_delta": "+3%"
    },
    {
      "rank": 6,
      "building_id": "B04",
      "building_name": "Engineering Labs",
      "green_credits": 1650,
      "contamination_pct": 5.1,
      "compost_diversion_rate_pct": 68.0,
      "occupant_reward_tier": "Standard Eco Tier (E-waste diversion bonus)",
      "weekly_delta": "+6%"
    },
    {
      "rank": 7,
      "building_id": "B02",
      "building_name": "Academic Block B",
      "green_credits": 1410,
      "contamination_pct": 8.5,
      "compost_diversion_rate_pct": 61.2,
      "occupant_reward_tier": "Improvement Advisory Notice",
      "weekly_delta": "-2%"
    },
    {
      "rank": 8,
      "building_id": "B08",
      "building_name": "Sports Complex & Admin",
      "green_credits": 1190,
      "contamination_pct": 9.1,
      "compost_diversion_rate_pct": 54.0,
      "occupant_reward_tier": "Improvement Advisory Notice",
      "weekly_delta": "+1%"
    }
  ],
  "engineering_envelope": {
    "per_building_hardware_budget_usd": 54.0,
    "hardware_bill_of_materials": [
      {
        "component": "ESP32-S3 NodeMCU Edge Gateway (Dual Core 240MHz)",
        "cost_usd": 6.5
      },
      {
        "component": "Load Cell + HX711 ADC (Weight sensor)",
        "cost_usd": 4.2
      },
      {
        "component": "Capacitive Dielectric Moisture Probe",
        "cost_usd": 3.8
      },
      {
        "component": "Inductive Proximity Sensor (Metal detection)",
        "cost_usd": 5.5
      },
      {
        "component": "Optical Transmission Photodiode Pair (Transparency)",
        "cost_usd": 2.5
      },
      {
        "component": "Piezoelectric Vibration / Acoustic Sensor",
        "cost_usd": 3.5
      },
      {
        "component": "CT Current Transformer & Pulse Water Flow Meter",
        "cost_usd": 18.0
      },
      {
        "component": "Enclosure, wiring & local flash buffer SD module",
        "cost_usd": 10.0
      }
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
};
