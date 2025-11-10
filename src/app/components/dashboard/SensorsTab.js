"use client";
import React from "react";
import { motion } from "framer-motion";
import { ThermometerSun, Droplets, Sun, Volume2 } from "lucide-react";

export default function SensorsTab({ temperature, humidity, lightLevel, soundLevel }) {
  // Animation presets
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
            key={temperature.toFixed(1)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {temperature.toFixed(1)}°C
          </motion.div>
          <p className="text-white/60">
            {temperature < 19 ? "Koud" : temperature > 22 ? "Warm" : "Comfortabel"}
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
              animate={{ width: `${((temperature - 16) / 8) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {temperature > 22 && (
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
            key={humidity.toFixed(0)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {humidity.toFixed(0)}%
          </motion.div>
          <p className="text-white/60">
            {humidity < 40 ? "Te droog" : humidity > 60 ? "Te vochtig" : "Ideaal"}
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
              animate={{ width: `${((humidity - 30) / 40) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {humidity >= 40 && humidity <= 60 && (
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
            key={lightLevel}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {lightLevel}%
          </motion.div>
          <p className="text-white/60">
            {lightLevel < 20 ? "Donker" : lightLevel < 50 ? "Gedimpt" : "Licht"}
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
              animate={{ width: `${lightLevel}%` }}
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
            key={soundLevel.toFixed(0)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl font-bold text-white mb-2"
          >
            {soundLevel.toFixed(0)} <span className="text-3xl">dB</span>
          </motion.div>
          <p className="text-white/60">
            {soundLevel < 30 ? "Stil" : soundLevel < 50 ? "Normaal" : "Luid"}
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

        {soundLevel < 35 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
          >
            <p className="text-green-200 text-sm">✓ Rustige omgeving</p>
          </motion.div>
        )}

        {soundLevel > 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30"
          >
            <p className="text-yellow-200 text-sm">⚠️ Verhoogd geluidsniveau gedetecteerd</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
