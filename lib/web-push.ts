import api from "@/lib/api"

function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padded = base64String.padEnd(
    base64String.length + ((4 - (base64String.length % 4)) % 4),
    "="
  )
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray.buffer
}

function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

export async function ensureWebPushSubscription(): Promise<NotificationPermission> {
  if (!isWebPushSupported()) {
    throw new Error("Web Push tidak didukung oleh browser ini")
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission()

  if (permission !== "granted") {
    return permission
  }

  await navigator.serviceWorker.register("/sw.js")
  const registration = await navigator.serviceWorker.ready

  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    const key = await api.push.getPublicKey()
    if (!key?.publicKey) {
      throw new Error("Public key push tidak tersedia")
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key.publicKey),
    })
  }

  const payload = subscription.toJSON()
  const p256dh = payload.keys?.p256dh
  const auth = payload.keys?.auth

  if (!p256dh || !auth) {
    throw new Error("Kunci subscription push tidak valid")
  }

  await api.push.upsertSubscription({
    endpoint: subscription.endpoint,
    expirationTime: typeof payload.expirationTime === "number" ? payload.expirationTime : null,
    timezone: getBrowserTimeZone(),
    keys: {
      p256dh,
      auth,
    },
  })

  return permission
}

export async function disableWebPushSubscription(): Promise<void> {
  if (!isWebPushSupported()) {
    return
  }

  await navigator.serviceWorker.register("/sw.js")
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    return
  }

  try {
    await api.push.deleteSubscription(subscription.endpoint)
  } catch {
    // Ignore API failures and continue to remove local subscription.
  }

  await subscription.unsubscribe()
}
