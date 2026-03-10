import type { User } from "../types/User";

export function exportEmergencyList(
  users: User[],
  evacuatedIds: string[]
): void {
  const officeUsers = users.filter((u) => u.status === "office");

  const headers = ["Name", "Initials", "Status", "Evacuated"];

  const rows = officeUsers.map((user) => [
    user.name,
    user.initials,
    user.status,
    evacuatedIds.includes(user.id) ? "Yes" : "No"
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  download(csv, "emergency-office-list.csv");
}

function download(content: string, filename: string): void {
  const blob = new Blob([content], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}