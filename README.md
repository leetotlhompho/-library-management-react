# Community Library Management System (React)

BIWA2110 – Web Application Development, Individual Assignment 2.
A React rewrite of the original HTML/CSS/JavaScript project. Data is saved in **Local Storage**.

## Run it

```bash
npm install
npm run dev      # open the URL Vite prints (usually http://localhost:5173)
npm run build    # production build in /dist
```

## Demo logins (created on first run only)

| Who | Where | Credentials |
| --- | --- | --- |
| Admin | Admin Login | Admin ID `admin` / password `admin123` |
| Member | User Login | Name `Demo Member` / Member ID `M001` |
| Librarian | User Login | Name `Demo Librarian` / Member ID `L001` (goes to the admin area) |

You can also register a new admin from the Admin Login page. To reset everything, clear this site's Local Storage.
Passwords are stored in plain text in Local Storage because there is no backend – fine for this assignment, not for production.

## Assignment checklist

| Requirement | Where it is done |
| --- | --- |
| **Add** books (title, author, genre, ISBN, initial quantity) | `components/BookForm.jsx`, `addBook` in `context/LibraryContext.jsx`, page `pages/ManageBooks.jsx` |
| **Update** books | "Update" button loads the row into `BookForm`; `updateBook` |
| **Delete** books | "Delete" button (with confirm) → `deleteBook` |
| Track quantity in stock | `quantity` on every book, shown on both dashboards |
| **Add stock** transaction | `pages/Transactions.jsx` → `components/StockForm.jsx` → `addStock` |
| **Deduct stock** transaction (blocked if more than in stock) | same form with `deduct` → `deductStock` |
| Members borrow / return (deducts / restores stock) | `pages/UserDashboard.jsx` → `borrowBook` / `returnBook` |
| Transaction history log (newest first, can be cleared) | `components/TransactionTable.jsx` |
| **Login form** for users | `pages/UserLogin.jsx` (plus `AdminLogin.jsx`, `AdminRegister.jsx`) |
| **Add / update / delete users** (name, membership ID, role) | `pages/ManageUsers.jsx`, `components/UserForm.jsx`, `UserTable.jsx` |
| Dashboard: availability table | `pages/AdminDashboard.jsx` + `components/BookTable.jsx` |
| Dashboard: **low stock highlighted** (fewer than 2) | `utils/stock.js` (`LOW_STOCK_LIMIT = 2`), amber "LOW STOCK" rows, red "OUT OF STOCK" rows, plus a warning banner |

## React concepts demonstrated

* **Hooks** – `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useNavigate`, and custom hooks in `src/hooks/`
  (`useLocalStorage`, `useForm`, `useFlash`, `useRedirectAfter`, `useDocumentTitle`).
* **Lifecycle (via hooks)** – `useEffect` persists data to Local Storage, syncs across tabs with a `storage` listener that is removed on unmount, loads a book/user into the form when "Update" is pressed, and clears timers (flash messages, redirects) in cleanup functions.
* **Component composition** – small reusable pieces: `Header`, `Footer`, `FormField`, `FlashMessage`, `StatCard`, `StockBadge`, `BookTable` (read-only *and* editable), `BookForm`/`UserForm` (add *and* update), `StockForm` (add *and* deduct), `TransactionTable`, `ProtectedRoute`.
* **Forms** – all forms are controlled components with per-field validation messages and submit handlers (`hooks/useForm.js`). Validation includes ISBN format, duplicate ISBN / Member ID / email, non-negative whole-number quantities, and "cannot deduct more than in stock".
* **React Router** – `HashRouter` + `Routes`, `Link`/`NavLink`, `useNavigate`, `Navigate`, and protected admin/member routes (`App.jsx`).
* **State management** – `LibraryContext` (books, users, transactions) and `AuthContext` (sessions), both backed by Local Storage.

## Project structure

```
src/
  main.jsx, App.jsx           entry point + routes
  context/                    LibraryContext, AuthContext
  hooks/                      custom hooks
  components/                 reusable UI pieces
  pages/                      one component per screen
  utils/                      stock rules, borrowing logic, seed data
  styles/                     original page CSS, scoped per page (+ shared.css)
  assets/library-background.png
```

Local Storage keys are unchanged from the original project: `libraryBooks`, `libraryUsers`, `libraryTransactions`, `libraryAdmins`, `loggedInUser`, `loggedInAdmin`.

## Submitting to GitHub

```bash
git init
git add .
git commit -m "Library management system in React"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Submit the repository link.
