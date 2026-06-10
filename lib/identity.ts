// Anonymous, device-scoped identity — no accounts, no auth.
//
// The device id is a random UUID persisted in localStorage. It is NOT a
// credential: the server uses it only to enforce one-vote-per-device and to let
// you delete your own comment. The display name is a separate, freely-editable
// label shown next to your comments.

const DEVICE_KEY = "kauai:device";
const NAME_KEY = "kauai:name";

/** Read (or lazily create) this browser's device id. "" during SSR. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getStoredName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_KEY) ?? "";
}

export function storeName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_KEY, name.trim().slice(0, 32));
}
