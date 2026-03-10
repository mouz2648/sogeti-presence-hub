import "../styles/teams.css";
import {
  Search24Regular,
  Settings24Regular
} from "@fluentui/react-icons";

export default function TeamsTopBar() {
  return (
    <div className="teams-header">

      {/* LEFT */}
      <div className="teams-header-left">
        <div className="teams-app-name">
          Teams
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="teams-search-wrapper">

        <Search24Regular className="teams-search-icon" />

        <input
          className="teams-search-input"
          placeholder="Search"
        />

      </div>

      {/* RIGHT */}
      <div className="teams-header-right">

        <Settings24Regular className="teams-header-icon" />

        <div className="teams-user-avatar">
          UA
        </div>

      </div>

    </div>
  );
}