import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
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
        width: "240px",
        background: "#0f172a",
        color: "white",
        padding: "16px",
        minHeight: "calc(100vh - 50px)",
      }}
    >
      <h4 style={{ marginBottom: "12px" }}>Admin</h4>
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NavLink to="/admin" end style={linkStyle}>
          Overview
        </NavLink>
        <NavLink to="/admin/users" style={linkStyle}>
          Users
        </NavLink>
        <NavLink to="/admin/view-modules" style={linkStyle}>
          Modules
        </NavLink>
        <NavLink to="/admin/view-labs" style={linkStyle}>
          Labs
        </NavLink>
        <NavLink to="/admin/questions" style={linkStyle}>
          Questions
        </NavLink>
        <NavLink to="/admin/logs" style={linkStyle}>
          Logs
          
        </NavLink>
      </nav>
    </aside>
  );
};


export default AdminSidebar;
