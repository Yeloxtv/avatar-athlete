/**
 * Platform abstraction for haptic feedback.
 *
 * Web implementation uses the Vibration API.
 * When migrating to React Native, swap the body of `triggerHaptic`
 * for `react-native-haptic-feedback` — callers remain untouched.
 */

export function triggerHaptic(pattern?: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern ?? 35)
  }
  // Silently no-ops on platforms where the Vibration API is unavailable.
}
