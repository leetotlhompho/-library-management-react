import { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { makeId } from "../utils/id";
import { SEED_BOOKS, SEED_USERS } from "../utils/seed";

const LibraryContext = createContext(null);

const ok = (message) => ({ ok: true, message });
const fail = (message) => ({ ok: false, message });
const same = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

export function LibraryProvider({ children }) {
  // Local Storage is the "database". Keys match the original project.
  const [books, setBooks] = useLocalStorage("libraryBooks", SEED_BOOKS);
  const [users, setUsers] = useLocalStorage("libraryUsers", SEED_USERS);
  const [transactions, setTransactions] = useLocalStorage("libraryTransactions", []);

  // Older saved data had no ids - give every record one (runs once).
  useEffect(() => {
    if (books.some((b) => !b.id)) {
      setBooks((prev) => prev.map((b) => (b.id ? b : { ...b, id: makeId("book") })));
    }
  }, [books, setBooks]);

  useEffect(() => {
    if (users.some((u) => !u.id)) {
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          id: u.id || makeId("user"),
          memberId: u.memberId || u.membershipId || "",
          role: u.role || "user",
        }))
      );
    }
  }, [users, setUsers]);

  const logTransaction = useCallback(
    (book, type, quantity, memberId) => {
      setTransactions((prev) => [
        ...prev,
        {
          id: makeId("txn"),
          bookId: book.id,
          book: book.title,
          type,
          quantity,
          date: new Date().toLocaleString(),
          memberId,
        },
      ]);
    },
    [setTransactions]
  );

  /* ---------------- BOOKS ---------------- */

  const addBook = useCallback(
    (data) => {
      if (books.some((b) => same(b.isbn, data.isbn))) {
        return fail("A book with this ISBN already exists.");
      }
      setBooks((prev) => [...prev, { ...data, id: makeId("book"), quantity: Number(data.quantity) }]);
      return ok("Book added successfully.");
    },
    [books, setBooks]
  );

  const updateBook = useCallback(
    (id, data) => {
      if (books.some((b) => b.id !== id && same(b.isbn, data.isbn))) {
        return fail("A book with this ISBN already exists.");
      }
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...data, quantity: Number(data.quantity) } : b))
      );
      return ok("Book updated successfully.");
    },
    [books, setBooks]
  );

  const deleteBook = useCallback(
    (id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      return ok("Book deleted successfully.");
    },
    [setBooks]
  );

  /* ---------------- STOCK ---------------- */

  const changeStock = useCallback(
    (bookId, amount, type, memberId) => {
      const book = books.find((b) => b.id === bookId);
      const qty = Number(amount);

      if (!book) return fail("Book not found.");
      if (!Number.isInteger(qty) || qty <= 0) return fail("Please enter a valid whole-number quantity.");

      if (type === "Add Stock") {
        setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, quantity: Number(b.quantity) + qty } : b)));
        logTransaction(book, type, qty, memberId);
        return ok(`${qty} copy/copies added successfully.`);
      }

      if (qty > Number(book.quantity)) {
        return fail(`Cannot deduct ${qty} copies. Only ${book.quantity} available.`);
      }
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, quantity: Number(b.quantity) - qty } : b)));
      logTransaction(book, type, qty, memberId);
      return ok(`${qty} copy/copies deducted successfully.`);
    },
    [books, setBooks, logTransaction]
  );

  const addStock = useCallback((bookId, qty) => changeStock(bookId, qty, "Add Stock", "Admin"), [changeStock]);
  const deductStock = useCallback((bookId, qty) => changeStock(bookId, qty, "Deduct Stock", "Admin"), [changeStock]);

  const clearTransactions = useCallback(() => setTransactions([]), [setTransactions]);

  /* ---------------- BORROW / RETURN (member side) ---------------- */

  const borrowBook = useCallback(
    (bookId, memberId) => {
      const book = books.find((b) => b.id === bookId);
      if (!book) return fail("Book could not be found.");
      if (Number(book.quantity) <= 0) return fail("This book is out of stock.");
      if (!memberId) return fail("Your account does not have a Member ID.");

      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, quantity: Number(b.quantity) - 1 } : b)));
      logTransaction(book, "Borrow", 1, memberId);
      return ok("Book borrowed successfully.");
    },
    [books, setBooks, logTransaction]
  );

  const returnBook = useCallback(
    (item, memberId) => {
      const book = books.find((b) => (item.bookId ? b.id === item.bookId : b.title === item.title));
      if (!book) return fail("Book could not be found.");

      setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, quantity: Number(b.quantity) + 1 } : b)));
      logTransaction(book, "Return", 1, memberId);
      return ok("Book returned successfully.");
    },
    [books, setBooks, logTransaction]
  );

  /* ---------------- USERS ---------------- */

  const checkUserDuplicates = useCallback(
    (data, ignoreId) => {
      if (users.some((u) => u.id !== ignoreId && same(u.memberId, data.memberId))) {
        return "This Member ID already exists.";
      }
      if (users.some((u) => u.id !== ignoreId && same(u.email || "", data.email))) {
        return "This email or username already exists.";
      }
      return null;
    },
    [users]
  );

  const addUser = useCallback(
    (data) => {
      const problem = checkUserDuplicates(data);
      if (problem) return fail(problem);
      setUsers((prev) => [...prev, { ...data, id: makeId("user") }]);
      return ok("User added successfully.");
    },
    [checkUserDuplicates, setUsers]
  );

  const updateUser = useCallback(
    (id, data) => {
      const problem = checkUserDuplicates(data, id);
      if (problem) return fail(problem);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
      return ok("User updated successfully.");
    },
    [checkUserDuplicates, setUsers]
  );

  const deleteUser = useCallback(
    (id) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return ok("User deleted successfully.");
    },
    [setUsers]
  );

  const value = useMemo(
    () => ({
      books, users, transactions,
      addBook, updateBook, deleteBook,
      addStock, deductStock, clearTransactions,
      borrowBook, returnBook,
      addUser, updateUser, deleteUser,
    }),
    [books, users, transactions, addBook, updateBook, deleteBook, addStock, deductStock,
     clearTransactions, borrowBook, returnBook, addUser, updateUser, deleteUser]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return context;
}
