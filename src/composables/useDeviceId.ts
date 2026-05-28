export function useDeviceId(): string {
  const key = 'ep26_device_id'
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, crypto.randomUUID())
  }
  return localStorage.getItem(key)!
}
