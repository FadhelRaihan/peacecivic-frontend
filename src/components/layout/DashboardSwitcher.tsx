import Dashboard from "@/pages/student/Dashboard";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export default function DashboardSwitcher() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  switch (role) {
    case "TEACHER":
      return <TeacherDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    case "STUDENT":
    default:
      return <Dashboard />;
  }
}
