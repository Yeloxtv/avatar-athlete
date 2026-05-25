/**
 * Platform abstraction for audio feedback.
 *
 * Web implementation uses the Web Audio API (AudioContext / webkitAudioContext).
 * When migrating to React Native, replace function bodies with a native audio
 * library — callers remain untouched.
 *
 * All functions are wrapped in a try/catch so that missing or blocked
 * AudioContext never causes a runtime crash.
 */

type AudioContextConstructor = typeof AudioContext

function getAudioContext(): AudioContextConstructor | null {
  if (typeof window === 'undefined') return null
  return (window.AudioContext || (window as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext) ?? null
}

/**
 * Plays a short synthesised beep.
 *
 * Defaults match the micro-reward feedback used in strength workouts
 * (660 → 990 Hz, 150 ms, low volume).
 */
export function playBeep(
  frequency = 660,
  duration = 0.15,
  volume = 0.08,
): void {
  try {
    const AudioContextClass = getAudioContext()
    if (!AudioContextClass) return

    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.5,
      audioContext.currentTime + duration * 0.53,
    )
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
  } catch {
    // Audio is a bonus — silently ignore browsers that block it.
  }
}

/**
 * Short ascending success chime played after a completed set.
 * Encapsulates the inline AudioContext logic from StrengthWorkoutInterface.
 */
export function playSuccessSound(): void {
  try {
    const AudioContextClass = getAudioContext()
    if (!AudioContextClass) return

    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(990, audioContext.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.14)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch {
    // Audio is a bonus — silently ignore browsers that block it.
  }
}

/**
 * Triumphal level-up fanfare: Do Mi Sol Do (triangle wave) + haptic burst.
 * Encapsulates the `playSound('levelUp')` branch from SessionSummary.
 */
export function playLevelUpSound(): void {
  try {
    const AudioContextClass = getAudioContext()
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    const notes = [523, 659, 784, 1047] // Do Mi Sol Do
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.12 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.18)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.2)
    })

    if ('vibrate' in navigator) navigator.vibrate([50, 30, 80])
  } catch {
    // Audio is a bonus — silently ignore browsers that block it.
  }
}

/**
 * Short quest-complete chime: Mi Sol Do (sine wave).
 * Encapsulates the `playSound('questComplete')` branch from SessionSummary.
 */
export function playQuestCompleteSound(): void {
  try {
    const AudioContextClass = getAudioContext()
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    const notes = [659, 784, 1047] // Mi Sol Do
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + i * 0.12 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.18)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.2)
    })
  } catch {
    // Audio is a bonus — silently ignore browsers that block it.
  }
}

/**
 * Brief stat-gain chime: La Do (sine wave).
 * Encapsulates the `playSound('statGain')` branch from SessionSummary.
 */
export function playStatGainSound(): void {
  try {
    const AudioContextClass = getAudioContext()
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    const notes = [880, 1047] // La Do
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + i * 0.12 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.18)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.2)
    })
  } catch {
    // Audio is a bonus — silently ignore browsers that block it.
  }
}
