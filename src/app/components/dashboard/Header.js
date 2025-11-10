"use client";
import React from "react";
import { Bell, LogOut, Moon } from "lucide-react";

export default function Header({ handleLogout, setEmergencyAlert }) {
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
            <p className="text-sm text-purple-200">Kamer van Manisa en Sam</p>
          </div>
        </div>

        {/* Right Section - Buttons (always in one line) */}
        <div className="flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => setEmergencyAlert(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm text-sm sm:text-base"
            >
              <Bell className="w-4 h-4" />
              <span>Test Nood</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base"
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
