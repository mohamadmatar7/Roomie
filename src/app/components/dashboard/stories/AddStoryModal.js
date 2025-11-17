"use client";
import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function AddStoryModal({
  newTitle,
  setNewTitle,
  newText,
  setNewText,
  detectedLang,
  langLabel,
  handleAddStory,
  loading,
  setShowAddModal,
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-slate-800 p-6 rounded-2xl border border-white/20 mx-4 md:mx-0 w-full max-w-md">
        <h3 className="text-lg text-white mb-4">Nieuw Verhaal</h3>
        <input
          placeholder="Titel"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-white/10 text-white"
        />
        <textarea
          placeholder="Schrijf hier het verhaal..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full h-40 mb-2 px-3 py-2 rounded bg-white/10 text-white"
        />
        <div className="flex items-center justify-between text-white/70 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Gedetecteerde taal:</span>
          </div>
          <span className="font-medium text-white">
            {langLabel[detectedLang]}
          </span>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Annuleren
          </button>
          <button
            onClick={handleAddStory}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            {loading ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
