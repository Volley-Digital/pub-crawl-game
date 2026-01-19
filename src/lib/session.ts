export type Session = {
  teamId: string;
  teamName: "A" | "B";
  joinCode: string;
  playerName: string;
};

const KEY = "pz_session_v1";

export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function loadSession() : Session | null {
  if (typeof window === "undefined") return null; // server guard

  try {
    const raw = localStorage.getItem("pz_session_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


export function clearSession() {
  localStorage.removeItem(KEY);
}