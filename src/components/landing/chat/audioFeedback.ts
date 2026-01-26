// Subtle notification sound using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playMessageSound = () => {
  try {
    const ctx = getAudioContext();
    
    // Create a soft, subtle "pop" sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Soft, pleasant frequency
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    oscillator.type = 'sine';
    
    // Very subtle volume with quick fade
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Silently fail if audio isn't available
    console.log('Audio not available');
  }
};

export const triggerHaptic = (style: 'light' | 'medium' = 'light') => {
  try {
    // Use Vibration API for haptic feedback on supported devices
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : 20;
      navigator.vibrate(duration);
    }
  } catch (e) {
    // Silently fail if haptics aren't available
  }
};

export const playMessageFeedback = () => {
  playMessageSound();
  triggerHaptic('light');
};
