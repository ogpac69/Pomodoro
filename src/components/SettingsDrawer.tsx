import { useTimerStore, ThemeType } from '../store/timerStore';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { settings, updateSettings, theme, setTheme, clearHistory, sessionHistory, totalFocusTime } = useTimerStore();

  const themes: { type: ThemeType; name: string; colors: string }[] = [
    { type: 'dark', name: 'Dark', colors: 'from-[#1a1a2e] to-[#16213e]' },
    { type: 'light', name: 'Light', colors: 'from-[#f8f9fa] to-[#ffffff]' },
    { type: 'ocean', name: 'Ocean', colors: 'from-[#667eea] to-[#764ba2]' },
    { type: 'forest', name: 'Forest', colors: 'from-[#134e5e] to-[#71b280]' },
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleBackdropClick}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#16213e] z-50 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Theme Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold opacity-60 mb-4">THEME</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(({ type, name, colors }) => (
                <button
                  key={type}
                  onClick={() => setTheme(type)}
                  className={`relative p-4 rounded-xl bg-gradient-to-br ${colors} transition-all duration-200 hover:scale-105 ${theme === type ? 'ring-2 ring-white ring-offset-2 ring-offset-[#16213e]' : ''}`}
                >
                  <span className="text-sm font-medium text-white">{name}</span>
                  {theme === type && (
                    <svg className="absolute top-2 right-2 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Durations */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold opacity-60 mb-4">DURATIONS (MINUTES)</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Focus</label>
                  <span className="text-sm font-mono">{settings.focusDuration}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={settings.focusDuration}
                  onChange={(e) => updateSettings({ focusDuration: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#e94560]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Short Break</label>
                  <span className="text-sm font-mono">{settings.shortBreakDuration}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => updateSettings({ shortBreakDuration: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#4ade80]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Long Break</label>
                  <span className="text-sm font-mono">{settings.longBreakDuration}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => updateSettings({ longBreakDuration: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#60a5fa]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Rounds until Long Break</label>
                  <span className="text-sm font-mono">{settings.roundsUntilLongBreak}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={settings.roundsUntilLongBreak}
                  onChange={(e) => updateSettings({ roundsUntilLongBreak: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#e94560]"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold opacity-60 mb-4">OPTIONS</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto-start next session</label>
                  <p className="text-xs opacity-50">Automatically start when timer ends</p>
                </div>
                <button
                  onClick={() => updateSettings({ autoStart: !settings.autoStart })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.autoStart ? 'bg-[#e94560]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.autoStart ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Notifications</label>
                  <p className="text-xs opacity-50">Browser notifications on session complete</p>
                </div>
                <button
                  onClick={() => {
                    if (!settings.notifications && Notification.permission === 'default') {
                      Notification.requestPermission();
                    }
                    updateSettings({ notifications: !settings.notifications });
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.notifications ? 'bg-[#e94560]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Sound</label>
                  <p className="text-xs opacity-50">Play sound when session ends</p>
                </div>
                <button
                  onClick={() => updateSettings({ sound: !settings.sound })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.sound ? 'bg-[#e94560]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.sound ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {settings.sound && (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm">Volume</label>
                    <span className="text-sm font-mono">{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.soundVolume}
                    onChange={(e) => updateSettings({ soundVolume: Number(e.target.value) })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#e94560]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold opacity-60 mb-4">STATISTICS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-[#e94560]">{sessionHistory.filter(s => s.type === 'focus').length}</div>
                <div className="text-xs opacity-60">Sessions Completed</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-[#e94560]">
                  {Math.floor(totalFocusTime / 3600)}h {Math.floor((totalFocusTime % 3600) / 60)}m
                </div>
                <div className="text-xs opacity-60">Total Focus Time</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-semibold opacity-60 mb-4">DANGER ZONE</h3>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                  clearHistory();
                }
              }}
              className="w-full py-3 rounded-xl font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              Clear All History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
