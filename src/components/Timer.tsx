import { useTimerStore } from '../store/timerStore';

const Timer = () => {
  const { timeRemaining, isRunning, currentSession, settings } = useTimerStore();
  
  const totalDuration = currentSession === 'focus' 
    ? settings.focusDuration * 60 
    : currentSession === 'shortBreak' 
    ? settings.shortBreakDuration * 60 
    : settings.longBreakDuration * 60;
  
  const progress = (timeRemaining / totalDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const size = 300;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const sessionColors = {
    focus: '#e94560',
    shortBreak: '#4ade80',
    longBreak: '#60a5fa',
  };
  
  const color = sessionColors[currentSession];
  
  return (
    <div className="relative mb-8">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-10"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: isRunning ? `drop-shadow(0 0 10px ${color}50)` : 'none',
          }}
        />
      </svg>
      
      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={`text-6xl font-mono font-bold tracking-wider transition-colors duration-300`}
          style={{ color }}
        >
          {timeDisplay}
        </span>
        <span className="text-sm opacity-60 mt-2 capitalize">
          {currentSession === 'shortBreak' ? 'Short Break' : currentSession === 'longBreak' ? 'Long Break' : 'Focus'}
        </span>
      </div>
      
      {/* Pulse animation when running */}
      {isRunning && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};

export default Timer;
