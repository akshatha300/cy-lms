import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/Dashboard";
import Modules from "./pages/user/Modules";
import ModuleDetail from "./pages/user/ModuleDetail";
import ChatTutor from "./pages/user/ChatTutor";
import Progress from "./pages/user/Progress";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/" replace />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="modules" element={<Modules />} />
        <Route path="modules/:id" element={<ModuleDetail />} />
        <Route path="chat" element={<ChatTutor />} />
        <Route path="progress" element={<Progress />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
