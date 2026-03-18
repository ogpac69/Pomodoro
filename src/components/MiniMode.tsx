import { useState, useRef, useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';

const MiniMode = () => {
  const { 
    timeRemaining, 
    isRunning, 
    currentSession, 
    settings, 
    miniModePosition, 
    setMiniModePosition,
    toggleMiniMode,
    start,
    pause,
    reset
  } = useTimerStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const totalDuration = currentSession === 'focus' 
    ? settings.focusDuration * 60 
    : currentSession === 'shortBreak' 
    ? settings.shortBreakDuration * 60 
    : settings.longBreakDuration * 60;
  
  const progress = (timeRemaining / totalDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const sessionColors = {
    focus: '#e94560',
    shortBreak: '#4ade80',
    longBreak: '#60a5fa',
  };
  
  const color = sessionColors[currentSession];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 200);
      const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 80);
      
      setMiniModePosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, setMiniModePosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - miniModePosition.x,
      y: e.clientY - miniModePosition.y,
    });
  };

  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      className="fixed z-50 cursor-move select-none"
      style={{
        left: miniModePosition.x,
        top: miniModePosition.y,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md"
        style={{
          background: 'rgba(22, 33, 62, 0.95)',
          border: `1px solid ${color}40`,
        }}
      >
        {/* Mini progress bar */}
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%`, background: color }}
          />
        </div>

        {/* Time display */}
        <span 
          className="text-lg font-mono font-bold min-w-[60px] text-center"
          style={{ color }}
        >
          {timeDisplay}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleStartPause}
            className="p-1.5 rounded-full transition-colors hover:bg-white/10"
            style={{ color }}
          >
            {isRunning ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={reset}
            className="p-1.5 rounded-full opacity-60 hover:opacity-100 transition-colors hover:bg-white/10 text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={toggleMiniMode}
            className="p-1.5 rounded-full opacity-60 hover:opacity-100 transition-colors hover:bg-white/10 text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniMode;
