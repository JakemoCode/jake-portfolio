export type Fields = { name: string; email: string; message: string };
export type Errors = Partial<Record<keyof Fields, string>>;

export const CONTACT_EMAIL = "jake@jakemosher.dev";
export const FORM_ENDPOINT = "https://formspree.io/f/mqeoaawe";

export function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Let me know who you are.";
  if (!fields.email.trim()) errors.email = "I'll need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "That email looks off.";
  if (!fields.message.trim()) errors.message = "Tell me a little about what you need.";
  return errors;
}

type SubmitDeps = { endpoint?: string; fetchImpl?: typeof fetch };

export async function submitInquiry(
  fields: Fields,
  { endpoint = FORM_ENDPOINT, fetchImpl = fetch }: SubmitDeps = {},
): Promise<void> {
  const res = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}

const DRAFT_KEY = "jm-contact-draft";
const BLANK: Fields = { name: "", email: "", message: "" };

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): DraftStorage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadDraft(storage: DraftStorage | null = defaultStorage()): Fields {
  try {
    const saved = storage?.getItem(DRAFT_KEY);
    if (saved) return { ...BLANK, ...JSON.parse(saved) };
  } catch {
    // unavailable or malformed storage; fall back to blank
  }
  return { ...BLANK };
}

export function saveDraft(fields: Fields, storage: DraftStorage | null = defaultStorage()): void {
  try {
    storage?.setItem(DRAFT_KEY, JSON.stringify(fields));
  } catch {
    // ignore unavailable storage
  }
}

export function clearDraft(storage: DraftStorage | null = defaultStorage()): void {
  try {
    storage?.removeItem(DRAFT_KEY);
  } catch {
    // ignore unavailable storage
  }
}
