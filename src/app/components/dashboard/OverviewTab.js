"use client";
import React, { useState, useEffect } from "react";
import { Sun, Moon, ThermometerSun, Volume2 } from "lucide-react";

const CORE_BASE_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE_URL) ||
  "";

// ✅ Local date helper (no timezone issues)
function getLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ✅ Parse schedule {date, time} into a local Date object
function parsePlanDate(plan) {
  if (!plan?.date || !plan?.time) return null;
  const [year, month, day] = plan.date.slice(0, 10).split("-").map(Number);
  const [h, m] = plan.time.split(":").map(Number);
  return new Date(year, month - 1, day, h || 0, m || 0, 0, 0);
}

export default function OverviewTab({
  lightOn,
  brightness,
  lightColor,
  toggleLight,
  setBrightness,
  setLightColor,
  temperature,
  humidity,
  lightLevel,
  soundLevel,
  isPlaying,
  currentStory,
  stories,
  // still received, but we’ll prefer today’s schedule from backend
  scheduledTime,
  scheduledStory,
  setActiveTab,
  setIsPlaying,
}) {
  const [todayPlan, setTodayPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // 🧠 Stop current story on Roomie core
  const handleStop = async () => {
    const base = CORE_BASE_URL.replace(/\/$/, "");
    if (!base) {
      console.error("CORE_BASE_URL is not configured");
      setIsPlaying(false);
      return;
    }

    try {
      await fetch(`${base}/api/player/stop`, {
        method: "POST",
      });
      console.log("⏹️ Stop command sent to Roomie core");
    } catch (err) {
      console.error("❌ Failed to send stop command:", err);
    } finally {
      // Update UI state anyway
      setIsPlaying(false);
    }
  };

  // 📅 Load *today's* schedule from backend
  useEffect(() => {
    const loadTodayPlan = async () => {
      try {
        const res = await fetch("/api/schedule/get");
        if (!res.ok) return;
        const data = await res.json();

        const now = new Date();
        const todayStr = getLocalISODate(now);

        const withDates = (Array.isArray(data) ? data : [])
          .map((p) => {
            const d = parsePlanDate(p);
            return { ...p, _dateObj: d };
          })
          .filter(
            (p) =>
              p._dateObj &&
              getLocalISODate(p._dateObj) === todayStr && // only today
              p._dateObj >= now // only upcoming, not past
          )
          .sort((a, b) => a._dateObj - b._dateObj); // nearest first

        setTodayPlan(withDates[0] || null);
      } catch (err) {
        console.error("❌ Failed to load today's schedule:", err);
      } finally {
        setLoadingPlan(false);
      }
    };

    loadTodayPlan();
  }, [stories.length]); // reload if stories list changes (new story etc.)

  // 🎯 Pick which plan to show under "Gepland voor vanavond"
  let plannedStory = null;
  let plannedTimeLabel = "";
  let hasPlan = false;

  if (todayPlan) {
    plannedStory = stories.find((s) => s.id === todayPlan.storyId);
    plannedTimeLabel = todayPlan.time;
    hasPlan = !!(plannedStory && plannedTimeLabel);
  } else if (scheduledStory && scheduledTime) {
    // fallback to props if nothing from backend
    plannedStory = stories.find((s) => s.id === scheduledStory);
    plannedTimeLabel = scheduledTime;
    hasPlan = !!(plannedStory && plannedTimeLabel);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Light Control */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            {lightOn ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Nachtlampje
          </h3>
          <button
            onClick={toggleLight}
            className={`w-14 h-8 rounded-full transition-all ${
              lightOn ? "bg-yellow-400" : "bg-gray-600"
            } relative`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                lightOn ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {lightOn && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">
                Helderheid: {brightness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Kleur</label>
              <div className="flex gap-2">
                {["#FFB366", "#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setLightColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        lightColor === color
                          ? "border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            <div
              className="w-full h-24 rounded-xl transition-all shadow-lg"
              style={{
                backgroundColor: lightColor,
                opacity: brightness / 100,
                boxShadow: `0 0 30px ${lightColor}`,
              }}
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ThermometerSun className="w-5 h-5" />
          Kamer Status
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Temperatuur</span>
            <span className="text-white font-semibold">
              {temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Luchtvochtigheid</span>
            <span className="text-white font-semibold">
              {humidity.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Lichtsterkte</span>
            <span className="text-white font-semibold">{lightLevel}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Geluidsniveau</span>
            <span className="text-white font-semibold">
              {soundLevel.toFixed(0)} dB
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
          <p className="text-green-200 text-sm text-center">
            ✓ Alles is oké
          </p>
        </div>
      </div>

      {/* Current Story */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Huidig Verhaal
        </h3>

        {isPlaying ? (
          <div className="space-y-4">
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
              <p className="text-white font-medium">
                {stories.find((s) => s.id === currentStory)?.name ||
                  "Onbekend verhaal"}
              </p>
              <p className="text-white/70 text-sm mt-1">
                Nu aan het spelen...
              </p>
            </div>
            <button
              onClick={handleStop}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              Stop
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70 mb-4">
              Geen verhaal aan het spelen
            </p>
            <button
              onClick={() => setActiveTab("stories")}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
            >
              Kies een verhaal
            </button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/70 text-sm mb-2">
            Gepland voor vanavond:
          </p>

          {loadingPlan ? (
            <p className="text-white/60 text-sm">Planning laden...</p>
          ) : hasPlan ? (
            <p className="text-white font-medium">
              {plannedTimeLabel} - {plannedStory?.name}
            </p>
          ) : (
            <p className="text-white/60 text-sm">
              Geen planning voor vandaag
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
