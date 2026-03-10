import "../styles/teams.css";

type Props = {
  onSelect: (status: "office" | "remote" | "client") => void;
};

export default function CheckInPopup({ onSelect }: Props) {
  return (
    <div className="teams-popup-overlay">
      <div className="teams-popup">
        <h3>Where are you working today?</h3>

        <div className="teams-buttons">
          <button className="teams-button" onClick={() => onSelect("office")}>
            Office
          </button>

          <button className="teams-button" onClick={() => onSelect("remote")}>
            Remote
          </button>

          <button className="teams-button" onClick={() => onSelect("client")}>
            At Client
          </button>
        </div>
      </div>
    </div>
  );
}