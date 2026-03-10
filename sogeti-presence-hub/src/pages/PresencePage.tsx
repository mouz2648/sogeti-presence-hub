import { useEffect } from "react";
import { usePresence } from "../hooks/usePresence";
import StatusUpdateBar from "../components/StatusUpdateBar";
import ActivityFeed from "../components/ActivityFeed";
import DailyCheckinPopup from "../components/DailyCheckinPopup";
import "../styles/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function PresencePage() {

  const { users } = usePresence();

  const office = users.filter((u) => u.status === "office").length;
  const remote = users.filter((u) => u.status === "remote").length;
  const client = users.filter((u) => u.status === "client").length;
  const offline = users.filter((u) => u.status === "offline").length;

  const capacity = 50;

  const data = [
    { name: "Office", value: office },
    { name: "Remote", value: remote },
    { name: "Client", value: client },
    { name: "Offline", value: offline }
  ];

  const colors = ["#2ecc71", "#f39c12", "#3498db", "#95a5a6"];

  // ✅ Smart reminder kl 09:30
  useEffect(() => {

    const timer = setInterval(() => {

      const lastCheck = localStorage.getItem("lastCheckIn");
      const today = new Date().toDateString();

      const now = new Date();

      if (
        lastCheck !== today &&
        now.getHours() === 9 &&
        now.getMinutes() >= 30
      ) {

        alert("Reminder: Please update your location for today.");

      }

    }, 60000);

    return () => clearInterval(timer);

  }, []);

  return (

    <div className="presence-layout">

      <DailyCheckinPopup />

      <div className="presence-main">

        <StatusUpdateBar />

        <h1 className="page-title">
          Presence Overview
        </h1>

        {/* Office capacity */}

        <div className="presence-capacity">

          <strong>Office capacity</strong>

          <div className="capacity-meter">

            {office} / {capacity}

          </div>

        </div>

        {/* Presence stats */}

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

        {/* Diagram */}

        <div className="chart-card">

          <h2>Today's presence distribution</h2>

          <ResponsiveContainer width="100%" height={360}>

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={130}
              >

                {data.map((_, index) => (

                  <Cell
                    key={index}
                    fill={colors[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* People currently in office */}

        <div className="chart-card">

          <h2>People currently in office</h2>

          <div className="office-list">

            {users
              .filter((u) => u.status === "office")
              .map((user) => (

                <div
                  key={user.id}
                  className="office-user"
                >

                  <div className="office-avatar">
                    {user.initials}
                  </div>

                  <div>
                    <div className="office-name">
                      {user.name}
                    </div>
                  </div>

                </div>

              ))}

          </div>

        </div>

      </div>

      {/* Activity feed */}

      <div className="presence-sidebar">

        <ActivityFeed />

      </div>

    </div>

  );

}