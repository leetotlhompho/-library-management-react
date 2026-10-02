import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "../styles/index.css";

export default function Home() {
  const navigate = useNavigate();
  useDocumentTitle("Home");

  return (
    <div className="page-home">
      <Header links={[{ to: "/", label: "Home" }, { to: "/about", label: "About" }]} />

      <section className="welcome">
        <div className="welcome-content">
          <h1>Welcome to the Community Library</h1>
          <p>A simple and secure system for managing books, users and library transactions.</p>
        </div>
      </section>

      <main>
        <div className="role-container">
          <h2>Welcome to the Library Management System</h2>
          <p>Please select your role below to continue.</p>

          <div className="role-buttons">
            <button type="button" className="role-button user-button" onClick={() => navigate("/user-login")}>
              <span>User / Librarian</span>
            </button>
            <button type="button" className="role-button admin-button" onClick={() => navigate("/admin-login")}>
              <span>Admin</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
