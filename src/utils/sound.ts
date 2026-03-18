// Simple chime sound using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

export const playSound = (volume: number = 0.5) => {
  if (!audioContext) return;
  
  // Resume audio context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Gentle chime configuration
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
  
  // Add a second harmonic for richness
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
  
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);
  
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
  
  gainNode2.gain.setValueAtTime(volume * 0.15, audioContext.currentTime);
  gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator2.start(audioContext.currentTime);
  oscillator2.stop(audioContext.currentTime + 0.4);
};
