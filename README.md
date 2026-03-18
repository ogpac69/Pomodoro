# FocusFlow - Modern Pomodoro Timer

A beautiful, productivity-focused Pomodoro timer web application built with React, TypeScript, and Tailwind CSS.

![FocusFlow](https://img.shields.io/badge/Version-1.0.0-e94560?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38b2ac?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Core Timer Features
- ⏱️ **Pomodoro Timer** with Focus, Short Break, and Long Break sessions
- 🔄 **Configurable durations** (1-60 minutes for each session type)
- 🎯 **Customizable rounds** (2-8 sessions before long break)
- ▶️ **Start, Pause, Reset** controls
- ⏭️ **Skip** to next session
- 🔁 **Auto-start** option for seamless workflow

### Notifications & Sounds
- 🔔 **Desktop notifications** when sessions complete
- 🔊 **Sound alerts** with adjustable volume
- ⚙️ Toggle notifications and sounds independently

### Themes
- 🌙 **Dark Mode** - Deep navy aesthetic (default)
- ☀️ **Light Mode** - Clean white design
- 🌊 **Ocean Gradient** - Purple-blue gradient
- 🌲 **Forest Gradient** - Teal-green gradient

### Advanced Features
- 📊 **Session History** - Track all completed sessions
- 📈 **Daily Stats** - Sessions completed and focus time today
- 🪟 **Mini Mode** - Compact, draggable floating timer
- ⌨️ **Keyboard Shortcuts** - Full keyboard control
- 💾 **Persistent Settings** - Saved to localStorage
- 📱 **Responsive Design** - Works on mobile and desktop

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `R` | Reset current session |
| `S` | Skip to next session |
| `M` | Toggle mini mode |
| `Esc` | Close modals |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download the repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ActivityLog.tsx    # Session history modal
│   ├── Controls.tsx      # Start/Pause/Reset buttons
│   ├── Header.tsx         # App header with navigation
│   ├── MiniMode.tsx       # Draggable floating widget
│   ├── SessionTabs.tsx    # Focus/Short/Long break tabs
│   ├── SettingsDrawer.tsx # Settings panel
│   └── Timer.tsx          # Circular progress timer
├── store/
│   └── timerStore.ts      # Zustand state management
├── utils/
│   ├── cn.ts              # Tailwind class merger
│   └── sound.ts           # Web Audio API sounds
├── App.tsx                # Main app component
├── index.css              # Global styles
└── main.tsx               # Entry point
```

## 🛠️ Technical Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **localStorage** - Data persistence
- **Web Notifications API** - Browser notifications
- **Web Audio API** - Sound effects

## 🎨 Customization

### Adding New Themes

Edit `src/store/timerStore.ts` and add a new theme type:

```typescript
export type ThemeType = 'dark' | 'light' | 'ocean' | 'forest' | 'your-theme';
```

Then add the theme colors in `src/App.tsx`:

```typescript
const themeClasses: Record<string, { bg: string; text: string; surface: string }> = {
  // ... existing themes
  yourTheme: {
    bg: 'bg-gradient-to-br from-[#your-color] to-[#your-color2]',
    text: 'text-white',
    surface: 'bg-white/15',
  },
};
```

### Changing Default Durations

Edit the `defaultSettings` in `src/store/timerStore.ts`:

```typescript
const defaultSettings: Settings = {
  focusDuration: 25,      // minutes
  shortBreakDuration: 5,  // minutes
  longBreakDuration: 15,  // minutes
  // ...
};
```

## 📱 PWA Support

The app is designed to be mobile-friendly and can be added to your home screen on mobile devices. For full PWA support with offline capability, you would need to:

1. Add a service worker
2. Add a manifest.json file
3. Provide app icons

## 🔮 Future Enhancements

- [ ] Service Worker for offline support
- [ ] PWA manifest for installability
- [ ] Sound customization (multiple sounds)
- [ ] Theme customization UI
- [ ] Weekly/monthly statistics
- [ ] Focus streaks with achievements
- [ ] Integration with calendars
- [ ] Multiple timer profiles

## 📄 License

MIT License - feel free to use and modify!

---

Built with ❤️ for productivity enthusiasts.
