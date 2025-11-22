import React from "react";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";

export default function LightCard({ fadeUp, lightPercent }) {
  // Dynamic light message + styling based on lightPercent
  let lightCardMessage = "💡 Donkere kamer - ideaal voor slapen";
  let lightCardClasses =
    "bg-blue-500/20 rounded-lg p-3 border border-blue-500/30 text-blue-200 text-sm";

  if (lightPercent >= 20 && lightPercent <= 60) {
    lightCardMessage = "💡 Zacht licht - nog steeds goed om te slapen.";
    lightCardClasses =
      "bg-purple-500/20 rounded-lg p-3 border border-purple-500/30 text-purple-100 text-sm";
  } else if (lightPercent > 60) {
    lightCardMessage =
      "💡 De kamer is nog vrij helder. Voor beter slapen kun je het licht dimmen.";
    lightCardClasses =
      "bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30 text-yellow-100 text-sm";
  }

  return (
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

      {/* Dynamic light message card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={lightCardClasses + " mt-1"}
      >
        <p>{lightCardMessage}</p>
      </motion.div>
    </motion.div>
  );
}
