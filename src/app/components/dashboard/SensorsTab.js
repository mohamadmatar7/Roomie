"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThermometerSun, Droplets, Sun, Volume2 } from "lucide-react";

export default function SensorsTab({ temperature, humidity, lightLevel, soundLevel }) {
  // Live sensor values, initialized from props as fallback
  const [liveTemperature, setLiveTemperature] = useState(temperature);
  const [liveHumidity, setLiveHumidity] = useState(humidity);
  const [liveLightLevel, setLiveLightLevel] = useState(lightLevel);
  const [liveSoundLevel, setLiveSoundLevel] = useState(soundLevel);

  // Public API base URL (core)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // نسبة الضوء النهائية المعروضة (0–100%)
  const lightPercent = Math.max(
    0,
    Math.min(100, Math.round(liveLightLevel))
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

        // Update temperature if provided
        if (typeof data.temperature === "number") {
          setLiveTemperature(data.temperature);
        }

        // Update humidity if provided
        if (typeof data.humidity === "number") {
          setLiveHumidity(data.humidity);
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
        if (data.sound && typeof data.sound.levelDb === "number") {
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

  // Animation presets
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md-grid-cols-2 gap-6"
      initial="initial"
      animate="animate"
      exit="initial"
    >
      {/* 🌡 Temperature */}
      <motion.div
        {...fadeUp}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <ThermometerSun className="w-6 h-6" /> Temperatuur
        </h3>

        <div className="text-center mb-6">
          <motion.div
            key={liveTemperature.toFixed(1)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {liveTemperature.toFixed(1)}°C
          </motion.div>
          <p className="text-white/60">
            {liveTemperature < 19 ? "Koud" : liveTemperature > 22 ? "Warm" : "Comfortabel"}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between text-sm mb-2">
            {["16°C", "18°C", "20°C", "22°C", "24°C"].map((t) => (
              <span key={t} className="text-white/60">
                {t}
              </span>
            ))}
          </div>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-400 via-green-400 to-red-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((liveTemperature - 16) / 8) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {liveTemperature > 22 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-orange-500/20 rounded-lg p-3 border border-orange-500/30"
          >
            <p className="text-orange-200 text-sm">
              💡 Tip: Het is wat warm. Overweeg een raam te openen.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 💧 Humidity */}
      <motion.div
        {...fadeUp}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Droplets className="w-6 h-6" /> Luchtvochtigheid
        </h3>

        <div className="text-center mb-6">
          <motion.div
            key={liveHumidity.toFixed(0)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {liveHumidity.toFixed(0)}%
          </motion.div>
          <p className="text-white/60">
            {liveHumidity < 40 ? "Te droog" : liveHumidity > 60 ? "Te vochtig" : "Ideaal"}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between text-sm mb-2">
            {["30%", "40%", "50%", "60%", "70%"].map((t) => (
              <span key={t} className="text-white/60">
                {t}
              </span>
            ))}
          </div>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((liveHumidity - 30) / 40) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {liveHumidity >= 40 && liveHumidity <= 60 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-green-500/20 rounded-lg p-3 border border-green-500/30"
          >
            <p className="text-green-200 text-sm">
              ✓ Perfecte luchtvochtigheid voor slapen
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* ☀️ Light */}
      <motion.div
        {...fadeUp}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Sun className="w-6 h-6" /> Lichtsterkte
        </h3>

        <div className="text-center mb-6">
          <motion.div
            key={lightPercent}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {lightPercent}%
          </motion.div>
          <p className="text-white/60">
            {lightPercent < 20
              ? "Donker"
              : lightPercent < 50
              ? "Gedimpt"
              : "Licht"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4"
        >
          <div className="flex justify-between text-sm mb-2">
            {["0%", "25%", "50%", "75%", "100%"].map((t) => (
              <span key={t} className="text-white/60">
                {t}
              </span>
            ))}
          </div>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${lightPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
          <p className="text-blue-200 text-sm">
            💡 Donkere kamer - ideaal voor slapen
          </p>
        </div>
      </motion.div>

      {/* 🔊 Sound */}
      <motion.div
        {...fadeUp}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Volume2 className="w-6 h-6" /> Geluid Monitor
        </h3>

        <div className="text-center mb-6">
          <motion.div
            key={liveSoundLevel.toFixed(0)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {liveSoundLevel.toFixed(0)} <span className="text-3xl">dB</span>
          </motion.div>
          <p className="text-white/60">
            {liveSoundLevel < 30 ? "Stil" : liveSoundLevel < 50 ? "Normaal" : "Luid"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4"
        >
          <p className="text-white/70 text-sm mb-3">Geluidsniveau tijd</p>
          <div className="flex items-end gap-1 h-20">
            {[25, 30, 28, 32, 35, 30, 28, 40, 35, 28, 30, 28].map((level, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(level / 60) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            ))}
          </div>
        </motion.div>

        {liveSoundLevel < 35 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
          >
            <p className="text-green-200 text-sm">✓ Rustige omgeving</p>
          </motion.div>
        )}

        {liveSoundLevel > 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30"
          >
            <p className="text-yellow-200 text-sm">
              ⚠️ Verhoogd geluidsniveau gedetecteerd
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
