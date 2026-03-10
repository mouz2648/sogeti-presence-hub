import { useSyncExternalStore } from "react";

type EmergencyState = {
  active: boolean;
  evacuatedIds: string[];
};

const STORAGE_KEY = "presence_emergency_mode";

let state: EmergencyState = loadState();
const listeners = new Set<() => void>();

function loadState(): EmergencyState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      active: false,
      evacuatedIds: []
    };
  }

  try {
    return JSON.parse(raw) as EmergencyState;
  } catch {
    return {
      active: false,
      evacuatedIds: []
    };
  }
}

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): EmergencyState {
  return state;
}

export function useEmergencyMode() {
  const emergencyState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  function activateEmergency(): void {
    state = {
      active: true,
      evacuatedIds: []
    };
    persist();
    emit();
  }

  function deactivateEmergency(): void {
    state = {
      active: false,
      evacuatedIds: []
    };
    persist();
    emit();
  }

  function toggleEvacuated(userId: string): void {
    const alreadyEvacuated = state.evacuatedIds.includes(userId);

    state = {
      ...state,
      evacuatedIds: alreadyEvacuated
        ? state.evacuatedIds.filter((id) => id !== userId)
        : [...state.evacuatedIds, userId]
    };

    persist();
    emit();
  }

  return {
    emergencyState,
    activateEmergency,
    deactivateEmergency,
    toggleEvacuated
  };
}