import { useState } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import useFlash from "../hooks/useFlash";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookForm from "../components/BookForm";
import BookTable from "../components/BookTable";
import "../styles/managebook.css";

export default function ManageBooks() {
  useDocumentTitle("Book Management");
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const { logoutAdmin } = useAuth();
  const [editingBook, setEditingBook] = useState(null);
  const [flash, showFlash] = useFlash();

  function handleSubmit(data) {
    const result = editingBook ? updateBook(editingBook.id, data) : addBook(data);
    showFlash(result.message, result.ok ? "success" : "error");
    if (result.ok && editingBook) setEditingBook(null);
    return result;
  }

  function handleDelete(book) {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    const result = deleteBook(book.id);
    if (editingBook?.id === book.id) setEditingBook(null);
    showFlash(result.message, "success");
  }

  return (
    <div className="page-manage-books">
      <Header
        links={[
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/", label: "Home" },
          { to: "/admin-login", label: "Logout", onClick: () => logoutAdmin() },
        ]}
      />

      <main>
        <div className="page-title">
          <h1>Book Management</h1>
          <p>Add, update, and delete books in the community library.</p>
        </div>

        <BookForm editingBook={editingBook} onSubmit={handleSubmit} onCancel={() => setEditingBook(null)} flash={flash} />

        <section className="book-card">
          <div className="table-header">
            <div>
              <h2>Library Books</h2>
              <p className="card-description">Current books in the library.</p>
            </div>
            <span className="book-count">{books.length === 1 ? "1 Book" : `${books.length} Books`}</span>
          </div>

          <BookTable
            books={books}
            emptyText="No books have been added yet."
            onEdit={setEditingBook}
            onDelete={handleDelete}
          />
        </section>

        <div className="back-container">
          <Link to="/admin-dashboard">Dashboard</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
