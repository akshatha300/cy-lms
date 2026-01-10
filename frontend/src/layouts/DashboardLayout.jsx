import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FloatingChatbot from "../components/FloatingChatbot";

const DashboardLayout = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>

      {/* Floating chatbot accessible from any page */}
      <FloatingChatbot />
    </div>
  );
};

export default DashboardLayout;
