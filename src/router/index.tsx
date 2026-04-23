import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import DashboardSwitcher from "@/components/layout/DashboardSwitcher";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminLogin from "@/pages/auth/AdminLogin";
import ForumGeneral from "@/pages/chat/ForumGeneral";
import TeamChat from "@/pages/chat/TeamChat";
import Leaderboard from "@/pages/student/Leaderboard";
import ModuleList from "@/pages/modules/ModuleList";
import ModuleDetail from "@/pages/modules/ModuleDetail";
import Profile from "@/pages/student/Profile";
import PeaceProject from "@/pages/student/PeaceProject";
import TeacherProjectReview from "@/pages/teacher/TeacherProjectReview";
import TeacherTeamManagement from "@/pages/teacher/TeacherTeamManagement";
import TeacherStudentManagement from "@/pages/teacher/TeacherStudentManagement";
import ManageBadges from "@/pages/admin/ManageBadges";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageModules from "@/pages/admin/ManageModules";
import ManageMissions from "@/pages/admin/ManageMissions";
import ManageReports from "@/pages/admin/ManageReports";
// import ManageSettings from "@/pages/admin/ManageSettings";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestRoute><Login /></GuestRoute>,
  },
  {
    path: "/register",
    element: <GuestRoute><Register /></GuestRoute>,
  },
  {
    path: "/admin/login",
    element: <GuestRoute><AdminLogin /></GuestRoute>,
  },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardSwitcher />,
      },
      {
        path: "/forum",
        element: <ForumGeneral />,
      },
      {
        path: "/team-chat",
        element: <TeamChat />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/modul",
        element: <ModuleList category="KEWARGANEGARAAN" title="Modul Belajar" subtitle="Materi Pancasila & Kewarganegaraan untuk memperkuat jiwa kebangsaan" />,
      },
      {
        path: "/budaya",
        element: <ModuleList category="BUDAYA" title="Budaya Aceh" subtitle="Mengenal lebih dekat kearifan lokal dan tradisi mulia tanah Serambi Mekkah" />,
      },
      {
        path: "/modul/:slug",
        element: <ModuleDetail />,
      },
      {
        path: "/profil",
        element: <Profile />,
      },
      {
        path: "/proyek",
        element: <PeaceProject />,
      },
      {
        path: "/teacher/review-proyek",
        element: <TeacherProjectReview />,
      },
      {
        path: "/teacher/manajemen-tim",
        element: <TeacherTeamManagement />,
      },
      {
        path: "/teacher/kelola-siswa",
        element: <TeacherStudentManagement />,
      },
      {
        path: "/admin/badges",
        element: <ManageBadges />,
      },
      {
        path: "/admin/users",
        element: <ManageUsers />,
      },
      {
        path: "/admin/modules",
        element: <ManageModules />,
      },
      {
        path: "/admin/missions",
        element: <ManageMissions />,
      },
      {
        path: "/admin/reports",
        element: <ManageReports />,
      },
      // {
      //   path: "/admin/settings",
      //   element: <ManageSettings />,
      // },
    ],
  },
]);
