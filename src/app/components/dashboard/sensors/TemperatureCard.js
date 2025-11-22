import React from "react";
import { motion } from "framer-motion";
import { ThermometerSun } from "lucide-react";

export default function TemperatureCard({ fadeUp, safeTemperature, tempBarPercent }) {
  return (
    <motion.div
      {...fadeUp}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <ThermometerSun className="w-6 h-6" /> Temperatuur
      </h3>

      <div className="text-center mb-6">
        <motion.div
          key={safeTemperature.toFixed(1)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-6xl font-bold text-white mb-2"
        >
          {safeTemperature.toFixed(1)}°C
        </motion.div>
        <p className="text-white/60">
          {safeTemperature < 16
            ? "Koud"
            : safeTemperature < 18
            ? "Fris"
            : safeTemperature <= 24
            ? "Comfortabel"
            : safeTemperature <= 28
            ? "Warm"
            : "Heel warm"}
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex justify-between text-sm mb-2">
          {["10°C", "15°C", "20°C", "25°C", "30°C", "35°C"].map((t) => (
            <span key={t} className="text-white/60">
              {t}
            </span>
          ))}
        </div>
        <div className="bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-400 via-green-400 to-red-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${tempBarPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Ideal sleep temperature card (19–24°C) */}
      {safeTemperature >= 19 && safeTemperature <= 24 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-500/20 rounded-lg p-3 border border-green-500/30"
        >
          <p className="text-green-200 text-sm">
            ✓ Ideale temperatuur om te slapen.
          </p>
        </motion.div>
      )}

      {/* Tips only for really cold or really warm */}
      {safeTemperature < 16 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-blue-500/20 rounded-lg p-3 border border-blue-500/30"
        >
          <p className="text-blue-100 text-sm">
            💡 Het is fris in de kamer. Een extra dekentje of raam dicht kan
            helpen.
          </p>
        </motion.div>
      )}

      {safeTemperature > 28 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-orange-500/20 rounded-lg p-3 border border-orange-500/30"
        >
          <p className="text-orange-200 text-sm">
            💡 Het is erg warm. Zorg voor frisse lucht en genoeg te drinken.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
