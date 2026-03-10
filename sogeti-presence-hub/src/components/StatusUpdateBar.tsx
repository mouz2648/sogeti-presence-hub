import { usePresence } from "../hooks/usePresence";
import { publish } from "../services/realtime";
import { addActivity } from "../services/activityStore";

export default function StatusUpdateBar() {
  const { users, updateUser } = usePresence();

  const currentUser =
    users.find((user) => user.name === "Ubah Abdullahi") ?? users[0];

  function changeStatus(status: "office" | "remote" | "client"): void {
    if (!currentUser) return;

    updateUser(currentUser.id, status);

    const activity = {
      message: `${currentUser.name} changed status to ${status}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    };

    addActivity(activity);
    publish({
      type: "activity",
      payload: activity
    });
  }

  return (
    <div className="status-bar-card">
      <div className="status-bar-label">Change your status</div>

      <div className="status-bar-buttons">
        <button
          onClick={() => changeStatus("office")}
          className="status-btn office"
        >
          Office
        </button>

        <button
          onClick={() => changeStatus("remote")}
          className="status-btn remote"
        >
          Remote
        </button>

        <button
          onClick={() => changeStatus("client")}
          className="status-btn client"
        >
          Client
        </button>
      </div>
    </div>
  );
}