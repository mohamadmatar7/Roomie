"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import OverviewTab from "./OverviewTab";
import StoriesTab from "./StoriesTabOld";
import CameraTab from "./CameraTab";
import SensorsTab from "./SensorsTab";
import LogTab from "./LogTab";
import EmergencyAlert from "./EmergencyAlert";
import { Moon } from "lucide-react";

export default function RoomieDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Device / Room state
  const [lightOn, setLightOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [lightColor, setLightColor] = useState("#FFB366");
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sensor data
  const [temperature, setTemperature] = useState(20.5);
  const [humidity, setHumidity] = useState(45);
  const [lightLevel, setLightLevel] = useState(15);
  const [soundLevel, setSoundLevel] = useState(28);

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

  // Night log
  const [nightLog, setNightLog] = useState([
    { time: "20:30", event: "Verhaal gestart", type: "story" },
    { time: "20:42", event: "Verhaal beëindigd", type: "story" },
    { time: "23:15", event: "Geluid gedetecteerd (32 dB)", type: "sound" },
    { time: "02:30", event: "Beweging in kamer", type: "motion" },
  ]);

  // Simulate sensor updates
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

  // ✅ Auth check
  useEffect(() => {
    const token = localStorage.getItem("roomieToken");
    if (token) setIsAuthenticated(true);
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("roomieToken", data.token);
      setIsAuthenticated(true);
    } else {
      alert("Ongeldige inloggegevens");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("roomieToken");
    setIsAuthenticated(false);
  };

  // Loading screen
  if (checkingAuth)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading...</p>
      </div>
    );

  // Login screen
  if (!isAuthenticated)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Moon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Roomie</h1>
            <p className="text-purple-200">Jouw slimme kamer-vriend</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Gebruikersnaam</label>
              <input
                name="username"
                type="text"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Voer gebruikersnaam in"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Wachtwoord</label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Voer wachtwoord in"
              />
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

  // Dashboard screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {emergencyAlert && <EmergencyAlert setEmergencyAlert={setEmergencyAlert} />}
      <Header handleLogout={handleLogout} setEmergencyAlert={setEmergencyAlert} />
      <div className="max-w-7xl mx-auto p-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "overview" && (
          <OverviewTab
            lightOn={lightOn}
            brightness={brightness}
            lightColor={lightColor}
            toggleLight={() => setLightOn(!lightOn)}
            setBrightness={setBrightness}
            setLightColor={setLightColor}
            temperature={temperature}
            humidity={humidity}
            lightLevel={lightLevel}
            soundLevel={soundLevel}
            isPlaying={isPlaying}
            currentStory={currentStory}
            scheduledTime={scheduledTime}
            scheduledStory={scheduledStory}
            stories={stories}
            setActiveTab={setActiveTab}
            setIsPlaying={setIsPlaying}
          />
        )}
        {activeTab === "stories" && (
          <StoriesTab
            stories={stories}
            setStories={setStories}
            playStory={(id) => {
              setCurrentStory(id);
              setIsPlaying(true);
            }}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
            scheduledStory={scheduledStory}
            setScheduledStory={setScheduledStory}
          />
        )}
        {activeTab === "camera" && (
          <CameraTab
            cameraOn={cameraOn}
            setCameraOn={setCameraOn}
            micOn={micOn}
            setMicOn={setMicOn}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
            soundLevel={soundLevel}
          />
        )}
        {activeTab === "sensors" && (
          <SensorsTab
            temperature={temperature}
            humidity={humidity}
            lightLevel={lightLevel}
            soundLevel={soundLevel}
          />
        )}
        {activeTab === "log" && <LogTab nightLog={nightLog} />}
      </div>
    </div>
  );
}
