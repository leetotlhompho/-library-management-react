import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBooks from "./pages/ManageBooks";
import ManageUsers from "./pages/ManageUsers";
import Transactions from "./pages/Transactions";

function NotFound() {
  return (
    <div className="route-fallback">
      <h1>Page not found</h1>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />

      {/* member area */}
      <Route path="/user-dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />

      {/* admin / librarian area */}
      <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/manage-books" element={<ProtectedRoute role="admin"><ManageBooks /></ProtectedRoute>} />
      <Route path="/manage-users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute role="admin"><Transactions /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
