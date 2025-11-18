"use client";
import React, { useState, useEffect } from "react";
import { Moon, Eye, EyeOff } from "lucide-react";
import Header from "../components/dashboard/Header";
import Tabs from "../components/dashboard/Tabs";
import OverviewTab from "../components/dashboard/OverviewTab";
import StoriesTab from "../components/dashboard/StoriesTab";
import CameraTab from "../components/dashboard/CameraTab";
import SensorsTab from "../components/dashboard/SensorsTab";
import LogTab from "../components/dashboard/LogTab";
import EmergencyAlert from "../components/dashboard/EmergencyAlert";
// ❌ VoiceUnlocker is no longer needed because audio plays only on the core
// import VoiceUnlocker from "../components/dashboard/VoiceUnlocker";

export default function RoomieDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState("overview");

  // Device & sensor states
  const [lightOn, setLightOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [lightColor, setLightColor] = useState("#FFB366");
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Stories (from backend)
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  // Player / schedule state in the dashboard
  const [currentStory, setCurrentStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("20:30");
  const [scheduledStory, setScheduledStory] = useState(1);

  // Sensors
  const [temperature, setTemperature] = useState(20.5);
  const [humidity, setHumidity] = useState(45);
  const [lightLevel, setLightLevel] = useState(15);
  const [soundLevel, setSoundLevel] = useState(28);

  // Night log (dummy for now)
  const [nightLog, setNightLog] = useState([
    { time: "20:30", event: "Verhaal gestart", type: "story" },
    { time: "20:42", event: "Verhaal beëindigd", type: "story" },
    { time: "23:15", event: "Geluid gedetecteerd (32 dB)", type: "sound" },
    { time: "02:30", event: "Beweging in kamer", type: "motion" },
  ]);

  // 🌐 Core API base URL (public, coming from Vercel env)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Small state for core/Roomie status (used in header badge)
  const [coreStatus, setCoreStatus] = useState({
    online: false,
    checking: true,
  });

  // 🔁 Load stories once from Next API (which should proxy to the core)
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/story/list");
        const data = await res.json();

        // Map DB stories to frontend format
        const mapped = data.map((s) => ({
          id: s.id,
          name: s.title,
          text: s.refinedText || s.originalText,
          duration: s.duration || "0:00",
          uploaded: new Date(s.createdAt).toISOString().split("T")[0],
        }));

        setStories(mapped);
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoadingStories(false);
      }
    };

    fetchStories();
  }, []);

  // 📈 Simulate live sensor changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) =>
        Math.max(18, Math.min(24, prev + (Math.random() - 0.5) * 0.2))
      );
      setHumidity((prev) =>
        Math.max(35, Math.min(60, prev + (Math.random() - 0.5) * 2))
      );
      setSoundLevel((prev) =>
        Math.max(0, Math.min(60, prev + (Math.random() - 0.5) * 5))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🌡️💡🎤 Fetch real sensor data from the core API (light + optional others)
  useEffect(() => {
    if (!API_BASE_URL) {
      console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
      return;
    }

    let isMounted = true;

    const fetchSensorsFromCore = async () => {
      try {
        // Adjust this path to your core sensors endpoint if needed
        const res = await fetch(`${API_BASE_URL}/api/sensors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Core sensors request failed: ${res.status}`);
        }

        const data = await res.json();
        if (!isMounted) return;

        // Temperature & humidity (if provided by core)
        if (typeof data.temperature === "number") {
          setTemperature(data.temperature);
        }

        if (typeof data.humidity === "number") {
          setHumidity(data.humidity);
        }

        // Light: map raw visible value to 0–100% for UI
        if (data.light) {
          const visibleRaw =
            typeof data.light.visible === "number"
              ? data.light.visible
              : typeof data.light.ch0 === "number"
              ? data.light.ch0
              : 0;

          // Simple normalization: assume 0–500 as practical range
          const normalized = Math.max(
            0,
            Math.min(100, (visibleRaw / 500) * 100)
          );

          setLightLevel(Math.round(normalized));
        }

        // Sound level in dB (if provided)
        if (data.sound && typeof data.sound.levelDb === "number") {
          setSoundLevel(data.sound.levelDb);
        }
      } catch (err) {
        console.error("Failed to fetch sensors from core:", err);
      }
    };

    // Initial fetch
    fetchSensorsFromCore();
    // Poll every 5 seconds (reasonable, not too frequent)
    const intervalId = setInterval(fetchSensorsFromCore, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [API_BASE_URL]);

  // 🔐 Authentication check via secure cookie + /api/validate
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/validate", { method: "GET" });
        const data = await res.json();
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Login function - stores token as secure cookie
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success && data.token) {
      document.cookie =
        "roomieToken=" +
        data.token +
        "; path=/; max-age=28800; secure; samesite=strict";
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  // ✅ Logout function - clears cookie and resets auth state
  const handleLogout = () => {
    document.cookie = "roomieToken=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
  };

  // 💡 Light toggle (later can be wired to core via API)
  const toggleLight = () => setLightOn((prev) => !prev);

  // ▶️ Local helper to mark which story is “current”
  const playStory = (id) => {
    setCurrentStory(id);
    setIsPlaying(true);
    // Later we can call `${API_BASE_URL}/api/player/play` from StoriesTab,
    // here we only sync UI.
  };

  // 🌍 Ping the core regularly to show "Roomie online/offline" in the header
  useEffect(() => {
    const pingCore = async () => {
      if (!API_BASE_URL) {
        // If base URL is missing, just mark offline but stop "checking" spinner
        setCoreStatus((prev) => ({ ...prev, online: false, checking: false }));
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/player/status`);
        if (!res.ok) throw new Error("Bad status");
        const data = await res.json().catch(() => ({}));

        // We treat a successful response as "online"
        setCoreStatus({
          online: !!data.ok,
          checking: false,
        });
      } catch (err) {
        console.error("Core status check failed:", err);
        setCoreStatus((prev) => ({ ...prev, online: false, checking: false }));
      }
    };

    // First immediate ping
    pingCore();
    // Then ping every 10 seconds
    const interval = setInterval(pingCore, 10000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  // ⏳ While checking auth
  if (checkingAuth)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading...</p>
      </div>
    );

  // 🔒 Not authenticated → login screen
  if (!isAuthenticated)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Roomie</h1>
            <p className="text-purple-200">Jouw slimme kamer vriend</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Voer gebruikersnaam in"
              />
            </div>

            <div className="relative">
              <label className="block text-white mb-2 text-sm font-medium">
                Wachtwoord
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Voer wachtwoord in"
              />

              {/* 👁 Toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/70 hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    );

  // ✅ Authenticated → main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* No more VoiceUnlocker, audio is fully handled on the core */}
      {emergencyAlert && (
        <EmergencyAlert setEmergencyAlert={setEmergencyAlert} />
      )}

      <Header
        handleLogout={handleLogout}
        setEmergencyAlert={setEmergencyAlert}
        coreStatus={coreStatus}
      />

      <div className="max-w-7xl mx-auto p-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "overview" && (
          <OverviewTab
            {...{
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
              scheduledTime,
              scheduledStory,
              setActiveTab,
              setIsPlaying,
            }}
          />
        )}

        {activeTab === "stories" && (
          <StoriesTab
            {...{
              stories,
              setStories,
              playStory, // can be used to sync "current story" with overview
              scheduledTime,
              setScheduledTime,
              scheduledStory,
              setScheduledStory,
            }}
          />
        )}

        {activeTab === "camera" && (
          <CameraTab
            {...{
              cameraOn,
              setCameraOn,
              micOn,
              setMicOn,
              isSpeaking,
              setIsSpeaking,
              soundLevel,
            }}
          />
        )}

        {activeTab === "sensors" && (
          <SensorsTab
            {...{ temperature, humidity, lightLevel, soundLevel }}
          />
        )}

        {activeTab === "log" && <LogTab nightLog={nightLog} />}
      </div>
    </div>
  );
}
