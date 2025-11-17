"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Moon } from "lucide-react";

export default function ReminderBanners({ showReminder, showGoodnight }) {
  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-600/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50"
        >
          <BellRing className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span>Roomie gaat zo een verhaaltje vertellen 🌙</span>
        </motion.div>
      )}
      {showGoodnight && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-600/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50"
        >
          <Moon className="w-5 h-5 text-yellow-200 animate-pulse" />
          <span>Slaap lekker 🌙</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
