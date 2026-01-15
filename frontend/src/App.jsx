import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/Dashboard";
import Modules from "./pages/user/Modules";
import ModuleDetail from "./pages/user/ModuleDetail";
import ChatTutor from "./pages/user/ChatTutor";
import Progress from "./pages/user/Progress";
import RoleSelector from "./components/RoleSelector";
import RoleDashboard from "./pages/user/RoleDashboard";
import LabsPage from "./pages/user/LabsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageModules from "./pages/admin/ManageModules";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageLabs from "./pages/admin/ManageLabs";
import Logs from "./pages/admin/Logs";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleSelector />} />
        <Route path="modules" element={<Modules />} />
        <Route path="modules/:id" element={<ModuleDetail />} />
        <Route path="chat" element={<ChatTutor />} />
        <Route path="progress" element={<Progress />} />
        <Route path="role-dashboard/:roleId" element={<RoleDashboard />} />
        <Route path="labs" element={<LabsPage />} />
        <Route path="labs/:roleId" element={<LabsPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="modules" element={<ManageModules />} />
        <Route path="labs" element={<ManageLabs />} />
        <Route path="questions" element={<ManageQuestions />} />
        <Route path="logs" element={<Logs />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
