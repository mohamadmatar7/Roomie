"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Recycle,
  Loader2,
  CheckCircle2,
  Play,
  Edit,
  Trash2,
} from "lucide-react";

export default function LibrarySection({
  stories,
  readStory,
  confirmDeleteStory, // ✅ triggers parent modal
  setEditStory,
  setShowAddModal,
  setShowCleanupConfirm,
  cleaning,
  cleaned,
  isPlaying,
  confirmingDelete,
  deleteId,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-white text-center sm:text-left">
          Verhalen Bibliotheek
        </h3>

        <div className="flex flex-row justify-center sm:justify-end gap-2 w-full sm:w-auto">
          {/* ➕ Add New Story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium shadow hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            Nieuw&nbsp;Verhaal
          </motion.button>

          {/* ♻️ Cleanup */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCleanupConfirm(true)}
            disabled={cleaning}
            className={`flex-1 sm:flex-none px-3 py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium shadow hover:bg-emerald-700 transition-all duration-200 ${
              cleaning ? "opacity-80 cursor-wait" : ""
            }`}
          >
            {cleaning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : cleaned ? (
              <CheckCircle2 className="w-4 h-4 text-green-300" />
            ) : (
              <Recycle className="w-4 h-4" />
            )}
            <span>{cleaned ? "Opgeruimd!" : "Audio wissen"}</span>
          </motion.button>
        </div>
      </div>

      {/* 📚 Story List */}
      {stories.length === 0 ? (
        <p className="text-white/60 text-center py-6">
          Nog geen verhalen toegevoegd.
        </p>
      ) : (
        stories.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center bg-white/5 rounded-lg p-3 mb-3 border border-white/10"
          >
            <div>
              <h4 className="text-white">{s.name}</h4>
              <p className="text-xs text-white/60">{s.uploaded}</p>
            </div>

            <div className="flex gap-2">
              {/* ▶️ Play */}
              <button
                onClick={
                  readStory ? () => readStory(s.id, s.text, s.language) : undefined
                }
                disabled={isPlaying}
                className="bg-green-500 p-2 rounded-full hover:bg-green-600"
              >
                <Play className="w-4 h-4 text-white" />
              </button>

              {/* ✏️ Edit */}
              <button
                onClick={setEditStory ? () => setEditStory(s) : undefined}
                className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
              >
                <Edit className="w-4 h-4 text-white" />
              </button>

              {/* 🗑️ Delete */}
              <button
                onClick={() => confirmDeleteStory(s.id)} // ✅ opens modal from parent
                disabled={confirmingDelete}
                className="bg-red-500 p-2 rounded-full hover:bg-red-600"
              >
                {confirmingDelete && s.id === deleteId ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Trash2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}