function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export function tapVibrate() {
  vibrate(10)
}

export function revealVibrate() {
  vibrate([30, 50, 30])
}

export function successVibrate() {
  vibrate([50, 30, 50, 30, 100])
}
