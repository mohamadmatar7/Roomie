"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Clock } from "lucide-react";

export default function ConfirmModal({
  show,
  type = "alert", // "alert" | "delete" | "conflict"
  message = "Weet je het zeker?",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!show) return null;

  const isDelete = type === "delete";
  const isConflict = type === "conflict";

  // 🎨 Icon based on modal type
  const renderIcon = () => {
    if (isDelete)
      return <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />;
    if (isConflict)
      return <Clock className="w-10 h-10 text-blue-400 mx-auto mb-3" />;
    return <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-slate-800 p-6 rounded-2xl border border-white/20 text-center w-full max-w-md shadow-lg"
        >
          {renderIcon()}

          <h3 className="text-white mb-4 leading-relaxed">{message}</h3>

          <div className="flex justify-center gap-3">
            {/* 🟡 Only "Sluiten" for alert/conflict */}
            {!isDelete && (
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Sluiten
              </button>
            )}

            {/* 🗑️ Delete Confirm Buttons */}
            {isDelete && (
              <>
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Annuleren
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {loading ? "Verwijderen..." : "Verwijderen"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
