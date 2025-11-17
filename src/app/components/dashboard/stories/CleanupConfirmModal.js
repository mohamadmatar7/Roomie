"use client";
import React from "react";
import { motion } from "framer-motion";
import { Recycle } from "lucide-react";

export default function CleanupConfirmModal({
  cleaning,
  handleCleanup,
  setShowCleanupConfirm,
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-slate-800 p-6 rounded-2xl border border-white/20 text-center w-full max-w-md">
        <Recycle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-white mb-4">
          Oude audio bestanden verwijderen (ouder dan 30 dagen)?
        </h3>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShowCleanupConfirm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Annuleren
          </button>
          <button
            onClick={handleCleanup}
            disabled={cleaning}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            {cleaning ? "Verwijderen..." : "Verwijderen"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
