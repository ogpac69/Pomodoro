import { useEffect, useCallback } from 'react';
import { useTimerStore } from './store/timerStore';
import Timer from './components/Timer';
import Controls from './components/Controls';
import SessionTabs from './components/SessionTabs';
import SettingsDrawer from './components/SettingsDrawer';
import MiniMode from './components/MiniMode';
import ActivityLog from './components/ActivityLog';
import Header from './components/Header';
import { playSound } from './utils/sound';

function App() {
  const { 
    isRunning, 
    tick, 
    settings, 
    theme, 
    miniMode, 
    timeRemaining,
    toggleSettings,
    toggleActivityLog,
    activityLogOpen,
    settingsOpen,
    start,
    pause,
    reset,
    skip,
    toggleMiniMode
  } = useTimerStore();

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Sound on session complete
  useEffect(() => {
    if (settings.sound && !isRunning && timeRemaining === 0) {
      playSound(settings.soundVolume);
    }
  }, [isRunning, settings.sound, timeRemaining]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault();
        if (isRunning) {
          pause();
        } else {
          start();
        }
        break;
      case 'r':
        reset();
        break;
      case 's':
        if (!e.metaKey && !e.ctrlKey) {
          skip();
        }
        break;
      case 'm':
        toggleMiniMode();
        break;
      case 'escape':
        if (settingsOpen) toggleSettings();
        if (activityLogOpen) toggleActivityLog();
        break;
    }
  }, [isRunning, settingsOpen, activityLogOpen, start, pause, reset, skip, toggleMiniMode, toggleSettings, toggleActivityLog]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Request notification permission
  useEffect(() => {
    if (settings.notifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  const themeClasses: Record<string, { bg: string; text: string; surface: string }> = {
    dark: {
      bg: 'bg-[#1a1a2e]',
      text: 'text-[#eaeaea]',
      surface: 'bg-[#16213e]',
    },
    light: {
      bg: 'bg-[#f8f9fa]',
      text: 'text-[#212529]',
      surface: 'bg-white',
    },
    ocean: {
      bg: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
      text: 'text-white',
      surface: 'bg-white/15',
    },
    forest: {
      bg: 'bg-gradient-to-br from-[#134e5e] to-[#71b280]',
      text: 'text-white',
      surface: 'bg-white/15',
    },
  };

  const currentTheme = themeClasses[theme];

  if (miniMode) {
    return (
      <div className={currentTheme.bg}>
        <MiniMode />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      <Header />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 pb-8">
        <Timer />
        <Controls />
        <SessionTabs />
        
        {/* Keyboard shortcuts hint */}
        <div className="mt-8 text-xs opacity-40 flex gap-4">
          <span>Space: Start/Pause</span>
          <span>R: Reset</span>
          <span>S: Skip</span>
          <span>M: Mini Mode</span>
        </div>
      </main>

      <SettingsDrawer isOpen={settingsOpen} onClose={() => toggleSettings()} />
      <ActivityLog isOpen={activityLogOpen} onClose={() => toggleActivityLog()} />
    </div>
  );
}

export default App;
