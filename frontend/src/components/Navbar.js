import React from "react";

export default function Navbar({ activePage, setActivePage, user, onLogout }) {
  const links = [
    { name: "Dashboard", icon: "ri-dashboard-line" },
    { name: "Generated BRDs", icon: "ri-file-text-line", label: "Documents" },
    { name: "Upload Data", icon: "ri-add-box-line", label: "New Report" },
    { name: "Insights", icon: "ri-bar-chart-box-line", label: "Insights" },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      <a className="sidebar-brand" onClick={() => setActivePage("Dashboard")}>
        <div className="brand-logo">
          <i className="ri-brain-line"></i>
        </div>
        FormulateBRD
      </a>

      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.name}>
            <button
              className={`nav-link ${activePage === link.name ? "active" : ""}`}
              onClick={() => setActivePage(link.name)}
            >
              <i className={link.icon}></i>
              {link.label || link.name}
            </button>
          </li>
        ))}
        {/* Mock Links for visuals based on design image */}
        <li>
          <button 
            className={`nav-link ${activePage === 'Team' ? "active" : ""}`}
            onClick={() => setActivePage('Team')}
          >
            <i className="ri-team-line"></i> Team
          </button>
        </li>
        <li>
          <button 
            className={`nav-link ${activePage === 'Settings' ? "active" : ""}`}
            onClick={() => setActivePage('Settings')}
          >
            <i className="ri-settings-4-line"></i> Settings
          </button>
        </li>
      </ul>

      {user && (
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
        >
          <div
            className="user-avatar"
            title={user.name}
            style={{
              width: 36,
              height: 36,
              fontSize: 13,
              background: "var(--grad-1)",
            }}
          >
            {getInitials(user.name)}
          </div>
          <div className="user-info" style={{ flex: 1, overflow: "hidden" }}>
            <div
              className="user-name"
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {user.name}
            </div>
            <div
              className="user-role"
              style={{ fontSize: 11, color: "var(--text-muted)" }}
            >
              Backend & AI
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(241, 65, 108, 0.1)",
              border: "none",
              color: "var(--error)",
              width: 30,
              height: 30,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justify: "center",
            }}
          >
            <i className="ri-logout-box-r-line" title="Logout"></i>
          </button>
        </div>
      )}
    </aside>
  );
}
