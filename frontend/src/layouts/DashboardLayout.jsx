import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
