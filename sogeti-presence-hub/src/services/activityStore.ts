export type ActivityItem = {
  message: string;
  time: string;
};

const ACTIVITY_KEY = "presence_activity_feed";

export function getActivities(): ActivityItem[] {
  const raw = localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ActivityItem[];
  } catch {
    return [];
  }
}

export function addActivity(activity: ActivityItem): void {
  const current = getActivities();
  const updated = [activity, ...current].slice(0, 20);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
}