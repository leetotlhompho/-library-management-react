import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import useFlash from "../hooks/useFlash";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getBorrowedBooks } from "../utils/borrowing";
import { getStockStatus } from "../utils/stock";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlashMessage from "../components/FlashMessage";
import "../styles/user-dashboard.css";

export default function UserDashboard() {
  useDocumentTitle("User Dashboard");
  const { loggedInUser, logoutUser } = useAuth();
  const { books, transactions, borrowBook, returnBook } = useLibrary();
  const [flash, showFlash] = useFlash();

  const memberId = loggedInUser?.memberId;
  const borrowed = useMemo(() => getBorrowedBooks(transactions, memberId), [transactions, memberId]);

  const hasBorrowed = (book) => borrowed.some((b) => (b.bookId ? b.bookId === book.id : b.title === book.title));

  function handleBorrow(book) {
    if (hasBorrowed(book)) {
      showFlash("You have already borrowed this book.", "error");
      return;
    }
    const result = borrowBook(book.id, memberId);
    showFlash(result.message, result.ok ? "success" : "error");
  }

  function handleReturn(item) {
    const result = returnBook(item, memberId);
    showFlash(result.message, result.ok ? "success" : "error");
  }

  return (
    <div className="page-user-dashboard">
      <Header
        links={[
          { to: "/user-dashboard", label: "Dashboard" },
          { to: "/", label: "Home" },
          { to: "/user-login", label: "Logout", onClick: () => logoutUser() },
        ]}
      />

      <main>
        <section className="welcome">
          <h1>User Dashboard</h1>
          <p>Welcome, <strong>{loggedInUser?.name || "User"}</strong></p>
          <p>Membership ID: <strong>{memberId || "-"}</strong></p>
        </section>

        <FlashMessage flash={flash} />

        <section className="dashboard-card">
          <h2>Available Books</h2>
          <p className="description">Browse books currently available in the library.</p>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Available</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr><td colSpan={6} className="empty">No books have been added yet.</td></tr>
                ) : (
                  books.map((book) => {
                    const quantity = Number(book.quantity) || 0;
                    const { statusClass } = getStockStatus(quantity);
                    return (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.isbn}</td>
                        <td><span className={statusClass}>{quantity}</span></td>
                        <td>
                          <button type="button" className="borrow-btn" disabled={quantity === 0} onClick={() => handleBorrow(book)}>
                            {quantity > 0 ? "Borrow" : "Unavailable"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>My Borrowed Books</h2>
          <p className="description">Books currently borrowed by you.</p>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Book</th><th>Borrowed Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {borrowed.length === 0 ? (
                  <tr><td colSpan={3} className="empty">You have no borrowed books.</td></tr>
                ) : (
                  borrowed.map((item, index) => (
                    <tr key={`${item.key}-${item.date}-${index}`}>
                      <td>{item.title}</td>
                      <td>{item.date}</td>
                      <td>
                        <button type="button" className="return-btn" onClick={() => handleReturn(item)}>Return</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
