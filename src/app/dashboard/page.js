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

  // Stories
  const [stories, setStories] = useState([
    { id: 1, name: "De Kleine Prins", duration: "8:30", uploaded: "2025-11-08" },
    { id: 2, name: "Slaapliedje", duration: "3:45", uploaded: "2025-11-05" },
    { id: 3, name: "Het Bos Avontuur", duration: "12:15", uploaded: "2025-11-01" },
  ]);
  const [currentStory, setCurrentStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("20:30");
  const [scheduledStory, setScheduledStory] = useState(1);

  // Sensors
  const [temperature, setTemperature] = useState(20.5);
  const [humidity, setHumidity] = useState(45);
  const [lightLevel, setLightLevel] = useState(15);
  const [soundLevel, setSoundLevel] = useState(28);

  // Night log
  const [nightLog, setNightLog] = useState([
    { time: "20:30", event: "Verhaal gestart", type: "story" },
    { time: "20:42", event: "Verhaal beëindigd", type: "story" },
    { time: "23:15", event: "Geluid gedetecteerd (32 dB)", type: "sound" },
    { time: "02:30", event: "Beweging in kamer", type: "motion" },
  ]);

  // Simulate live sensor changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => Math.max(18, Math.min(24, prev + (Math.random() - 0.5) * 0.2)));
      setHumidity((prev) => Math.max(35, Math.min(60, prev + (Math.random() - 0.5) * 2)));
      setSoundLevel((prev) => Math.max(0, Math.min(60, prev + (Math.random() - 0.5) * 5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Authentication check
  // useEffect(() => {
  //   const token = localStorage.getItem("roomieToken");
  //   if (token) setIsAuthenticated(true);
  //   setCheckingAuth(false);
  // }, []);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const res = await fetch("/api/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ username, password }),
  //   });
  //   const data = await res.json();
  //   if (data.success) {
  //     localStorage.setItem("roomieToken", data.token);
  //     setIsAuthenticated(true);
  //   } else {
  //     alert("Ongeldige inloggegevens");
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem("roomieToken");
  //   setIsAuthenticated(false);
  //   setUsername("");
  //   setPassword("");
  // };


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

// ✅ Login function - now sets a secure cookie
const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.success && data.token) {
    // ✅ store token as secure cookie
    document.cookie = `roomieToken=${data.token}; path=/; max-age=28800; secure; samesite=strict`;
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


  const toggleLight = () => setLightOn(!lightOn);
  const playStory = (id) => {
    setCurrentStory(id);
    setIsPlaying(true);
  };

  if (checkingAuth)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading...</p>
      </div>
    );

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
            <label className="block text-white mb-2 text-sm font-medium">Gebruikersnaam</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Voer gebruikersnaam in"
            />
          </div>

          <div className="relative">
            <label className="block text-white mb-2 text-sm font-medium">Wachtwoord</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Voer wachtwoord in"
            />

            {/* 👁 Eye icon button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2  flex items-center justify-center text-white/70 hover:text-white focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {emergencyAlert && <EmergencyAlert setEmergencyAlert={setEmergencyAlert} />}

      <Header handleLogout={handleLogout} setEmergencyAlert={setEmergencyAlert} />

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
              playStory,
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
          <SensorsTab {...{ temperature, humidity, lightLevel, soundLevel }} />
        )}

        {activeTab === "log" && <LogTab nightLog={nightLog} />}
      </div>
    </div>
  );
}
