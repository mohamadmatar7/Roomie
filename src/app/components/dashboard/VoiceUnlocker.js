"use client";
import { useEffect } from "react";

export default function VoiceUnlocker() {
  useEffect(() => {
    const unlock = () => {
      if (window.responsiveVoice && !window.__voiceUnlocked) {
        // Play a silent unlock phrase (unheard)
        window.responsiveVoice.speak(" ", "UK English Female");
        window.__voiceUnlocked = true;
        console.log("🔓 Voice unlocked and ready!");
        window.removeEventListener("click", unlock);
      }
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  return null;
}
