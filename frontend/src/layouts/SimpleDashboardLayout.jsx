import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const SimpleDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default SimpleDashboardLayout;
