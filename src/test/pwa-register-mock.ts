export function registerSW(_options?: {
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
  onRegisteredSW?: (url: string, r?: ServiceWorkerRegistration) => void
}) {
  // noop in tests
  return () => {}
}
