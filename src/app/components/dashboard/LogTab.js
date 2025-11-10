"use client";
import React from "react";
import { Calendar, Volume2, AlertCircle, Camera } from "lucide-react";

export default function LogTab({ nightLog }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Nachtlog</h3>
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Vandaag</span>
          </div>
        </div>

        <div className="space-y-3">
          {nightLog.map((log, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  {log.type === "story" && <Volume2 className="w-5 h-5 text-purple-300" />}
                  {log.type === "sound" && <AlertCircle className="w-5 h-5 text-yellow-300" />}
                  {log.type === "motion" && <Camera className="w-5 h-5 text-blue-300" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium">{log.event}</h4>
                    <span className="text-white/60 text-sm">{log.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 transition-all">
          Laad meer gebeurtenissen
        </button>
      </div>

      {/* Summary */}
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Nacht Samenvatting</h3>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Slaapkwaliteit</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
                <span className="text-white font-semibold">85%</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Totale gebeurtenissen</p>
              <p className="text-white text-2xl font-bold">{nightLog.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-white font-semibold mb-3">💡 Inzichten</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>✓ Goede slaaptemperatuur</li>
            <li>✓ Weinig verstoringen</li>
            <li>✓ Verhaal goed ontvangen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}