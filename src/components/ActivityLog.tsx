import { useTimerStore, SessionType } from '../store/timerStore';

interface ActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityLog = ({ isOpen, onClose }: ActivityLogProps) => {
  const { sessionHistory } = useTimerStore();

  // Group sessions by date
  const groupedSessions = sessionHistory.reduce((groups, session) => {
    const date = new Date(session.completedAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, typeof sessionHistory>);

  // Calculate stats
  const today = new Date().toLocaleDateString();
  const todaySessions = sessionHistory.filter(
    s => new Date(s.completedAt).toLocaleDateString() === today && s.type === 'focus'
  );
  const todayFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  const getSessionIcon = (type: SessionType) => {
    switch (type) {
      case 'focus':
        return (
          <div className="w-8 h-8 rounded-full bg-[#e94560]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#e94560]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          </div>
        );
      case 'shortBreak':
        return (
          <div className="w-8 h-8 rounded-full bg-[#4ade80]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'longBreak':
        return (
          <div className="w-8 h-8 rounded-full bg-[#60a5fa]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#60a5fa]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
      
      {/* Modal */}
      <div 
        className={`fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-[#16213e] z-50 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Activity Log</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5 border border-[#e94560]/20">
              <div className="text-3xl font-bold text-[#e94560]">{todaySessions.length}</div>
              <div className="text-sm opacity-60">Sessions Today</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5 border border-[#e94560]/20">
              <div className="text-3xl font-bold text-[#e94560]">
                {Math.floor(todayFocusTime / 3600)}h {Math.floor((todayFocusTime % 3600) / 60)}m
              </div>
              <div className="text-sm opacity-60">Focus Time Today</div>
            </div>
          </div>

          {/* Session History */}
          {sessionHistory.length === 0 ? (
            <div className="text-center py-12 opacity-60">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No sessions yet. Start focusing!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSessions).reverse().map(([date, sessions]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold opacity-60 mb-3">
                    {date === today ? 'Today' : date}
                  </h3>
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {getSessionIcon(session.type)}
                        <div className="flex-1">
                          <div className="text-sm font-medium capitalize">
                            {session.type === 'shortBreak' ? 'Short Break' : session.type === 'longBreak' ? 'Long Break' : 'Focus'}
                          </div>
                          <div className="text-xs opacity-60">
                            {formatTime(session.completedAt)}
                          </div>
                        </div>
                        <div className="text-sm font-mono opacity-60">
                          {formatDuration(session.duration)}
                        </div>
                        {session.completed && (
                          <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityLog;
