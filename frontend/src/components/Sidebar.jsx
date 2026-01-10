import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 15px",
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "#1f2937" : "transparent",
    textDecoration: "none",
    borderRadius: "4px",
  });

  return (
    <aside
      style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "15px",
        minHeight: "calc(100vh - 50px)",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NavLink to="/app" end style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/app/roles" style={linkStyle}>
          Career Roles
        </NavLink>
        <NavLink to="/app/modules" style={linkStyle}>
          Modules
        </NavLink>
        <NavLink to="/app/labs" style={linkStyle}>
          Labs
        </NavLink>
        <NavLink to="/app/chat" style={linkStyle}>
          Chat Tutor
        </NavLink>
        <NavLink to="/app/progress" style={linkStyle}>
          Progress
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
