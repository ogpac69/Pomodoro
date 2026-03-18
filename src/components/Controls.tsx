import { useTimerStore } from '../store/timerStore';
import { playSound } from '../utils/sound';

const Controls = () => {
  const { isRunning, start, pause, reset, skip, settings } = useTimerStore();

  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleSkip = () => {
    if (settings.sound) {
      playSound(settings.soundVolume);
    }
    skip();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={handleStartPause}
        className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
        style={{
          background: isRunning ? '#ef4444' : '#e94560',
          boxShadow: isRunning 
            ? '0 4px 20px rgba(239, 68, 68, 0.4)' 
            : '0 4px 20px rgba(233, 69, 96, 0.4)',
        }}
      >
        {isRunning ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pause
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start
          </span>
        )}
      </button>

      <button
        onClick={handleReset}
        className="px-6 py-3 rounded-xl font-semibold border-2 border-current opacity-60 hover:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>

      <button
        onClick={handleSkip}
        className="px-6 py-3 rounded-xl font-semibold opacity-60 hover:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
        Skip
      </button>
    </div>
  );
};

export default Controls;
