import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import useRedirectAfter from "../hooks/useRedirectAfter";
import useDocumentTitle from "../hooks/useDocumentTitle";
import FormField from "../components/FormField";
import "../styles/admin-login.css";

const validate = (v) => {
  const errors = {};
  if (!v.adminId.trim()) errors.adminId = "Please enter your Admin ID.";
  if (!v.password) errors.password = "Please enter your password.";
  return errors;
};

export default function AdminLogin() {
  useDocumentTitle("Admin Login");
  const { loginAdmin } = useAuth();
  const redirect = useRedirectAfter(700);
  const [message, setMessage] = useState(null);
  const { errors, bind, handleSubmit } = useForm({ adminId: "", password: "" }, validate);

  const submit = handleSubmit((values) => {
    const result = loginAdmin(values.adminId.trim(), values.password);
    setMessage({ text: result.message, type: result.ok ? "success" : "error" });
    if (result.ok) redirect("/admin-dashboard");
  });

  return (
    <div className="page-admin-login">
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p className="subtitle">Login to the library administration system</p>

          <form onSubmit={submit} noValidate>
            <FormField label="Admin ID" id="adminId" type="text" placeholder="Enter Admin ID" error={errors.adminId} {...bind("adminId")} />
            <FormField label="Password" id="adminPassword" type="password" placeholder="Enter password" autoComplete="current-password" error={errors.password} {...bind("password")} />

            <p className={`message ${message ? message.type : ""}`} role="status">{message?.text}</p>
            <button type="submit">Login</button>
          </form>

          <div className="register-link">
            <span>Don't have an admin account?</span>
            <Link to="/admin-register">Register Admin</Link>
          </div>
          <div className="back-link">
            <Link to="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
