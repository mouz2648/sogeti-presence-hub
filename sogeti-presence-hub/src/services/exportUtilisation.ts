import type { UtilisationEntry } from "./utilisationStore";

export function exportUtilisation(data: UtilisationEntry[]): void {
  const headers = ["Date", "Office", "Remote", "Client", "Offline"];

  const rows = data.map((row) => [
    row.dateKey,
    row.office,
    row.remote,
    row.client,
    row.offline
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  download(csv, "office-utilisation-30days.csv");
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