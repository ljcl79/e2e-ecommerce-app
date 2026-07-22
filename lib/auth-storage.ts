export type StoredUser = {
  email: string;
  password: string;
};

export const USERS_KEY = "e2e-users";
export const SESSION_KEY = "e2e-session";

export const ADMIN_USER: StoredUser = {
  email: "admin@talendready.com",
  password: "Admin123!",
};

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function saveSessionEmail(email: string): void {
  localStorage.setItem(SESSION_KEY, email);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function emailExists(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (normalized === ADMIN_USER.email.toLowerCase()) return true;
  return getStoredUsers().some((user) => user.email.toLowerCase() === normalized);
}

export function findUser(email: string, password: string): StoredUser | null {
  const normalized = email.trim().toLowerCase();
  if (
    normalized === ADMIN_USER.email.toLowerCase() &&
    password === ADMIN_USER.password
  ) {
    return ADMIN_USER;
  }
  const user = getStoredUsers().find(
    (entry) =>
      entry.email.toLowerCase() === normalized && entry.password === password,
  );
  return user ?? null;
}
