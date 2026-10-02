import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import useRedirectAfter from "../hooks/useRedirectAfter";
import useDocumentTitle from "../hooks/useDocumentTitle";
import FormField from "../components/FormField";
import "../styles/admin-register.css";

const EMPTY = { adminId: "", name: "", email: "", password: "", confirmPassword: "" };

const validate = (v) => {
  const errors = {};
  if (v.adminId.trim().length < 3) errors.adminId = "Admin ID must be at least 3 characters.";
  if (v.name.trim().length < 2) errors.name = "Please enter a valid name.";
  if (v.email.trim().length < 3) errors.email = "Please enter an email or username.";
  if (v.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (v.confirmPassword !== v.password) errors.confirmPassword = "Passwords do not match.";
  return errors;
};

export default function AdminRegister() {
  useDocumentTitle("Admin Registration");
  const { registerAdmin } = useAuth();
  const redirect = useRedirectAfter(1200);
  const [message, setMessage] = useState(null);
  const { errors, bind, reset, handleSubmit } = useForm(EMPTY, validate);

  const submit = handleSubmit((values) => {
    const result = registerAdmin({
      adminId: values.adminId.trim(), name: values.name.trim(),
      email: values.email.trim(), password: values.password,
    });
    setMessage({ text: result.message, type: result.ok ? "success" : "error" });
    if (result.ok) {
      reset(EMPTY);
      redirect("/admin-login");
    }
  });

  return (
    <div className="page-admin-register">
      <div className="register-container">
        <div className="register-card">
          <h1>Admin Registration</h1>
          <p className="subtitle">Create an administrator account</p>

          <form onSubmit={submit} noValidate>
            <FormField label="Admin ID" id="adminId" type="text" placeholder="Enter Admin ID" error={errors.adminId} {...bind("adminId")} />
            <FormField label="Name" id="adminName" type="text" placeholder="Enter your name" error={errors.name} {...bind("name")} />
            <FormField label="Email / Username" id="adminEmail" type="text" placeholder="Enter email or username" error={errors.email} {...bind("email")} />
            <FormField label="Password" id="adminPassword" type="password" placeholder="Enter password" autoComplete="new-password" error={errors.password} {...bind("password")} />
            <FormField label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm password" autoComplete="new-password" error={errors.confirmPassword} {...bind("confirmPassword")} />

            <p className={`message ${message ? message.type : ""}`} role="status">{message?.text}</p>
            <button type="submit">Register Admin</button>
          </form>

          <div className="login-link">
            <span>Already have an admin account?</span>
            <Link to="/admin-login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
