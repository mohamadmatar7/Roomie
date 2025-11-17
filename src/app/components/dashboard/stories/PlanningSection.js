"use client";
import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";

// ✅ Helper: get local date as YYYY-MM-DD (no timezone surprises)
function getLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PlanningSection({
  stories,
  scheduledStory,
  setScheduledStory,
  scheduledTime,
  setScheduledTime,
  saveSchedule,
  savingSchedule,
  plans = [],
}) {
  const [scheduledDate, setScheduledDate] = useState(getLocalISODate());
  const [minDate] = useState(getLocalISODate());
  const [minTime, setMinTime] = useState("");

  // ⚠️ Modal state
  const [modalType, setModalType] = useState("alert");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ⏰ Update min time if today (local)
  useEffect(() => {
    const now = new Date();
    const today = getLocalISODate();
    if (scheduledDate === today) {
      const rounded = new Date(
        Math.ceil(now.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000)
      );
      const hours = String(rounded.getHours()).padStart(2, "0");
      const minutes = String(rounded.getMinutes()).padStart(2, "0");
      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime("");
    }
  }, [scheduledDate]);

  // 💾 Handle Save (with backend + frontend validation)
  const handleSave = async () => {
    const now = new Date();

    // Build a local date/time object based on selected date + time
    const [h, m] = (scheduledTime || "00:00").split(":").map(Number);
    const [year, month, day] = scheduledDate.split("-").map(Number);
    const selected = new Date(year, month - 1, day, h || 0, m || 0, 0, 0);

    // 🚫 Past time check
    if (selected < now) {
      setModalType("alert");
      setModalMessage("Je kunt geen planning maken in het verleden ⛔");
      setShowModal(true);
      return;
    }

    // 🚫 Duplicate check: same date + time (local UI)
    const hasConflict = plans.some(
      (p) =>
        (p.date || "").slice(0, 10) === scheduledDate &&
        p.time === scheduledTime
    );
    if (hasConflict) {
      setModalType("conflict");
      setModalMessage("Er bestaat al een planning op deze datum en tijd ⏰");
      setShowModal(true);
      return;
    }

    // ✅ Call backend via parent saveSchedule()
    const result = await saveSchedule(
      scheduledDate,
      scheduledTime,
      scheduledStory
    );

    // 🧩 If backend also detects a conflict or error, show modal
    if (!result?.success && result?.error) {
      setModalType("conflict");
      setModalMessage(result.error);
      setShowModal(true);
    }
  };

  return (
    <>
      {/* ⚠️ Modal */}
      <ConfirmModal
        show={showModal}
        type={modalType}
        message={modalMessage}
        onCancel={() => setShowModal(false)}
      />

      {/* 🧩 Planner UI */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Planning</h3>

        {/* 📅 Date picker */}
        <input
          type="date"
          value={scheduledDate}
          min={minDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="w-full mb-3 bg-white/10 border border-white/20 text-white rounded px-3 py-2"
        />

        {/* ⏰ Time picker */}
        <input
          type="time"
          value={scheduledTime || ""}
          min={minTime || undefined}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full mb-3 bg-white/10 border border-white/20 text-white rounded px-3 py-2"
        />

        {/* 📖 Story selector */}
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

        {/* 💾 Save button */}
        <button
          onClick={handleSave}
          disabled={savingSchedule}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          {savingSchedule ? "Opslaan..." : "Planning opslaan"}
        </button>
      </div>
    </>
  );
}
