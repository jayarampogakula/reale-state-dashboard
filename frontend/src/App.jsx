import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import CompanyAdminDashboard from "./components/CompanyAdminDashboard";
import AgentDashboard from "./components/AgentDashboard";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/" />;
  if (role && role !== userRole) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/superadmin" element={
          <PrivateRoute role="superadmin"><SuperAdminDashboard /></PrivateRoute>
        } />
        <Route path="/companyadmin" element={
          <PrivateRoute role="companyadmin"><CompanyAdminDashboard /></PrivateRoute>
        } />
        <Route path="/agent" element={
          <PrivateRoute role="agent"><AgentDashboard /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
