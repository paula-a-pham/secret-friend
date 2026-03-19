function vibrate(pattern: number | number[]): void {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export function tapVibrate(): void {
  vibrate(10)
}

export function revealVibrate(): void {
  vibrate([30, 50, 30])
}

export function successVibrate(): void {
  vibrate([50, 30, 50, 30, 100])
}
