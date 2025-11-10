"use client";
import React from "react";
import { Mic, Camera, AlertCircle } from "lucide-react";

export default function EmergencyAlert({ setEmergencyAlert }) {
  return (
    <div className="fixed inset-0 bg-red-600/90 backdrop-blur-sm z-50 flex items-center justify-center animate-pulse">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">NOODOPROEP!</h2>
          <p className="text-gray-700 mb-6">Je kind heeft de noodknop ingedrukt</p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setEmergencyAlert(false);
              }}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start gesprek
            </button>

            <button
              onClick={() => setEmergencyAlert(false)}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Camera openen
            </button>

            <button
              onClick={() => setEmergencyAlert(false)}
              className="w-full bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-400 transition-all"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
