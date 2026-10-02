import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "../styles/about.css";

const FEATURES = [
  { title: "Book Management", text: "Administrators can add, update, and delete books while keeping important book information organized." },
  { title: "Availability", text: "Library stock can be monitored so that administrators can see how many copies of each book are available." },
  { title: "Transactions", text: "Stock additions, deductions, borrowing and returns are recorded to help maintain an accurate transaction history." },
  { title: "User Management", text: "Administrators can add, update, and delete library users and manage their membership information." },
];

const SYSTEM_INFO = [
  { label: "System", value: "Community Library Management System" },
  { label: "Platform", value: "Web Application" },
  { label: "Data Storage", value: "Local Storage" },
  { label: "Interface", value: "React, React Router & Hooks" },
];

export default function About() {
  useDocumentTitle("About");

  return (
    <div className="page-about">
      <Header
        links={[
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
          { to: "/user-login", label: "User Login" },
          { to: "/admin-login", label: "Admin Login" },
        ]}
      />

      <main>
        <section className="about-hero">
          <div className="hero-content">
            <h1>About Community Library</h1>
            <p>A simple and efficient web-based library management system designed to help manage books, users, availability, and transactions.</p>
          </div>
        </section>

        <section className="about-card">
          <div>
            <h2>Our Library</h2>
            <p>Community Library provides an organized digital system for managing library resources. The system allows administrators to manage books, monitor stock, manage users, and keep track of library transactions.</p>
            <p>Users can securely log in using their name and membership ID and access their library dashboard to view available books and manage their borrowed books.</p>
          </div>
        </section>

        <section className="purpose-section">
          <div className="section-heading">
            <span>Why Community Library?</span>
            <p>Making library management simple, organized, and accessible.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-card">
          <h2>System Information</h2>
          <div className="info-grid">
            {SYSTEM_INFO.map((item) => (
              <div className="info-item" key={item.label}>
                <span className="info-label">{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="cta">
          <h2>Welcome to Community Library</h2>
          <p>Explore our library system and manage your library resources with ease.</p>
          <div className="cta-buttons">
            <Link to="/" className="primary-btn">Home</Link>
            <Link to="/user-login" className="secondary-btn">User Login</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
