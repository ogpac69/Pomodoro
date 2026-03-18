import React from 'react';
import { useTimerStore, SessionType } from '../store/timerStore';

const SessionTabs = () => {
  const { currentSession, setSession, isRunning, roundsCompleted, settings } = useTimerStore();

  const sessions: { type: SessionType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'focus',
      label: 'Focus',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ),
    },
    {
      type: 'shortBreak',
      label: 'Short Break',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      type: 'longBreak',
      label: 'Long Break',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-md">
      <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-xl ${useTimerStore.getState().theme === 'dark' || useTimerStore.getState().theme === 'ocean' || useTimerStore.getState().theme === 'forest' ? 'bg-white/5' : 'bg-gray-200'}`}>
        {sessions.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => !isRunning && setSession(type)}
            disabled={isRunning}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
              ${currentSession === type
                ? type === 'focus'
                  ? 'bg-[#e94560] text-white shadow-lg'
                  : type === 'shortBreak'
                  ? 'bg-[#4ade80] text-white shadow-lg'
                  : 'bg-[#60a5fa] text-white shadow-lg'
                : 'opacity-60 hover:opacity-100'
              }
              ${isRunning ? 'cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Round indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm opacity-60">
        <span>Round</span>
        <span className="font-semibold">{roundsCompleted + 1}</span>
        <span>/</span>
        <span className="font-semibold">{settings.roundsUntilLongBreak}</span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {Array.from({ length: settings.roundsUntilLongBreak }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < roundsCompleted ? 'bg-[#e94560]' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionTabs;
