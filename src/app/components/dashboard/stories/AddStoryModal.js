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
  // 🆕 audio props
  newAudioUrl,
  setNewAudioUrl,
  newAudioFile,
  setNewAudioFile,
  uploadingAudio,
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

        {/* Titel */}
        <input
          placeholder="Titel"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-white/10 text-white"
        />

        {/* Tekst */}
        <textarea
          placeholder="Schrijf hier het verhaal..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full h-40 mb-3 px-3 py-2 rounded bg-white/10 text-white"
        />

        {/* 🔊 Audio (optioneel) */}
        <div className="mb-4 space-y-2">
          <p className="text-xs text-white/70">Audio (optioneel)</p>

          {/* Audio URL */}
          <input
            placeholder="https://example.com/story.mp3"
            value={newAudioUrl}
            onChange={(e) => setNewAudioUrl(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/10 text-white text-sm"
          />

          {/* Upload file */}
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setNewAudioFile(e.target.files?.[0] || null)}
            className="block w-full text-xs text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-white/20"
          />

          {newAudioFile && (
            <p className="text-[11px] text-white/70">
              Geselecteerd:{" "}
              <span className="font-medium">{newAudioFile.name}</span>
            </p>
          )}

          <p className="text-[11px] text-white/50">
            Als zowel URL als bestand zijn ingevuld, wordt het geüploade
            bestand gebruikt.
          </p>

          {uploadingAudio && (
            <p className="text-[11px] text-white/70">
              Audio aan het uploaden…
            </p>
          )}
        </div>

        {/* Taal */}
        <div className="flex items-center justify-between text-white/70 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Gedetecteerde taal:</span>
          </div>
          <span className="font-medium text-white">
            {langLabel[detectedLang]}
          </span>
        </div>

        {/* Knoppen */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Annuleren
          </button>
          <button
            onClick={handleAddStory}
            disabled={loading || uploadingAudio}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading || uploadingAudio ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
