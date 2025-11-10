"use client";
import React from "react";
import { Upload, Play } from "lucide-react";

export default function StoriesTab({
  stories,
  setStories,
  playStory,
  scheduledTime,
  setScheduledTime,
  scheduledStory,
  setScheduledStory,
}) {
  const handleStoryUpload = () => {
    const newStory = {
      id: stories.length + 1,
      name: `Nieuw Verhaal ${stories.length + 1}`,
      duration: "0:00",
      uploaded: new Date().toISOString().split("T")[0],
    };
    setStories([...stories, newStory]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Story Library */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Verhalen Bibliotheek</h3>
          <button
            onClick={handleStoryUpload}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        <div className="space-y-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{story.name}</h4>
                  <p className="text-white/60 text-sm">
                    {story.duration} • {story.uploaded}
                  </p>
                </div>
                <button
                  onClick={() => playStory(story.id)}
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all"
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-semibold text-white mb-6">Planning</h3>

        <div className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2 block">Tijd</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">Verhaal</label>
            <select
              value={scheduledStory}
              onChange={(e) => setScheduledStory(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {stories.map((story) => (
                <option key={story.id} value={story.id} className="bg-slate-800">
                  {story.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
              <p className="text-white font-medium mb-2">Dagelijkse herhaling</p>
              <p className="text-white/70 text-sm">
                Elke avond om {scheduledTime}
              </p>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
            Planning opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
