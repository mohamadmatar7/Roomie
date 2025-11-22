"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Split cards into their own components
import TemperatureCard from "./sensors/TemperatureCard";
import HumidityCard from "./sensors/HumidityCard";
import LightCard from "./sensors/LightCard";
import SoundCard from "./sensors/SoundCard";

export default function SensorsTab({ temperature, humidity, lightLevel, soundLevel }) {
  // Live sensor values, initialized from props as fallback
  const [liveTemperature, setLiveTemperature] = useState(temperature);
  const [liveHumidity, setLiveHumidity] = useState(humidity);
  const [liveLightLevel, setLiveLightLevel] = useState(lightLevel);
  const [liveSoundLevel, setLiveSoundLevel] = useState(soundLevel);

  // Public API base URL (core)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Light as percentage 0–100%
  const lightPercent = Math.max(0, Math.min(100, Math.round(liveLightLevel)));

  // Safe values for UI (fallback to props / defaults if core returns null)
  const safeTemperature =
    typeof liveTemperature === "number"
      ? liveTemperature
      : typeof temperature === "number"
      ? temperature
      : 20;

  const safeHumidity =
    typeof liveHumidity === "number"
      ? liveHumidity
      : typeof humidity === "number"
      ? humidity
      : 50;

  const safeSoundLevel =
    typeof liveSoundLevel === "number" ? liveSoundLevel : 30;

  // Better scale for temperature bar: focus on 10–35°C (bedroom range)
  const tempBarPercent = Math.max(
    0,
    Math.min(100, ((safeTemperature - 10) / 25) * 100)
  );

  // Periodically fetch sensor data from core every 10 seconds
  useEffect(() => {
    if (!API_BASE_URL) {
      console.warn(
        "NEXT_PUBLIC_API_BASE_URL is not set, SensorsTab will use fallback props only."
      );
      return;
    }

    let isMounted = true;

    const fetchSensors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sensors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Sensors request failed with status ${res.status}`);
        }

        const data = await res.json();
        if (!isMounted) return;

        console.log("🔌 SensorsTab fetched sensors:", data);

        // Update temperature from core (AHT10) if provided
        if (
          typeof data.temperature === "number" &&
          !Number.isNaN(data.temperature)
        ) {
          // Clamp to a realistic room range 5–45°C
          const t = Math.max(5, Math.min(45, data.temperature));
          setLiveTemperature(t);
        }

        // Update humidity from core (AHT10) if provided
        if (
          typeof data.humidity === "number" &&
          !Number.isNaN(data.humidity)
        ) {
          // Clamp to 0–100%
          const h = Math.max(0, Math.min(100, data.humidity));
          setLiveHumidity(h);
        }

        // Map light data (visible → 0–100%)
        if (data.light) {
          const visibleRaw =
            typeof data.light.visible === "number"
              ? data.light.visible
              : typeof data.light.ch0 === "number"
              ? data.light.ch0
              : 0;

          // Example: visible 0–100 → 0–100%, >100 = 100%
          const normalized = Math.max(0, Math.min(100, visibleRaw));

          console.log("💡 visibleRaw =", visibleRaw, " → normalized =", normalized);
          setLiveLightLevel(Math.round(normalized));
        }

        // Update sound level if provided
        if (
          data.sound &&
          typeof data.sound.levelDb === "number" &&
          !Number.isNaN(data.sound.levelDb)
        ) {
          setLiveSoundLevel(data.sound.levelDb);
        }
      } catch (err) {
        console.error("Failed to fetch sensors from core in SensorsTab:", err);
      }
    };

    // Initial fetch
    fetchSensors();
    // Poll every 10 seconds
    const intervalId = setInterval(fetchSensors, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [API_BASE_URL]);

  // Animation presets (shared with cards)
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <TemperatureCard
        fadeUp={fadeUp}
        safeTemperature={safeTemperature}
        tempBarPercent={tempBarPercent}
      />

      <HumidityCard
        fadeUp={fadeUp}
        safeHumidity={safeHumidity}
      />

      <LightCard
        fadeUp={fadeUp}
        lightPercent={lightPercent}
      />

      <SoundCard
        fadeUp={fadeUp}
        safeSoundLevel={safeSoundLevel}
      />
    </motion.div>
  );
}
