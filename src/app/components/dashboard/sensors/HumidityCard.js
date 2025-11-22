import React from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

export default function HumidityCard({ fadeUp, safeHumidity }) {
  return (
    <motion.div
      {...fadeUp}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <Droplets className="w-6 h-6" /> Luchtvochtigheid
      </h3>

      <div className="text-center mb-6">
        <motion.div
          key={safeHumidity.toFixed(0)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-6xl font-bold text-white mb-2"
        >
          {safeHumidity.toFixed(0)}%
        </motion.div>
        <p className="text-white/60">
          {safeHumidity < 40
            ? "Te droog"
            : safeHumidity > 60
            ? "Te vochtig"
            : "Ideaal"}
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
            animate={{ width: `${((safeHumidity - 30) / 40) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {safeHumidity >= 40 && safeHumidity <= 60 && (
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
  );
}
