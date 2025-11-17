"use client";
import React from "react";
import { motion } from "framer-motion";

export default function EditStoryModal({
  editStory,
  setEditStory,
  handleSaveEdit,
  savingEdit,
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-slate-800 p-6 rounded-2xl border border-white/20 mx-4 md:mx-0 w-full max-w-md">
        <h3 className="text-lg text-white mb-4">Verhaal bewerken</h3>
        <input
          value={editStory.name}
          onChange={(e) =>
            setEditStory({ ...editStory, name: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 rounded bg-white/10 text-white"
        />
        <textarea
          value={editStory.text}
          onChange={(e) =>
            setEditStory({ ...editStory, text: e.target.value })
          }
          className="w-full h-40 mb-4 px-3 py-2 rounded bg-white/10 text-white"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setEditStory(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Annuleren
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={savingEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            {savingEdit ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
