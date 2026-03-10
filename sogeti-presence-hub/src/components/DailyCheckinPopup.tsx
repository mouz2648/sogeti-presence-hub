import { useState } from "react";
import { usePresence } from "../hooks/usePresence";
import { publish } from "../services/realtime";
import { addActivity } from "../services/activityStore";

export default function DailyCheckinPopup() {

  const { users, updateUser } = usePresence();

  const today = new Date().toDateString();

  const [visible, setVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("lastCheckIn");
    return saved !== today;
  });

  const currentUser =
    users.find((u) => u.name === "Ubah Abdullahi") ?? users[0];

  function setStatus(status: "office" | "remote" | "client") {

    if (!currentUser) return;

    updateUser(currentUser.id, status);

    const activity = {
      message: `${currentUser.name} checked in as ${status}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    addActivity(activity);

    publish({
      type: "activity",
      payload: activity
    });

    localStorage.setItem("lastCheckIn", today);

    setVisible(false);
  }

  if (!visible) return null;

  return (

    <div className="popup-overlay">

      <div className="popup-card">

        <h2>Where are you working today?</h2>

        <p>Select your location for today</p>

        <div className="popup-buttons">

          <button
            className="status-btn office"
            onClick={() => setStatus("office")}
          >
            Office
          </button>

          <button
            className="status-btn remote"
            onClick={() => setStatus("remote")}
          >
            Remote
          </button>

          <button
            className="status-btn client"
            onClick={() => setStatus("client")}
          >
            Client
          </button>

        </div>

      </div>

    </div>

  );

}