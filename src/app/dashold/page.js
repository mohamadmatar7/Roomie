"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Upload, Play, Pause, Sun, Moon, Bell, ThermometerSun, Droplets, Volume2, AlertCircle, Clock, Calendar, Home, Settings, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [lightOn, setLightOn] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [lightColor, setLightColor] = useState('#FFB366');
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [stories, setStories] = useState([
    { id: 1, name: 'De Kleine Prins', duration: '8:30', uploaded: '2025-11-08' },
    { id: 2, name: 'Slaapliedje', duration: '3:45', uploaded: '2025-11-05' },
    { id: 3, name: 'Het Bos Avontuur', duration: '12:15', uploaded: '2025-11-01' }
  ]);
  const [currentStory, setCurrentStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('20:30');
  const [scheduledStory, setScheduledStory] = useState(1);
  
  // Sensor data
  const [temperature, setTemperature] = useState(20.5);
  const [humidity, setHumidity] = useState(45);
  const [lightLevel, setLightLevel] = useState(15);
  const [soundLevel, setSoundLevel] = useState(28);
  
  // Night log
  const [nightLog, setNightLog] = useState([
    { time: '20:30', event: 'Verhaal gestart', type: 'story' },
    { time: '20:42', event: 'Verhaal beëindigd', type: 'story' },
    { time: '23:15', event: 'Geluid gedetecteerd (32 dB)', type: 'sound' },
    { time: '02:30', event: 'Beweging in kamer', type: 'motion' }
  ]);

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(18, Math.min(24, prev + (Math.random() - 0.5) * 0.2)));
      setHumidity(prev => Math.max(35, Math.min(60, prev + (Math.random() - 0.5) * 2)));
      setSoundLevel(prev => Math.max(0, Math.min(60, prev + (Math.random() - 0.5) * 5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);


useEffect(() => {
  const token = localStorage.getItem("roomieToken");
  if (token) {
    setIsAuthenticated(true);
  }
  setCheckingAuth(false);
}, []);



  const handleLogin = async (e) => {
  e.preventDefault();
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
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
  setUsername('');
  setPassword('');
};



  const toggleLight = () => {
    setLightOn(!lightOn);
  };

  const handleStoryUpload = () => {
    const newStory = {
      id: stories.length + 1,
      name: `Nieuw Verhaal ${stories.length + 1}`,
      duration: '0:00',
      uploaded: new Date().toISOString().split('T')[0]
    };
    setStories([...stories, newStory]);
  };

  const playStory = (storyId) => {
    setCurrentStory(storyId);
    setIsPlaying(true);
  };

  const toggleEmergency = () => {
    setEmergencyAlert(!emergencyAlert);
  };

if (checkingAuth) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white animate-pulse">
      <h2 className="text-2xl font-semibold">Roomie wordt geladen...</h2>
    </div>
  );
}



  if (!isAuthenticated) {
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
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Voer gebruikersnaam in"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Emergency Alert Overlay */}
      {emergencyAlert && (
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
                    setMicOn(true);
                    setIsSpeaking(true);
                    setEmergencyAlert(false);
                  }}
                  className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Start gesprek
                </button>
                
                <button
                  onClick={() => {
                    setCameraOn(true);
                    setEmergencyAlert(false);
                  }}
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
      )}

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Roomie Dashboard</h1>
              <p className="text-sm text-purple-200">Kamer van Manisa en Sam</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleEmergency}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Test Nood
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 bg-black/30 backdrop-blur-md p-2 rounded-2xl">
          {[
            { id: 'overview', label: 'Overzicht', icon: Home },
            { id: 'stories', label: 'Verhalen', icon: Volume2 },
            { id: 'camera', label: 'Camera & Audio', icon: Camera },
            { id: 'sensors', label: 'Sensoren', icon: ThermometerSun },
            { id: 'log', label: 'Nachtlog', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Light Control */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  {lightOn ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  Nachtlampje
                </h3>
                <button
                  onClick={toggleLight}
                  className={`w-14 h-8 rounded-full transition-all ${
                    lightOn ? 'bg-yellow-400' : 'bg-gray-600'
                  } relative`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                      lightOn ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              
              {lightOn && (
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Helderheid: {brightness}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Kleur</label>
                    <div className="flex gap-2">
                      {['#FFB366', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'].map(color => (
                        <button
                          key={color}
                          onClick={() => setLightColor(color)}
                          className={`w-10 h-10 rounded-full border-2 ${
                            lightColor === color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div
                    className="w-full h-24 rounded-xl transition-all shadow-lg"
                    style={{
                      backgroundColor: lightColor,
                      opacity: brightness / 100,
                      boxShadow: `0 0 30px ${lightColor}`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ThermometerSun className="w-5 h-5" />
                Kamer Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Temperatuur</span>
                  <span className="text-white font-semibold">{temperature.toFixed(1)}°C</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Luchtvochtigheid</span>
                  <span className="text-white font-semibold">{humidity.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Lichtsterkte</span>
                  <span className="text-white font-semibold">{lightLevel}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Geluidsniveau</span>
                  <span className="text-white font-semibold">{soundLevel.toFixed(0)} dB</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-green-200 text-sm text-center">✓ Alles is oké</p>
              </div>
            </div>

            {/* Current Story */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Huidig Verhaal
              </h3>
              
              {isPlaying ? (
                <div className="space-y-4">
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                    <p className="text-white font-medium">
                      {stories.find(s => s.id === currentStory)?.name}
                    </p>
                    <p className="text-white/70 text-sm mt-1">Nu aan het spelen...</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Stop
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/70 mb-4">Geen verhaal aan het spelen</p>
                  <button
                    onClick={() => setActiveTab('stories')}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Kies een verhaal
                  </button>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm mb-2">Gepland voor vanavond:</p>
                <p className="text-white font-medium">
                  {scheduledTime} - {stories.find(s => s.id === scheduledStory)?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {stories.map(story => (
                  <div
                    key={story.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{story.name}</h4>
                        <p className="text-white/60 text-sm">{story.duration} • {story.uploaded}</p>
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
                    {stories.map(story => (
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
        )}

        {/* Camera & Audio Tab */}
        {activeTab === 'camera' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Live Beeld</h3>
              
              <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
                {cameraOn ? (
                  <div className="text-white text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-white/50" />
                    <p className="text-white/70">Camera live feed</p>
                    <p className="text-white/50 text-sm mt-2">Simulatie - echte feed via Raspberry Pi</p>
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
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {cameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  {cameraOn ? 'Camera uit' : 'Camera aan'}
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Audio</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-2">Microfoon</p>
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      micOn
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {micOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {micOn ? 'Mic uit' : 'Mic aan'}
                  </button>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-2">Intercom</p>
                  <button
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isSpeaking
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isSpeaking ? 'Verbonden' : 'Start gesprek'}
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
        )}

        {/* Sensors Tab */}
        {activeTab === 'sensors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <ThermometerSun className="w-6 h-6" />
                Temperatuur
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">
                  {temperature.toFixed(1)}°C
                </div>
                <p className="text-white/60">
                  {temperature < 19 ? 'Koud' : temperature > 22 ? 'Warm' : 'Comfortabel'}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">16°C</span>
                  <span className="text-white/60">18°C</span>
                  <span className="text-white/60">20°C</span>
                  <span className="text-white/60">22°C</span>
                  <span className="text-white/60">24°C</span>
                </div>
                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 via-green-400 to-red-400 h-full transition-all duration-500"
                    style={{ width: `${((temperature - 16) / 8) * 100}%` }}
                  />
                </div>
              </div>
              
              {temperature > 22 && (
                <div className="mt-4 bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                  <p className="text-orange-200 text-sm">💡 Tip: Het is wat warm. Overweeg een raam te openen.</p>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Droplets className="w-6 h-6" />
                Luchtvochtigheid
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">
                  {humidity.toFixed(0)}%
                </div>
                <p className="text-white/60">
                  {humidity < 40 ? 'Te droog' : humidity > 60 ? 'Te vochtig' : 'Ideaal'}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">30%</span>
                  <span className="text-white/60">40%</span>
                  <span className="text-white/60">50%</span>
                  <span className="text-white/60">60%</span>
                  <span className="text-white/60">70%</span>
                </div>
                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 h-full transition-all duration-500"
                    style={{ width: `${((humidity - 30) / 40) * 100}%` }}
                  />
                </div>
              </div>
              
              {humidity >= 40 && humidity <= 60 && (
                <div className="mt-4 bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                  <p className="text-green-200 text-sm">✓ Perfecte luchtvochtigheid voor slapen</p>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6" />
                Lichtsterkte
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">
                  {lightLevel}%
                </div>
                <p className="text-white/60">
                  {lightLevel < 20 ? 'Donker' : lightLevel < 50 ? 'Gedimpt' : 'Licht'}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Auto helderheid</span>
                    <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                    </div>
                  </div>
                  <p className="text-white/50 text-xs">
                    Nachtlampje past zich aan aan omgevingslicht
                  </p>
                </div>
                
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <p className="text-blue-200 text-sm">💡 Donkere kamer - ideaal voor slapen</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Volume2 className="w-6 h-6" />
                Geluid Monitor
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">
                  {soundLevel.toFixed(0)} <span className="text-3xl">dB</span>
                </div>
                <p className="text-white/60">
                  {soundLevel < 30 ? 'Stil' : soundLevel < 50 ? 'Normaal' : 'Luid'}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-3">Geluidsniveau tijd</p>
                  <div className="flex items-end gap-1 h-20">
                    {[25, 30, 28, 32, 35, 30, 28, 40, 35, 28, 30, 28].map((level, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                        style={{ height: `${(level / 60) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                {soundLevel < 35 && (
                  <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                    <p className="text-green-200 text-sm">✓ Rustige omgeving</p>
                  </div>
                )}
                
                {soundLevel > 50 && (
                  <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30">
                    <p className="text-yellow-200 text-sm">⚠️ Verhoogd geluidsniveau gedetecteerd</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Night Log Tab */}
        {activeTab === 'log' && (
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
                        {log.type === 'story' && <Volume2 className="w-5 h-5 text-purple-300" />}
                        {log.type === 'sound' && <AlertCircle className="w-5 h-5 text-yellow-300" />}
                        {log.type === 'motion' && <Camera className="w-5 h-5 text-blue-300" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{log.event}</h4>
                          <span className="text-white/60 text-sm">{log.time}</span>
                        </div>
                        <p className="text-white/50 text-sm">
                          {log.type === 'story' && '📖 Verhaal activiteit'}
                          {log.type === 'sound' && '🔊 Geluid detectie'}
                          {log.type === 'motion' && '👁️ Beweging gedetecteerd'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 transition-all">
                Laad meer gebeurtenissen
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Nacht Samenvatting</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Slaapkwaliteit</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-white font-semibold">85%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Totale gebeurtenissen</p>
                    <p className="text-white text-2xl font-bold">{nightLog.length}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Gem. temperatuur</p>
                    <p className="text-white text-2xl font-bold">20.5°C</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Rustige periodes</p>
                    <p className="text-white text-2xl font-bold">6.5u</p>
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
        )}
      </div>
    </div>
  );
}