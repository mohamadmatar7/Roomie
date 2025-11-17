"use client";
import React, { useState } from "react";
import {
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Target,
} from "lucide-react";

export default function CameraTab({
  cameraOn,
  setCameraOn,
  micOn,
  setMicOn,
  isSpeaking,
  setIsSpeaking,
  soundLevel,
}) {
  const [controlStatus, setControlStatus] = useState("");
  const [controlError, setControlError] = useState("");

  // 🔧 Helpers to talk to Roomie Web API (proxy → core)
  const startCameraMove = async (direction) => {
    setControlError("");
    setControlStatus(`Camera beweegt: ${direction.toUpperCase()}`);

    try {
      const res = await fetch("/api/robot/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: direction, on: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Onbekende fout");
      }
    } catch (err) {
      console.error("Camera move error (on):", err);
      setControlError("Besturing mislukt, controleer de core (Pi).");
      setControlStatus("");
    }
  };

  const stopCameraMove = async (direction) => {
    setControlError("");
    setControlStatus("");

    try {
      const res = await fetch("/api/robot/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: direction, on: false }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Onbekende fout");
      }
    } catch (err) {
      console.error("Camera move error (off):", err);
      setControlError("Stoppen mislukt, controleer de core (Pi).");
    }
  };

  const pulseZoom = async (action) => {
    setControlError("");
    setControlStatus(action === "zoom_in" ? "Zoom in…" : "Zoom uit…");

    try {
      const res = await fetch("/api/robot/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, durationMs: 300 }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Onbekende fout");
      }

      setTimeout(() => setControlStatus(""), 300);
    } catch (err) {
      console.error("Camera zoom error:", err);
      setControlError("Zoom mislukt, controleer de core (Pi).");
      setControlStatus("");
    }
  };

  const resetCamera = async () => {
    setControlError("");
    setControlStatus("Camera reset…");

    try {
      const res = await fetch("/api/robot/reset", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Onbekende fout");
      }

      setTimeout(() => setControlStatus(""), 500);
    } catch (err) {
      console.error("Camera reset error:", err);
      setControlError("Reset mislukt, controleer de core (Pi).");
      setControlStatus("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Camera Section */}
      <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Live Beeld
        </h3>

        <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
          {cameraOn ? (
            <div className="text-white text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">Camera live feed</p>
              <p className="text-white/50 text-sm mt-2">
                Simulatie - echte feed via Raspberry Pi
              </p>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/50">Camera uitgeschakeld</p>
            </div>
          )}
        </div>

        {/* Camera controls under the video */}
        <div className="mt-4 bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Camerabesturing
              </p>
              <p className="text-xs text-white/60">
                Beweeg de camera met de pijlen, zoom in/uit met de knoppen.
              </p>
            </div>
            <button
              onClick={resetCamera}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Target className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Joystick / arrows (continuous) */}
            <div className="col-span-2 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button
                  onPointerDown={() => startCameraMove("up")}
                  onPointerUp={() => stopCameraMove("up")}
                  onPointerLeave={() => stopCameraMove("up")}
                  onPointerCancel={() => stopCameraMove("up")}
                  className="flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div />

                <button
                  onPointerDown={() => startCameraMove("left")}
                  onPointerUp={() => stopCameraMove("left")}
                  onPointerLeave={() => stopCameraMove("left")}
                  onPointerCancel={() => stopCameraMove("left")}
                  className="flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center">
                  <span className="text-[11px] text-white/60">
                    Pan / Tilt
                  </span>
                </div>

                <button
                  onPointerDown={() => startCameraMove("right")}
                  onPointerUp={() => stopCameraMove("right")}
                  onPointerLeave={() => stopCameraMove("right")}
                  onPointerCancel={() => stopCameraMove("right")}
                  className="flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div />
                <button
                  onPointerDown={() => startCameraMove("down")}
                  onPointerUp={() => stopCameraMove("down")}
                  onPointerLeave={() => stopCameraMove("down")}
                  onPointerCancel={() => stopCameraMove("down")}
                  className="flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <div />
              </div>
            </div>

            {/* Zoom controls (pulse) */}
            <div className="flex flex-col gap-2 justify-center">
              <p className="text-xs text-white/70 mb-1">Zoom</p>
              <button
                onClick={() => pulseZoom("zoom_in")}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold py-2 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
                Zoom in
              </button>
              <button
                onClick={() => pulseZoom("zoom_out")}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-slate-950 text-xs font-semibold py-2 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
                Zoom uit
              </button>
            </div>
          </div>

          {controlStatus && (
            <p className="mt-3 text-[11px] text-emerald-300">
              {controlStatus}
            </p>
          )}
          {controlError && (
            <p className="mt-2 text-[11px] text-amber-300">
              {controlError}
            </p>
          )}
        </div>

        {/* Camera on/off */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              cameraOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {cameraOn ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            {cameraOn ? "Camera uit" : "Camera aan"}
          </button>
        </div>
      </div>

      {/* Audio Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-semibold text-white mb-6">Audio</h3>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/70 text-sm mb-2">Microfoon</p>
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                micOn
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {micOn ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
              {micOn ? "Mic uit" : "Mic aan"}
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/70 text-sm mb-2">Intercom</p>
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isSpeaking
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isSpeaking ? "Verbonden" : "Start gesprek"}
            </button>
          </div>

          {micOn && (
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-green-200 text-sm font-medium">
                  Luisteren actief
                </p>
              </div>
              <p className="text-green-200/70 text-xs">
                Je kunt nu met je kind praten
              </p>
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/70 text-sm mb-3">Geluidsniveau kamer</p>
            <div className="flex.items-center gap-3">
              <Volume2 className="w-5 h-5 text-white" />
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-yellow-400 h-full transition-all.duration-300"
                  style={{ width: `${soundLevel}%` }}
                />
              </div>
              <span className="text-white font-medium">
                {soundLevel.toFixed(0)} dB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
