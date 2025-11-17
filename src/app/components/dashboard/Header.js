"use client";
import React from "react";
import { Bell, LogOut, Moon } from "lucide-react";

export default function Header({ handleLogout, setEmergencyAlert, coreStatus }) {
  const { online, checking } = coreStatus || {};

  // Derive UI state for the status pill
  let statusText = "Roomie offline";
  let pillClass =
    "bg-red-500/10 border-red-400/40 text-red-100";
  let dotClass = "bg-red-400";

  if (checking) {
    statusText = "Verbinding controleren…";
    pillClass =
      "bg-yellow-500/10 border-yellow-400/40 text-yellow-100";
    dotClass = "bg-yellow-300 animate-pulse";
  } else if (online) {
    statusText = "Roomie actief";
    pillClass =
      "bg-emerald-500/10 border-emerald-400/40 text-emerald-100";
    dotClass = "bg-emerald-400 animate-ping";
  }

  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Roomie Dashboard
            </h1>
            <p className="text-sm text-purple-200">
              Kamer van Manisa en Sam
            </p>
          </div>
        </div>

        {/* Right Section - Status + Buttons (responsive) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:justify-end">
          {/* Smart status pill */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <div
              className={
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm shadow-sm " +
                pillClass
              }
            >
              <span
                className={
                  "w-2 h-2 rounded-full inline-block " + dotClass
                }
              />
              <span className="whitespace-nowrap">{statusText}</span>
            </div>
          </div>

          {/* Buttons (always on one line on larger screens) */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => setEmergencyAlert(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm text-sm sm:text-base"
            >
              <Bell className="w-4 h-4" />
              <span>Test Nood</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
