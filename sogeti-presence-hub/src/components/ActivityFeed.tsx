import { useEffect, useState } from "react";
import { subscribe } from "../services/realtime";
import { getActivities } from "../services/activityStore";

type ActivityItem = {
  message: string;
  time: string;
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(() => getActivities());

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === "activity") {
        setActivities((prev) => [event.payload, ...prev].slice(0, 20));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="dashboard-sidebar-card">
      <h3>Activity</h3>

      <ul className="activity-list">
        {activities.map((activity, index) => (
          <li key={`${activity.time}-${index}`} className="activity-item">
            <div>{activity.message}</div>
            <div className="activity-time">{activity.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}