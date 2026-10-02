import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import useRedirectAfter from "../hooks/useRedirectAfter";
import useDocumentTitle from "../hooks/useDocumentTitle";
import FormField from "../components/FormField";
import "../styles/user-login.css";

const validate = (v) => {
  const errors = {};
  if (!v.name.trim()) errors.name = "Please enter your name.";
  if (!v.memberId.trim()) errors.memberId = "Please enter your Member ID.";
  return errors;
};

export default function UserLogin() {
  useDocumentTitle("User Login");
  const { loginUser } = useAuth();
  const redirect = useRedirectAfter(700);
  const [message, setMessage] = useState(null);
  const { errors, bind, handleSubmit } = useForm({ name: "", memberId: "" }, validate);

  const submit = handleSubmit((values) => {
    const result = loginUser(values.name.trim(), values.memberId.trim());
    setMessage({ text: result.message, type: result.ok ? "success" : "error" });
    if (result.ok) redirect(result.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
  });

  return (
    <div className="page-user-login">
      <div className="login-container">
        <div className="login-card">
          <div className="logo">📚</div>
          <h1>User Login</h1>
          <p className="subtitle">Login to your Community Library account</p>

          <form onSubmit={submit} noValidate>
            <FormField label="Name" id="userName" type="text" placeholder="Enter your name" autoComplete="name" error={errors.name} {...bind("name")} />
            <FormField label="Member ID" id="memberId" type="text" placeholder="Enter your Member ID" error={errors.memberId} {...bind("memberId")} />

            <p className={`message ${message ? message.type : ""}`} role="status">{message?.text}</p>
            <button type="submit">Login</button>
          </form>

          <div className="home-link">
            <Link to="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
