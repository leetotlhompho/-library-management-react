import { useState } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import useFlash from "../hooks/useFlash";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import "../styles/manageuser.css";

export default function ManageUsers() {
  useDocumentTitle("User Management");
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const { logoutAdmin } = useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [flash, showFlash] = useFlash();

  function handleSubmit(data) {
    const result = editingUser ? updateUser(editingUser.id, data) : addUser(data);
    showFlash(result.message, result.ok ? "success" : "error");
    if (result.ok && editingUser) setEditingUser(null);
    return result;
  }

  function handleDelete(user) {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    const result = deleteUser(user.id);
    if (editingUser?.id === user.id) setEditingUser(null);
    showFlash(result.message, "success");
  }

  return (
    <div className="page-manage-users">
      <Header
        links={[
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/", label: "Home" },
          { to: "/admin-login", label: "Logout", onClick: () => logoutAdmin() },
        ]}
      />

      <main>
        <div className="page-title">
          <h1>User Management</h1>
          <p>Add, update, and delete users in the community library.</p>
        </div>

        <UserForm editingUser={editingUser} onSubmit={handleSubmit} onCancel={() => setEditingUser(null)} flash={flash} />

        <section className="user-card">
          <div className="table-header">
            <div>
              <h2>Registered Users</h2>
              <p className="card-description">Current users registered by the administrator.</p>
            </div>
            <span className="user-count">{users.length === 1 ? "1 User" : `${users.length} Users`}</span>
          </div>

          <UserTable users={users} onEdit={setEditingUser} onDelete={handleDelete} />
        </section>

        <div className="back-container">
          <Link to="/admin-dashboard">Dashboard</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
