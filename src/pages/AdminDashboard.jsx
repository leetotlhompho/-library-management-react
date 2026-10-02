import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { LOW_STOCK_LIMIT } from "../utils/stock";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import BookTable from "../components/BookTable";
import "../styles/admin-dashboard.css";

const MANAGEMENT = [
  { title: "Book Management", text: "Add, update, and delete library books.", to: "/manage-books", cta: "Manage Books" },
  { title: "Transactions", text: "Add stock, deduct stock, and view history.", to: "/transactions", cta: "Manage Transactions" },
  { title: "User Management", text: "Add, update, and delete library users.", to: "/manage-users", cta: "Manage Users" },
];

export default function AdminDashboard() {
  useDocumentTitle("Admin Dashboard");
  const navigate = useNavigate();
  const { books, users, transactions } = useLibrary();
  const { loggedInAdmin, logoutAdmin } = useAuth();

  const totalCopies = useMemo(() => books.reduce((sum, b) => sum + Number(b.quantity), 0), [books]);
  const lowStockBooks = useMemo(() => books.filter((b) => Number(b.quantity) < LOW_STOCK_LIMIT), [books]);

  return (
    <div className="page-admin-dashboard">
      <Header
        links={[
          { to: "/", label: "Home" },
          { to: "/admin-login", label: "Logout", onClick: () => logoutAdmin() },
        ]}
      />

      <main>
        <section className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {loggedInAdmin?.name}. Manage books, users, and library transactions.</p>
        </section>

        <section className="dashboard-cards">
          <StatCard title="Books" value={books.length} caption="Total Books" />
          <StatCard title="Available" value={totalCopies} caption="Available Copies" />
          <StatCard title="Users" value={users.length} caption="Registered Users" />
          <StatCard title="Transactions" value={transactions.length} caption="Total Transactions" />
        </section>

        <section className="content-section">
          <div className="section-header">
            <div>
              <h2>Current Book Availability</h2>
              <p>View the current stock of library books.</p>
            </div>
          </div>

          {lowStockBooks.length > 0 && (
            <p className="low-stock-alert" role="alert">
              ⚠ {lowStockBooks.length} {lowStockBooks.length === 1 ? "book has" : "books have"} low or no stock:{" "}
              {lowStockBooks.map((b) => b.title).join(", ")}
            </p>
          )}

          <BookTable books={books} wrapperClass="table-container" emptyClass="empty-message" emptyText="No books available." />
        </section>

        <section className="management-section">
          {MANAGEMENT.map((item) => (
            <div className="management-card" key={item.to}>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link to={item.to}>{item.cta}</Link>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
