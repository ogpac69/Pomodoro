# FocusFlow - Modern Pomodoro Timer

## Concept & Vision

FocusFlow is a beautiful, distraction-free Pomodoro timer that feels like a premium desktop app. It combines the aesthetic simplicity of Pomotroid with modern web capabilities—featuring a satisfying circular progress ring, dreamy theme gradients, and thoughtful micro-interactions that make focusing feel rewarding. The app should feel calm yet purposeful, like a focused mind.

## Design Language

### Aesthetic Direction
Inspired by modern productivity apps like Linear and Notion—minimal chrome, generous whitespace, and subtle depth through shadows and gradients. The timer is the hero element, centered and commanding attention.

### Color Palette

**Dark Theme (Default)**
- Background: `#1a1a2e` (deep navy)
- Surface: `#16213e` (darker navy)
- Primary: `#e94560` (vibrant coral-red)
- Secondary: `#0f3460` (muted blue)
- Text: `#eaeaea` (soft white)
- Text Muted: `#8b8b8b`

**Light Theme**
- Background: `#f8f9fa`
- Surface: `#ffffff`
- Primary: `#e94560`
- Secondary: `#dee2e6`
- Text: `#212529`
- Text Muted: `#6c757d`

**Ocean Gradient Theme**
- Background: linear-gradient(135deg, `#667eea 0%, `#764ba2 100%)
- Surface: `rgba(255,255,255,0.15)`
- Primary: `#ffffff`
- Text: `#ffffff`

**Forest Theme**
- Background: linear-gradient(135deg, `#134e5e 0%, `#71b280 100%)
- Surface: `rgba(255,255,255,0.15)`
- Primary: `#f0f0f0`
- Text: `#ffffff`

### Typography
- Primary: 'Inter', system-ui, sans-serif
- Timer Display: 'JetBrains Mono', monospace (for the numerical countdown)
- Scale: 14px base, 1.5 line-height

### Spatial System
- Base unit: 4px
- Component padding: 16px, 24px, 32px
- Border radius: 12px (cards), 50% (circular elements), 8px (buttons)
- Timer ring size: 300px diameter (desktop), 250px (mobile)

### Motion Philosophy
- Timer progress: smooth CSS transitions (1s ease)
- Theme changes: 300ms cross-fade
- Button interactions: 150ms scale + color shift
- Modal/drawer: 250ms slide + fade
- Completion celebration: subtle pulse animation

## Layout & Structure

### Main View
```
┌─────────────────────────────────────┐
│  [Logo]          [Theme] [Settings] │  Header (subtle)
├─────────────────────────────────────┤
│                                     │
│         ╭─────────────────╮         │
│         │                 │         │
│         │   25:00         │         │  Timer Hero
│         │   [Progress]    │         │
│         │                 │         │
│         ╰─────────────────╯         │
│                                     │
│     [▶ Start]  [↺ Reset]            │  Controls
│                                     │
│  ○ Focus  ○ Short Break  ○ Long     │  Session Type Tabs
│                                     │
├─────────────────────────────────────┤
│  Round 2/4          [Mini Mode]      │  Status Bar
└─────────────────────────────────────┘
```

### Settings Panel (Slide-out drawer)
- Duration sliders (Focus: 1-60min, Short: 1-30min, Long: 1-60min)
- Rounds selector (1-8)
- Auto-start toggle
- Notifications toggle
- Sound toggle + volume
- Clear history button

### Mini Mode (Floating)
- Compact pill-shaped widget
- Shows time + progress bar
- Draggable position (saves to localStorage)
- Always on top via CSS `position: fixed`

### Activity Log (Modal)
- List of completed sessions with timestamps
- Daily/weekly aggregation
- Simple stats: total focus time, sessions completed, streak

## Features & Interactions

### Timer States
1. **Idle** - Timer shows full duration, Start button prominent
2. **Running** - Countdown active, Pause button shown, subtle pulse on ring
3. **Paused** - Timer frozen, Resume + Reset shown
4. **Completed** - Session done animation, auto-transition or manual next

### Session Flow
- Default: Focus → Short Break → Focus → Short Break → Focus → Short Break → Focus → Long Break
- Cycle count tracks completed focus sessions
- Long break triggers every N focus sessions (configurable)

### Controls
- **Start/Resume**: Large primary button, spacebar shortcut
- **Pause**: Replaces Start when running
- **Reset**: Secondary button, returns to start of current session type
- **Skip**: Advances to next session type

### Keyboard Shortcuts
- `Space` - Start/Pause toggle
- `R` - Reset
- `S` - Skip to next session
- `M` - Toggle mini mode
- `Escape` - Close modals/mini mode

### Notifications
- Request permission on first interaction
- Notify on session complete: "Focus session complete! Time for a break."
- Optional: notify before session end (1 min warning)

### Sound
- Gentle chime on completion (Web Audio API)
- Volume slider in settings
- Mute option

### Data Persistence
- All settings saved to localStorage
- Session history with timestamps
- Mini mode position saved
- Current timer state (survives refresh)

## Component Inventory

### TimerRing
- SVG circle with stroke-dasharray animation
- States: idle (empty), running (filling), complete (full + pulse)
- Shows MM:SS in center
- Color matches current session type

### SessionTab
- States: default (muted), active (highlighted + underline), disabled (during run)
- Hover: subtle background shift
- Click: switches session type (resets timer)

### ControlButton
- Primary (Start/Resume): Filled, prominent
- Secondary (Pause/Reset): Outlined or ghost
- Hover: scale(1.05) + shadow
- Active: scale(0.98)
- Disabled: opacity 0.5

### SettingsDrawer
- Slide from right
- Backdrop blur overlay
- Close on X or click outside
- Form controls: sliders, toggles, selects

### MiniModeWidget
- Fixed position, draggable
- Shows: timer, progress bar, session label
- Close button returns to main view

### ThemeSelector
- Grid of color swatches
- Current theme has checkmark
- Click applies immediately

### StatsCard
- Displays: total focus time, sessions, current streak
- Icon + number + label format

### SessionHistoryItem
- Session type icon
- Start time, duration
- Completed badge

## Technical Approach

### Stack
- React 18 + TypeScript
- Vite for bundling
- Zustand for state management
- Tailwind CSS for styling
- localStorage for persistence

### State Structure
```typescript
interface TimerState {
  // Timer
  timeRemaining: number;
  isRunning: boolean;
  currentSession: 'focus' | 'shortBreak' | 'longBreak';
  roundsCompleted: number;
  
  // Settings
  settings: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    roundsUntilLongBreak: number;
    autoStart: boolean;
    notifications: boolean;
    sound: boolean;
    soundVolume: number;
  };
  
  // UI
  theme: 'dark' | 'light' | 'ocean' | 'forest';
  miniMode: boolean;
  miniModePosition: { x: number; y: number };
  settingsOpen: boolean;
  
  // History
  sessionHistory: SessionRecord[];
}
```

### Key Implementation Details
- Timer uses `setInterval` with 1s precision
- Store timer ID for cleanup
- Progress ring uses SVG with `stroke-dashoffset`
- Draggable uses mouse/touch event handlers
- Notifications use Notification API with permission check
- Sound uses Web Audio API with base64 encoded chime

### PWA Support
- Manifest.json for installability
- Service worker for offline support
- App icons in multiple sizes
