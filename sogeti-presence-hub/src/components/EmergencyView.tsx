import type { User } from "../types/User";
import { useEmergencyMode } from "../services/emergencyMode";
import { exportEmergencyList } from "../services/exportEmergency";

type Props = {
  users: User[];
};

export default function EmergencyView({ users }: Props) {
  const officeUsers = users.filter((user) => user.status === "office");

  const {
    emergencyState,
    activateEmergency,
    deactivateEmergency,
    toggleEvacuated
  } = useEmergencyMode();

  const evacuatedCount = officeUsers.filter((user) =>
    emergencyState.evacuatedIds.includes(user.id)
  ).length;

  const missingCount = officeUsers.length - evacuatedCount;

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Emergency View</h2>

        <div className="emergency-toolbar">
          {!emergencyState.active ? (
            <button className="status-btn remote" onClick={activateEmergency}>
              Activate emergency
            </button>
          ) : (
            <button className="status-btn client" onClick={deactivateEmergency}>
              End emergency
            </button>
          )}

          <button
            className="status-btn office"
            onClick={() =>
              exportEmergencyList(users, emergencyState.evacuatedIds)
            }
          >
            Export Emergency List
          </button>
        </div>
      </div>

      <p>People currently in the office</p>

      {emergencyState.active && (
        <div className="emergency-metrics">
          <div className="emergency-metric">
            <span className="metric-number">{officeUsers.length}</span>
            <span>People in building</span>
          </div>

          <div className="emergency-metric">
            <span className="metric-number">{evacuatedCount}</span>
            <span>Evacuated</span>
          </div>

          <div className="emergency-metric">
            <span className="metric-number">{missingCount}</span>
            <span>Missing</span>
          </div>
        </div>
      )}

      <div className="office-roster">
        {officeUsers.map((user) => {
          const evacuated = emergencyState.evacuatedIds.includes(user.id);

          return (
            <div key={user.id} className="office-roster-row">
              <div className="office-roster-person">
                <div className="office-roster-avatar">{user.initials}</div>

                <div>
                  <div className="office-roster-name">{user.name}</div>
                  <div className="office-roster-status">{user.status}</div>
                </div>
              </div>

              {emergencyState.active && (
                <button
                  className={evacuated ? "status-btn client" : "status-btn office"}
                  onClick={() => toggleEvacuated(user.id)}
                >
                  {evacuated ? "Mark inside" : "Mark evacuated"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}