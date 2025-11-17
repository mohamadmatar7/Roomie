"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Trash2, Recycle, CalendarDays, Clock } from "lucide-react";
import { motion } from "framer-motion";
import ConfirmModal from "./ConfirmModal";

// ✅ Helper: get local date as YYYY-MM-DD
function getLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ParentPlanningSection({ refreshToken }) {
  const [plans, setPlans] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [weekDays, setWeekDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(getLocalISODate());

  // 🧱 Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // 📅 Generate 7 Days (Today + Next 6) using local date
  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      d.setDate(d.getDate() + i);
      days.push({
        date: getLocalISODate(d),
        label: d.toLocaleDateString("nl-NL", { weekday: "short" }),
      });
    }
    setWeekDays(days);
  }, []);

  // 🧩 Load Plans
  const loadPlans = async () => {
    try {
      const res = await fetch("/api/schedule/get");
      if (!res.ok) return;
      const data = await res.json();

      // ✅ Filter out old/past plans (date+time earlier than now)
      const now = new Date();
      const upcoming = (data || []).filter((p) => {
        if (!p.date || !p.time) return false;

        const [year, month, day] = p.date.slice(0, 10).split("-").map(Number);
        const [hours, minutes] = p.time.split(":").map(Number);

        const planDate = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
        return planDate > now;
      });

      setPlans(Array.isArray(upcoming) ? upcoming : []);
    } catch {
      console.error("❌ Failed to load plans");
    }
  };

  useEffect(() => {
    loadPlans();
  }, [refreshToken]);

  // 🗑️ Open Delete Confirmation
  const confirmDeletePlan = (id) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  // 🗑️ Delete Plan (confirmed)
  const deletePlan = async () => {
    const id = pendingDeleteId;
    if (!id) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/schedule/delete?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    }
  };

  // ♻️ Clear All Plans (open modal)
  const confirmClearAll = () => {
    setShowClearModal(true);
  };

  // ♻️ Clear All Plans (confirmed)
  const clearAllPlans = async () => {
    try {
      setClearing(true);
      const res = await fetch("/api/schedule/clear", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPlans([]);
    } catch (err) {
      console.error("❌ Clear failed:", err);
    } finally {
      setClearing(false);
      setShowClearModal(false);
    }
  };

  // 🧭 Week Timeline — clickable day selection
  const renderWeekTimeline = () => (
    <div className="flex justify-between items-center mb-8 px-2">
      {weekDays.map((day, idx) => {
        const todayStr = getLocalISODate();
        const isToday = day.date === todayStr;
        const isSelected = day.date === selectedDay;
        const hasPlan = plans.some(
          (p) => (p.date || "").slice(0, 10) === day.date
        );

        return (
          <div
            key={day.date}
            className="flex flex-col items-center w-full relative cursor-pointer select-none"
            onClick={() => setSelectedDay(day.date)}
          >
            <motion.div
              animate={{
                scale: isSelected ? 1.3 : isToday ? 1.1 : 1,
                backgroundColor: isSelected
                  ? "rgba(168, 85, 247, 0.9)"
                  : hasPlan
                  ? "rgba(59,130,246,0.8)"
                  : "rgba(255,255,255,0.1)",
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg ${
                isSelected
                  ? "ring-4 ring-purple-400"
                  : isToday
                  ? "ring-2 ring-purple-300"
                  : ""
              }`}
            >
              {day.label.charAt(0).toUpperCase()}
            </motion.div>
            {idx !== weekDays.length - 1 && (
              <div className="absolute top-4 right-[-50%] w-full h-[2px] bg-white/20 -z-10" />
            )}
          </div>
        );
      })}
    </div>
  );

  // 📆 Filter only plans for selected day
  const filteredPlans = plans.filter(
    (p) => (p.date || "").slice(0, 10) === selectedDay
  );

  // 📨 No Plans
  if (!plans.length)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center text-white/70"
      >
        <CalendarDays className="w-6 h-6 mx-auto mb-2 opacity-70" />
        Geen geplande verhalen 📭
      </motion.div>
    );

  // 🧩 Full Week Planning (Only selected day visible)
  return (
    <>
      {/* 🧱 Delete Single Modal */}
      <ConfirmModal
        show={showDeleteModal}
        type="delete"
        message="Weet je zeker dat je deze planning wilt verwijderen?"
        onConfirm={deletePlan}
        onCancel={() => setShowDeleteModal(false)}
        loading={deletingId !== null}
      />

      {/* 🧱 Clear All Modal */}
      <ConfirmModal
        show={showClearModal}
        type="delete"
        message="Weet je zeker dat je ALLE planningen wilt verwijderen?"
        onConfirm={clearAllPlans}
        onCancel={() => setShowClearModal(false)}
        loading={clearing}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            Planning Overzicht
          </h3>
          <button
            onClick={confirmClearAll}
            disabled={clearing}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm px-3 py-2 rounded-lg shadow transition-all"
          >
            {clearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Recycle className="w-4 h-4" />
            )}
            {clearing ? "Bezig..." : "Alles verwijderen"}
          </button>
        </div>

        {/* 🔹 Week Indicator (clickable) */}
        {renderWeekTimeline()}

        {/* 🔸 Selected Day Plans */}
        <div className="space-y-6">
          {filteredPlans.length > 0 ? (
            <div>
              <h4 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                {new Date(selectedDay).toLocaleDateString("nl-NL", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h4>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPlans.map((p, i) => {
                  const dayColors = [
                    "from-pink-500/30",
                    "from-purple-500/30",
                    "from-blue-500/30",
                    "from-green-500/30",
                    "from-yellow-500/30",
                    "from-orange-500/30",
                    "from-cyan-500/30",
                  ];
                  const color = dayColors[i % dayColors.length];

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative bg-gradient-to-br ${color} to-transparent border border-white/10 rounded-xl p-4 text-white/90 shadow-sm hover:shadow-md transition`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white mb-1">
                            {p.story?.title || "Onbekend Verhaal"}
                          </h4>
                          <p className="text-xs text-white/60 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white/40" />
                            {new Date(p.date).toLocaleDateString("nl-NL", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            • {p.time}
                          </p>
                        </div>
                        <button
                          onClick={() => confirmDeletePlan(p.id)}
                          disabled={deletingId === p.id}
                          className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow transition"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-white/70">
              Geen planningen voor deze dag 📭
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
