"use client";
import React from "react";
import { Home, Volume2, Camera, ThermometerSun, Clock } from "lucide-react";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 bg-black/30 backdrop-blur-md p-2 rounded-2xl justify-between">
          {[
          { id: "overview", label: "Overzicht", icon: Home },
          { id: "stories", label: "Verhalen", icon: Volume2 },
          { id: "camera", label: "Camera & Audio", icon: Camera },
          { id: "sensors", label: "Sensoren", icon: ThermometerSun },
          { id: "log", label: "Nachtlog", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 md:py-3 md:px-5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-white/70 hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm md:text-base">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
