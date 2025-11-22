import React from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

export default function SoundCard({ fadeUp, safeSoundLevel }) {
  return (
    <motion.div
      {...fadeUp}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <Volume2 className="w-6 h-6" /> Geluid Monitor
      </h3>

      <div className="text-center mb-6">
        <motion.div
          key={safeSoundLevel.toFixed(0)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-6xl font-bold text-white mb-2"
        >
          {safeSoundLevel.toFixed(0)} <span className="text-3xl">dB</span>
        </motion.div>
        <p className="text-white/60">
          {safeSoundLevel < 30
            ? "Stil"
            : safeSoundLevel < 50
            ? "Normaal"
            : "Luid"}
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

      {safeSoundLevel < 35 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
        >
          <p className="text-green-200 text-sm">✓ Rustige omgeving</p>
        </motion.div>
      )}

      {safeSoundLevel > 50 && (
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
  );
}
