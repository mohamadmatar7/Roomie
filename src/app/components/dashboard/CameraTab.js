"use client";
import React from "react";
import { Camera, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";

export default function CameraTab({
  cameraOn,
  setCameraOn,
  micOn,
  setMicOn,
  isSpeaking,
  setIsSpeaking,
  soundLevel,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Camera Section */}
      <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-semibold text-white mb-6">Live Beeld</h3>

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

        <div className="flex gap-3">
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              cameraOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {cameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
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
              {micOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
                <p className="text-green-200 text-sm font-medium">Luisteren actief</p>
              </div>
              <p className="text-green-200/70 text-xs">
                Je kunt nu met je kind praten
              </p>
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/70 text-sm mb-3">Geluidsniveau kamer</p>
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-white" />
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${soundLevel}%` }}
                />
              </div>
              <span className="text-white font-medium">{soundLevel.toFixed(0)} dB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
