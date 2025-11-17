"use client";
import React, { useState, useEffect, useRef } from "react";
import { franc } from "franc";
import { AnimatePresence } from "framer-motion";
import { BellRing, Moon, CheckCircle, XCircle } from "lucide-react";

import LibrarySection from "./stories/LibrarySection";
import PlanningSection from "./stories/PlanningSection";
import ParentPlanningSection from "./stories/ParentPlanningSection";
import AddStoryModal from "./stories/AddStoryModal";
import EditStoryModal from "./stories/EditStoryModal";
import DeleteConfirmModal from "./stories/ConfirmModal";
import CleanupConfirmModal from "./stories/CleanupConfirmModal";
import ToastMessage from "./stories/ToastMessage";
import ReminderBanners from "./stories/ReminderBanners";

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

export default function StoriesTab({
  stories,
  setStories,
  scheduledTime,
  setScheduledTime,
  scheduledStory,
  setScheduledStory,
}) {
  const lastPlayedRef = useRef(null);
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
  const [toast, setToast] = useState(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [plansRefreshToken, setPlansRefreshToken] = useState(0);
  const currentAudioRef = useRef(null); // reserved for future local audio usage
  const playingStoryIdRef = useRef(null);

  // Core base URL (Pi / Roomie core)
  const CORE_BASE_URL =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "";

  // 🧠 Detect language based on text
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
    if (!editStory?.name?.trim() || !editStory?.text?.trim()) {
      showToast("Titel en tekst vereist", "error");
      return;
    }

    try {
      setSavingEdit(true);

      const res = await fetch("/api/story/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editStory.id,
          title: editStory.name,
          text: editStory.text, // no refinement on the frontend anymore
          language: editStory.language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("❌ Update failed:", data);
        showToast(data.error || "Fout bij opslaan", "error");
        return;
      }

      // Update local state manually
      setStories((p) =>
        p.map((s) =>
          s.id === editStory.id
            ? { ...s, name: editStory.name, text: editStory.text }
            : s
        )
      );

      setEditStory(null);
      showToast("Verhaal opgeslagen!");
    } catch (err) {
      console.error("❌ Update error:", err);
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

  // 🎧 Play story — remote only (sound is on core, not in the browser)
  const readStory = async (storyId, storyText, langFromStory, scheduleId) => {
    console.log("🎬 readStory (remote) called with:", {
      storyId,
      langFromStory,
      scheduleId,
    });

    const numericId = Number(storyId);
    const story = stories.find((s) => Number(s.id) === numericId);
    if (!story) {
      console.warn("⚠️ No story found with ID:", storyId);
      return;
    }

    if (playingStoryIdRef.current === storyId) {
      console.warn(
        "⚠️ Story already requested for remote play, skipping duplicate trigger:",
        storyId
      );
      return;
    }
    playingStoryIdRef.current = storyId;

    console.log("🎯 Found story:", story);

    let lang = story.language || langFromStory || "en-GB";
    let voice = lang === "ar-SA" ? "nova" : lang === "nl-NL" ? "verse" : "fable";

    try {
      setIsPlaying(true);

      const base = CORE_BASE_URL.replace(/\/$/, "");
      if (!base) {
        throw new Error("CORE_BASE_URL is not configured");
      }

      const res = await fetch(`${base}/api/player/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: numericId,
          lang,
          voice,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        console.error("❌ Remote play failed:", data);
        throw new Error(data.error || "Player request failed");
      }

      console.log("▶️ Remote story playing on Roomie core:", story.title);

      // After triggering playback on core, we can safely remove the schedule
      if (scheduleId) {
        try {
          const delRes = await fetch(`/api/schedule/delete?id=${scheduleId}`, {
            method: "DELETE",
          });
          if (!delRes.ok) {
            console.warn("⚠️ Failed to delete schedule after remote play");
          }
        } catch (err) {
          console.error("❌ Auto delete schedule failed:", err);
        }
      }
    } catch (err) {
      console.error("Remote play error:", err);
      showToast("Kon niet afspelen", "error");
    } finally {
      // We don't really know when the story finishes on the core,
      // so we only use isPlaying to block overlapping requests while this call is in flight.
      setIsPlaying(false);
      playingStoryIdRef.current = null;
    }
  };

  // 🧹 Cleanup (still calls web cleanup route; this only removes web-side files if any)
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

  // 💾 Save schedule
  const saveSchedule = async (date, time, storyId) => {
    try {
      setSavingSchedule(true);
      const res = await fetch("/api/schedule/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: storyId || scheduledStory,
          date: date || new Date().toISOString().split("T")[0],
          time: time || scheduledTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Opslaan mislukt", "error");
        return { success: false, error: data.error };
      }

      showToast("Planning opgeslagen!");

      // Trigger refresh for dependent components (ParentPlanningSection)
      setPlansRefreshToken((prev) => prev + 1);

      return { success: true, data };
    } catch (err) {
      console.error("❌ Schedule save failed:", err);
      showToast("Opslaan mislukt", "error");
      return { success: false, error: "Opslaan mislukt" };
    } finally {
      setSavingSchedule(false);
    }
  };

  // 📅 Load today's next schedule once on mount → shared with Overview via props
  useEffect(() => {
    const loadTodaysNextSchedule = async () => {
      try {
        const res = await fetch("/api/schedule/get");
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // Filter schedules that are for today
        const todays = data.filter((p) => {
          const d = (p.date || "").split("T")[0];
          return d === today;
        });

        if (todays.length === 0) return;

        // Attach Date object for sorting and comparison
        const withDate = todays.map((p) => {
          const [h, m] = (p.time || "00:00").split(":").map(Number);
          const dt = new Date(p.date);
          dt.setHours(h || 0);
          dt.setMinutes(m || 0);
          dt.setSeconds(0);
          dt.setMilliseconds(0);
          return { ...p, dateObj: dt };
        });

        // Sort ascending by time
        withDate.sort((a, b) => a.dateObj - b.dateObj);

        // Pick the next future schedule for today, or the earliest if all are in the past
        const next =
          withDate.find((p) => p.dateObj >= now) || withDate[0];

        if (next.storyId) setScheduledStory(next.storyId);
        if (next.time) setScheduledTime(next.time);
      } catch (err) {
        console.error("❌ Failed to load today's schedule:", err);
      }
    };

    loadTodaysNextSchedule();
  }, [setScheduledStory, setScheduledTime]);

  // 🕒 Auto reminder + auto play (remote)
  const remindedRef = useRef(new Set());
  const playedRef = useRef(new Set());

  useEffect(() => {
    const checkTime = async () => {
      try {
        const res = await fetch("/api/schedule/get");
        if (!res.ok) return;
        const schedules = await res.json();
        if (!Array.isArray(schedules)) return;
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTotal = now.getHours() * 60 + now.getMinutes();

        for (const sch of schedules) {
          if (sch.date.split("T")[0] !== today) continue;
          const [targetHour, targetMinute] = sch.time.split(":").map(Number);
          const targetTotal = targetHour * 60 + targetMinute;
          const diff = targetTotal - currentTotal;
          const story = stories.find((s) => s.id === sch.storyId);
          if (!story) continue;

          // Reminder bell a couple of minutes before
          if (
            diff > 0 &&
            diff < 3 &&
            !playedRef.current.has(sch.id) &&
            !remindedRef.current.has(sch.id)
          ) {
            console.log(`🔔 Reminder bell for "${story.name}" (${sch.time})`);
            setShowReminder(true);
            remindedRef.current.add(sch.id);
            new Audio("/soft-bell.mp3").play().catch(() => {});
            setTimeout(() => setShowReminder(false), 5000);
          }

          // Auto play at the scheduled time (remote)
          if (diff >= 0 && diff < 1 && !playedRef.current.has(sch.id)) {
            playedRef.current.add(sch.id);
            const nowKey = `${today}-${targetHour}:${targetMinute}`;
            lastPlayedRef.current = nowKey;
            console.log(`⏰ Auto-playing story "${story.name}" (remote)`);
            readStory(story.id, story.text, story.language, sch.id);
          }
        }
      } catch (err) {
        console.error("❌ Auto-check failed:", err);
      }
    };

    const interval = setInterval(checkTime, 15000);
    checkTime();
    return () => clearInterval(interval);
  }, [stories]);

  // 🧩 Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      <ReminderBanners showReminder={showReminder} showGoodnight={false} />
      <ToastMessage toast={toast} />

      <LibrarySection
        stories={stories}
        readStory={readStory}
        confirmDeleteStory={confirmDeleteStory}
        setEditStory={setEditStory}
        setShowAddModal={setShowAddModal}
        setShowCleanupConfirm={setShowCleanupConfirm}
        cleaning={cleaning}
        cleaned={cleaned}
      />

      <PlanningSection
        stories={stories}
        scheduledStory={scheduledStory}
        setScheduledStory={setScheduledStory}
        scheduledTime={scheduledTime}
        setScheduledTime={setScheduledTime}
        saveSchedule={saveSchedule}
        savingSchedule={savingSchedule}
      />

      <ParentPlanningSection refreshToken={plansRefreshToken} />

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            show={showDeleteConfirm}
            type="delete"
            message="Weet je zeker dat je dit verhaal wilt verwijderen?"
            onConfirm={handleDeleteStory}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={confirmingDelete}
          />
        )}

        {showCleanupConfirm && (
          <CleanupConfirmModal
            cleaning={cleaning}
            handleCleanup={handleCleanup}
            setShowCleanupConfirm={setShowCleanupConfirm}
          />
        )}

        {showAddModal && (
          <AddStoryModal
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newText={newText}
            setNewText={setNewText}
            detectedLang={detectedLang}
            langLabel={langLabel}
            handleAddStory={handleAddStory}
            loading={loading}
            setShowAddModal={setShowAddModal}
          />
        )}

        {editStory && (
          <EditStoryModal
            editStory={editStory}
            setEditStory={setEditStory}
            handleSaveEdit={handleSaveEdit}
            savingEdit={savingEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
