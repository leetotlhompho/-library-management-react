import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import useFlash from "../hooks/useFlash";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StockForm from "../components/StockForm";
import TransactionTable from "../components/TransactionTable";
import "../styles/transactions.css";

export default function Transactions() {
  useDocumentTitle("Transactions");
  const { books, transactions, addStock, deductStock, clearTransactions } = useLibrary();
  const { logoutAdmin } = useAuth();
  const [addFlash, showAddFlash] = useFlash();
  const [deductFlash, showDeductFlash] = useFlash();

  function handleAdd(bookId, qty) {
    const result = addStock(bookId, qty);
    showAddFlash(result.message, result.ok ? "success" : "error");
    return result;
  }

  function handleDeduct(bookId, qty) {
    const result = deductStock(bookId, qty);
    showDeductFlash(result.message, result.ok ? "success" : "error");
    return result;
  }

  function handleClear() {
    if (transactions.length === 0) return;
    if (window.confirm("Are you sure you want to clear all transaction history?")) clearTransactions();
  }

  return (
    <div className="page-transactions">
      <Header
        links={[
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/manage-books", label: "Manage Books" },
          { to: "/manage-users", label: "Manage Users" },
          { to: "/transactions", label: "Transactions" },
          { to: "/admin-login", label: "Logout", onClick: () => logoutAdmin() },
        ]}
      />

      <main>
        <div className="page-header">
          <h1>Transactions</h1>
          <p>Manage library stock and view transaction history.</p>
        </div>

        <div className="transaction-container">
          <StockForm
            title="Add Stock" description="Add new copies of a book to the library."
            buttonLabel="Add Stock" idPrefix="add" books={books}
            onSubmit={handleAdd} flash={addFlash}
          />
          <StockForm
            title="Deduct Stock" description="Remove copies from the available library stock."
            buttonLabel="Deduct Stock" buttonClass="deduct-button" idPrefix="deduct" books={books} deduct
            onSubmit={handleDeduct} flash={deductFlash}
          />
        </div>

        <section className="history-card">
          <div className="history-header">
            <h2>Transaction History</h2>
            <p>Record of all library transactions.</p>
          </div>

          <div className="clear-history-container">
            <button type="button" className="clear-history-button" onClick={handleClear}>
              Clear Transaction History
            </button>
          </div>

          <TransactionTable transactions={transactions} />

          <div className="dashboard-container">
            <Link to="/admin-dashboard" className="dashboard-button">Dashboard</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
