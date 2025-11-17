"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Play,
  Trash2,
  Edit,
  Loader2,
  BellRing,
  Moon,
  Recycle,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";
import { franc } from "franc";
import { motion, AnimatePresence } from "framer-motion";

const langMap = {
  eng: "en-GB",
  nld: "nl-NL",
  afr: "nl-NL",
  arb: "ar-SA",
};

const langLabel = {
  "en-GB": "English 🇬🇧",
  "nl-NL": "Nederlands 🇳🇱",
  "ar-SA": "العربية 🇸🇦",
};

const goodnightText = {
  "en-GB": "Good night, sweet dreams",
  "nl-NL": "Slaap lekker",
  "ar-SA": "تصبح على خير",
};

export default function StoriesTabOld({
  stories,
  setStories,
  scheduledTime,
  setScheduledTime,
  scheduledStory,
  setScheduledStory,
}) {
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [detectedLang, setDetectedLang] = useState("en-GB");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showGoodnight, setShowGoodnight] = useState(false);
  const [toast, setToast] = useState(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const currentAudioRef = useRef(null);

  // 🧠 Detect language
  useEffect(() => {
    if (!newText.trim()) return;
    const detected = franc(newText);
    let lang = langMap[detected] || "en-GB";
    const t = newText.toLowerCase();
    if (/de |het |een |bos/.test(t)) lang = "nl-NL";
    if (/[أ-ي]/.test(t)) lang = "ar-SA";
    setDetectedLang(lang);
  }, [newText]);

  // 🔔 Toast handler
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🧩 Add story
  const handleAddStory = async () => {
    if (!newTitle.trim() || !newText.trim()) {
      showToast("Titel en tekst vereist", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/story/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          text: newText,
          language: detectedLang,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      const newStory = {
        id: data.id,
        name: data.title,
        text: data.refinedText || data.originalText,
        language: detectedLang,
        uploaded: new Date(data.createdAt).toISOString().split("T")[0],
      };

      setStories((prev) => [newStory, ...prev]);
      setShowAddModal(false);
      setNewTitle("");
      setNewText("");
      showToast("Verhaal toegevoegd!");
    } catch {
      showToast("Fout bij toevoegen", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit story
  const handleSaveEdit = async () => {
    if (!editStory?.name.trim() || !editStory?.text.trim()) {
      showToast("Titel en tekst vereist", "error");
      return;
    }
    try {
      setSavingEdit(true);
      const prompt = `Polish this children's story for narration, fix punctuation and flow:\n"""${editStory.text}"""`;

      const refine = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_OPENAI_KEY || process.env.OPENAI_API_KEY
          }`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      });

      const data = await refine.json();
      const refined =
        data.choices?.[0]?.message?.content?.trim() || editStory.text;

      const res = await fetch("/api/story/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editStory,
          title: editStory.name,
          text: refined,
          language: editStory.language,
        }),
      });

      if (!res.ok) throw new Error();
      setStories((p) =>
        p.map((s) =>
          s.id === editStory.id ? { ...s, name: editStory.name, text: refined } : s
        )
      );
      setEditStory(null);
      showToast("Verhaal opgeslagen!");
    } catch {
      showToast("Fout bij opslaan", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  // 🗑️ Delete story
  const confirmDeleteStory = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteStory = async () => {
    if (!deleteId) return;
    try {
      setConfirmingDelete(true);
      const res = await fetch(`/api/story/delete?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setStories((p) => p.filter((s) => s.id !== deleteId));
      showToast("Verhaal verwijderd!");
    } catch {
      showToast("Fout bij verwijderen", "error");
    } finally {
      setConfirmingDelete(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  // 🎧 Play story
  const readStory = async (storyId, storyText, langFromStory) => {
    if (!storyText || isPlaying) return;
    if (currentAudioRef.current) currentAudioRef.current.pause();

    let lang = langFromStory || "en-GB";
    let voice = lang === "ar-SA" ? "nova" : lang === "nl-NL" ? "verse" : "fable";
    try {
      setIsPlaying(true);
      const res = await fetch("/api/openai-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: storyText, lang, voice }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.play();
      audio.onended = async () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        await playGoodnight(lang);
      };
    } catch {
      showToast("Kon niet afspelen", "error");
      setIsPlaying(false);
    }
  };

  // 🌙 Goodnight message
  const playGoodnight = async (lang) => {
    setShowGoodnight(true);
    const text = goodnightText[lang] || goodnightText["en-GB"];
    const voice = lang === "ar-SA" ? "nova" : "fable";
    try {
      const res = await fetch("/api/openai-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang, voice }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setShowGoodnight(false);
      };
    } catch {
      setShowGoodnight(false);
    }
  };

  // 📅 Load & Save schedule
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const res = await fetch("/api/schedule/get");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.id) {
          setScheduledStory(data.storyId);
          setScheduledTime(data.time);
        }
      } catch {}
    };
    loadSchedule();
  }, [setScheduledStory, setScheduledTime]);

  const saveSchedule = async () => {
    try {
      setSavingSchedule(true);
      const res = await fetch("/api/schedule/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: scheduledStory, time: scheduledTime }),
      });
      if (!res.ok) throw new Error();
      showToast("Planning opgeslagen!");
    } catch {
      showToast("Opslaan mislukt", "error");
    } finally {
      setSavingSchedule(false);
    }
  };

  // 🧹 Cleanup old audios
  const handleCleanup = async () => {
    try {
      setCleaning(true);
      const res = await fetch("/api/cron/cleanup");
      const data = await res.json();
      if (res.ok) {
        showToast(`🧹 ${data.deleted || 0} oude bestanden verwijderd`);
        setCleaned(true);
        setTimeout(() => setCleaned(false), 4000);
      } else {
        showToast("Fout bij opruimen", "error");
      }
    } catch {
      showToast("Fout bij opruimen", "error");
    } finally {
      setCleaning(false);
      setShowCleanupConfirm(false);
    }
  };

  // 🕓 Auto reminder
  useEffect(() => {
    if (!scheduledTime || !scheduledStory) return;
    const interval = setInterval(() => {
      const now = new Date();
      const [h, m] = scheduledTime.split(":").map(Number);
      const current = now.getHours() * 60 + now.getMinutes();
      const target = h * 60 + m;
      const diff = target - current;
      const story = stories.find((s) => s.id === scheduledStory);
      if (!story) return;

      if (diff === 2 && !showReminder) {
        setShowReminder(true);
        new Audio("/soft-bell.mp3").play().catch(() => {});
        setTimeout(() => setShowReminder(false), 8000);
      }
      if (diff === 0 && !isPlaying) {
        readStory(story.id, story.text, story.language);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [scheduledTime, scheduledStory, stories, isPlaying]);

  // ------------------- UI -------------------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      {/* 🔔 Reminder + Goodnight */}
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
            <span>{goodnightText["nl-NL"]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-5 right-5 flex items-center gap-2 px-4 py-3 rounded-lg text-white shadow-lg ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.type === "error" ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📚 Library */}
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
    {/* ➕ Nieuw Verhaal */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setShowAddModal(true)}
      className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium shadow hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
    >
      <Upload className="w-4 h-4" />
      Nieuw&nbsp;Verhaal
    </motion.button>

    {/* 🧹 Audio wissen */}
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
                <p className="text-xs text-white/60">
                  {s.uploaded} • {langLabel[s.language] || "🌍"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => readStory(s.id, s.text, s.language)}
                  disabled={isPlaying}
                  className="bg-green-500 p-2 rounded-full hover:bg-green-600"
                >
                  <Play className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setEditStory(s)}
                  className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => confirmDeleteStory(s.id)}
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

      {/* Planning */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Planning</h3>
        <input
          type="time"
          value={scheduledTime || ""}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full mb-3 bg-white/10 border border-white/20 text-white rounded px-3 py-2"
        />
        <select
          value={scheduledStory || ""}
          onChange={(e) => setScheduledStory(Number(e.target.value))}
          className="w-full mb-3 bg-white/10 border border-white/20 text-white rounded px-3 py-2"
        >
          <option value="">Kies een verhaal</option>
          {stories.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-800">
              {s.name}
            </option>
          ))}
        </select>
        <button
          onClick={saveSchedule}
          disabled={savingSchedule}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
        >
          {savingSchedule ? "Opslaan..." : "Planning opslaan"}
        </button>
      </div>

      {/* Confirm delete */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-slate-800 p-6 rounded-2xl border border-white/20 text-center w-full max-w-md">
              <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-white mb-4">
                Weet je zeker dat je dit verhaal wilt verwijderen?
              </h3>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDeleteStory}
                  disabled={confirmingDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  {confirmingDelete ? "Verwijderen..." : "Verwijderen"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cleanup Confirm */}
      <AnimatePresence>
        {showCleanupConfirm && (
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
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
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
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editStory && (
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
        )}
      </AnimatePresence>
    </div>
  );
}
