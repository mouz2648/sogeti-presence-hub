import { useMemo } from "react";
import { usePresence } from "../hooks/usePresence";
import { getUtilisationLast30Days } from "../services/utilisationStore";
import { exportUtilisation } from "../services/exportUtilisation";
import EmergencyView from "../components/EmergencyView";
import OfficeHeatmap from "../components/OfficeHeatmap";
import "../styles/dashboard.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const { users } = usePresence();

  const utilisationData = useMemo(() => getUtilisationLast30Days(), [users]);

  const office = users.filter((u) => u.status === "office").length;
  const remote = users.filter((u) => u.status === "remote").length;
  const client = users.filter((u) => u.status === "client").length;
  const offline = users.filter((u) => u.status === "offline").length;

  const officeUsers = users.filter((u) => u.status === "office");

  const peak = utilisationData.reduce((best, current) =>
    current.office > best.office ? current : best
  );

  const average =
    utilisationData.length === 0
      ? 0
      : Math.round(
          utilisationData.reduce((sum, row) => sum + row.office, 0) /
            utilisationData.length
        );

  const capacity = 50;

  return (
    <div className="admin-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="presence-stats">
        <div className="presence-card">
          <div className="number">{office}</div>
          <div>Office</div>
        </div>

        <div className="presence-card">
          <div className="number">{remote}</div>
          <div>Remote</div>
        </div>

        <div className="presence-card">
          <div className="number">{client}</div>
          <div>Client</div>
        </div>

        <div className="presence-card">
          <div className="number">{offline}</div>
          <div>Offline</div>
        </div>
      </div>

      <div className="presence-stats">
        <div className="presence-card">
          <div className="number">{peak.office}</div>
          <div>Peak: {peak.label}</div>
        </div>

        <div className="presence-card">
          <div className="number">{average}</div>
          <div>Average occupancy</div>
        </div>

        <div className="presence-card">
          <div className="number">{capacity}</div>
          <div>Capacity</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Office utilisation</h2>

          <button
            className="status-btn client"
            onClick={() => exportUtilisation(utilisationData)}
          >
            Export utilisation
          </button>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={utilisationData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="office"
              stroke="#6264A7"
              strokeWidth={3}
              name="Office"
            />

            <Line
              type="monotone"
              dataKey="remote"
              stroke="#f39c12"
              strokeWidth={2}
              name="Remote"
            />

            <Line
              type="monotone"
              dataKey="client"
              stroke="#3498db"
              strokeWidth={2}
              name="Client"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-section">
        <h2>30-day occupancy heatmap</h2>
        <OfficeHeatmap data={utilisationData.map((row) => row.office)} />
      </div>

      <div className="dashboard-section">
        <h2>People currently in the office</h2>

        <div className="office-roster">
          {officeUsers.map((user) => (
            <div key={user.id} className="office-roster-row">
              <div className="office-roster-person">
                <div className="office-roster-avatar">{user.initials}</div>

                <div>
                  <div className="office-roster-name">{user.name}</div>
                  <div className="office-roster-status">{user.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmergencyView users={users} />
    </div>
  );
}