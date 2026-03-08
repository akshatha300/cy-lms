import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/StyledDashboard";
import SimpleModules from "./pages/user/SimpleModules";
import ModuleQuiz from "./pages/user/ModuleQuiz";
import ModuleDetail from "./pages/user/ModuleDetail";
import ChatTutor from "./pages/user/ChatTutor";
import Progress from "./pages/user/Progress";
import RoleSelector from "./components/RoleSelector";
import RoleDashboard from "./pages/user/RoleDashboard";
import AIMLLabsPage from "./pages/user/AIMLLabsPage";
import LabDetail from "./pages/user/LabDetail";
import ChatbotDashboard from "./pages/user/ChatbotDashboard";
import CareerRoadmap from "./pages/user/CareerRoadmap";
import CareerRoadmapDetail from "./pages/user/CareerRoadmapDetail";
import InteractiveKnowledgeGraph from "./pages/user/InteractiveKnowledgeGraph";
import VoiceTutor from "./pages/user/VoiceTutor";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageModules from "./pages/admin/ManageModules";
import ViewModules from "./pages/admin/ViewModules";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageLabs from "./pages/admin/ManageLabs";
import ViewLabs from "./pages/admin/ViewLabs";
import ManageCareerRoadmaps from "./pages/admin/ManageCareerRoadmaps";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import SimpleDashboardLayout from "./layouts/SimpleDashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import GlobalChatbot from "./components/GlobalChatbot";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <Dashboard />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/modules" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <SimpleModules />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/modules/:id" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <ModuleDetail />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/modules/:id/quiz" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <ModuleQuiz />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/labs" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <AIMLLabsPage />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/labs/:roleId" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <AIMLLabsPage />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/labs/:labId/detail" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <LabDetail />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/chat" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <ChatTutor />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/chat-dashboard" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <ChatbotDashboard />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/career-roadmap" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <CareerRoadmap />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/career-roadmap/:roleId" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <CareerRoadmapDetail />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/knowledge-graph" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <InteractiveKnowledgeGraph />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/voice-tutor" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <VoiceTutor />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />
      <Route path="/progress" element={
          <ProtectedRoute>
            <SimpleDashboardLayout>
              <Progress />
            </SimpleDashboardLayout>
          </ProtectedRoute>
        } />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="role-dashboard/:roleId" element={<RoleDashboard />} />
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
        <Route path="view-modules" element={<ViewModules />} />
        <Route path="questions" element={<ManageQuestions />} />
        <Route path="manage-labs" element={<ManageLabs />} />
        <Route path="view-labs" element={<ViewLabs />} />
        <Route path="manage-career-roadmaps" element={<ManageCareerRoadmaps />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppWithChatbot() {
  return (
    <>
      <App />
      <GlobalChatbot />
    </>
  );
}

export default AppWithChatbot;
