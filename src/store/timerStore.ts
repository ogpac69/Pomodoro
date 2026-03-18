import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionType = 'focus' | 'shortBreak' | 'longBreak';
export type ThemeType = 'dark' | 'light' | 'ocean' | 'forest';

export interface SessionRecord {
  id: string;
  type: SessionType;
  duration: number;
  completedAt: string;
  completed: boolean;
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  roundsUntilLongBreak: number;
  autoStart: boolean;
  notifications: boolean;
  sound: boolean;
  soundVolume: number;
}

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  currentSession: SessionType;
  roundsCompleted: number;
  totalFocusTime: number;
  settings: Settings;
  theme: ThemeType;
  miniMode: boolean;
  miniModePosition: { x: number; y: number };
  settingsOpen: boolean;
  activityLogOpen: boolean;
  sessionHistory: SessionRecord[];
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  setSession: (session: SessionType) => void;
  setTheme: (theme: ThemeType) => void;
  toggleMiniMode: () => void;
  setMiniModePosition: (pos: { x: number; y: number }) => void;
  toggleSettings: () => void;
  toggleActivityLog: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearHistory: () => void;
}

const getDurationForSession = (session: SessionType, settings: Settings): number => {
  switch (session) {
    case 'focus':
      return settings.focusDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
};

const defaultSettings: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  roundsUntilLongBreak: 4,
  autoStart: false,
  notifications: true,
  sound: true,
  soundVolume: 0.5,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeRemaining: defaultSettings.focusDuration * 60,
      isRunning: false,
      currentSession: 'focus',
      roundsCompleted: 0,
      totalFocusTime: 0,
      settings: defaultSettings,
      theme: 'dark',
      miniMode: false,
      miniModePosition: { x: 20, y: 20 },
      settingsOpen: false,
      activityLogOpen: false,
      sessionHistory: [],

      start: () => set({ isRunning: true }),
      
      pause: () => set({ isRunning: false }),
      
      reset: () => {
        const { currentSession, settings } = get();
        set({
          timeRemaining: getDurationForSession(currentSession, settings),
          isRunning: false,
        });
      },
      
      skip: () => {
        const { currentSession, settings, roundsCompleted } = get();
        let nextSession: SessionType;
        let newRoundsCompleted = roundsCompleted;

        if (currentSession === 'focus') {
          newRoundsCompleted = roundsCompleted + 1;
          if (newRoundsCompleted >= settings.roundsUntilLongBreak) {
            nextSession = 'longBreak';
            newRoundsCompleted = 0;
          } else {
            nextSession = 'shortBreak';
          }
        } else {
          nextSession = 'focus';
        }

        set({
          currentSession: nextSession,
          roundsCompleted: newRoundsCompleted,
          timeRemaining: getDurationForSession(nextSession, settings),
          isRunning: false,
        });
      },

      tick: () => {
        const { timeRemaining, isRunning, currentSession, settings, roundsCompleted, totalFocusTime, sessionHistory } = get();
        
        if (!isRunning || timeRemaining <= 0) return;

        const newTime = timeRemaining - 1;
        let newTotalFocusTime = totalFocusTime;

        if (currentSession === 'focus') {
          newTotalFocusTime = totalFocusTime + 1;
        }

        if (newTime <= 0) {
          const record: SessionRecord = {
            id: Date.now().toString(),
            type: currentSession,
            duration: getDurationForSession(currentSession, settings),
            completedAt: new Date().toISOString(),
            completed: true,
          };

          let nextSession: SessionType;
          let newRoundsCompleted = roundsCompleted;

          if (currentSession === 'focus') {
            newRoundsCompleted = roundsCompleted + 1;
            if (newRoundsCompleted >= settings.roundsUntilLongBreak) {
              nextSession = 'longBreak';
              newRoundsCompleted = 0;
            } else {
              nextSession = 'shortBreak';
            }
          } else {
            nextSession = 'focus';
          }

          set({
            isRunning: settings.autoStart,
            currentSession: nextSession,
            roundsCompleted: newRoundsCompleted,
            totalFocusTime: newTotalFocusTime,
            sessionHistory: [...sessionHistory, record],
            timeRemaining: getDurationForSession(nextSession, settings),
          });

          if (settings.notifications && Notification.permission === 'granted') {
            const message = nextSession === 'focus' 
              ? 'Break over! Time to focus.' 
              : 'Great work! Take a focus break.';
            new Notification('FocusFlow', { body: message, icon: '/favicon.svg' });
          }

          return;
        }

        set({ timeRemaining: newTime, totalFocusTime: newTotalFocusTime });
      },
      
      setSession: (session: SessionType) => {
        const { settings } = get();
        set({
          currentSession: session,
          timeRemaining: getDurationForSession(session, settings),
          isRunning: false,
        });
      },
      
      setTheme: (theme: ThemeType) => set({ theme }),
      
      toggleMiniMode: () => set((state) => ({ miniMode: !state.miniMode })),
      
      setMiniModePosition: (pos: { x: number; y: number }) => set({ miniModePosition: pos }),
      
      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      
      toggleActivityLog: () => set((state) => ({ activityLogOpen: !state.activityLogOpen })),
      
      updateSettings: (newSettings: Partial<Settings>) => {
        const { settings, currentSession } = get();
        const updatedSettings = { ...settings, ...newSettings };
        set({
          settings: updatedSettings,
          timeRemaining: getDurationForSession(currentSession, updatedSettings),
        });
      },
      
      clearHistory: () => set({ sessionHistory: [], totalFocusTime: 0 }),
    }),
    {
      name: 'focusflow-storage',
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
        miniModePosition: state.miniModePosition,
        sessionHistory: state.sessionHistory,
        totalFocusTime: state.totalFocusTime,
        roundsCompleted: state.roundsCompleted,
      }),
    }
  )
);
