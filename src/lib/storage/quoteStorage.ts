const STORAGE_KEY = "cakeprice_quotes";

export type StoredQuote = Record<string, unknown>;

export function loadQuotes(): StoredQuote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredQuote[]) : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveQuotes(quotes: StoredQuote[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function clearQuotes() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
