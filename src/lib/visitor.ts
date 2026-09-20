export const VISITOR_CACHE_KEY = "mp_visitor";

export type CardColor = "pink" | "teal" | "green" | "orange" | "neutral";

export type VisitorCard = {
  id: string;
  number: number;
  name: string;
  color: CardColor;
  issuedAt: string;
  /** PNG data URL of the drawn signature, or null if the visitor skipped drawing. */
  signature: string | null;
};

export function readCachedCard(): VisitorCard | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(VISITOR_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<VisitorCard>;
    return {
      id: parsed.id!,
      number: parsed.number!,
      name: parsed.name!,
      color: parsed.color!,
      issuedAt: parsed.issuedAt!,
      signature: parsed.signature ?? null,
    };
  } catch {
    return null;
  }
}

export function writeCachedCard(card: VisitorCard) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(VISITOR_CACHE_KEY, JSON.stringify(card));
  }
}

export function clearCachedCard() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(VISITOR_CACHE_KEY);
  }
}

// Mocking server interactions since we are purely client-side React
export async function fetchCurrentCard(): Promise<VisitorCard | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(readCachedCard());
    }, 100);
  });
}

export async function deleteCard(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearCachedCard();
      resolve(true);
    }, 100);
  });
}

export async function submitCard(input: {
  name: string;
  color: CardColor;
  signature?: string | null;
}): Promise<VisitorCard> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a mock card for the React application state
      const card: VisitorCard = {
        id: crypto.randomUUID(),
        number: Math.floor(Math.random() * 1000) + 10,
        name: input.name,
        color: input.color,
        issuedAt: new Date().toISOString(),
        signature: input.signature ?? null,
      };
      writeCachedCard(card);
      resolve(card);
    }, 500);
  });
}
