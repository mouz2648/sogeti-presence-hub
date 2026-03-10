import { useSyncExternalStore } from "react";
import type { User } from "../types/User";
import { mockUsers } from "../data/mockUsers";
import { recordUtilisation } from "../services/utilisationStore";

const USERS_KEY = "presence_users_store";
const RESET_KEY = "presence_last_reset_date";

let usersStore: User[] = loadUsers();
const listeners = new Set<() => void>();

function loadUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return [...mockUsers];
  }

  try {
    return JSON.parse(raw) as User[];
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return [...mockUsers];
  }
}

function saveUsers(): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(usersStore));
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function ensureDailyReset(): void {
  const now = new Date();
  const lastReset = localStorage.getItem(RESET_KEY);

  if (now.getHours() < 6) return;
  if (lastReset === getTodayKey()) return;

  usersStore = usersStore.map((user) => ({
    ...user,
    status: "offline"
  }));

  saveUsers();
  recordUtilisation(usersStore);
  localStorage.setItem(RESET_KEY, getTodayKey());
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): User[] {
  ensureDailyReset();
  return usersStore;
}

export function usePresence() {
  const users = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  function updateUser(id: string, status: User["status"]): void {
    usersStore = usersStore.map((user) =>
      user.id === id ? { ...user, status } : user
    );

    saveUsers();
    recordUtilisation(usersStore);
    emit();
  }

  function resetAllOffline(): void {
    usersStore = usersStore.map((user) => ({
      ...user,
      status: "offline"
    }));

    saveUsers();
    recordUtilisation(usersStore);
    localStorage.setItem(RESET_KEY, getTodayKey());
    emit();
  }

  return {
    users,
    updateUser,
    resetAllOffline
  };
}