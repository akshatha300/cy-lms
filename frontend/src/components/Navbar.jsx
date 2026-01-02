import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#1f2937",
        color: "white",
      }}
    >
      <h3>Cyber LMS</h3>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/app" style={{ color: "white" }}>
          Dashboard
        </Link>
        <Link to="/admin" style={{ color: "white" }}>
          Admin
        </Link>
        <span>{user?.email}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
