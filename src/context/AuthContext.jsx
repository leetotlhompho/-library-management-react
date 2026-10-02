import { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useLibrary } from "./LibraryContext";
import { SEED_ADMINS } from "../utils/seed";

const AuthContext = createContext(null);

const fail = (message) => ({ ok: false, message });
const same = (a, b) => String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();

export function AuthProvider({ children }) {
  const { users } = useLibrary();

  const [admins, setAdmins] = useLocalStorage("libraryAdmins", SEED_ADMINS);
  const [loggedInUser, setLoggedInUser] = useLocalStorage("loggedInUser", null);
  const [loggedInAdmin, setLoggedInAdmin] = useLocalStorage("loggedInAdmin", null);

  /** Member login: name + Member ID. Librarians are sent to the admin area. */
  const loginUser = useCallback(
    (name, memberId) => {
      if (users.length === 0) {
        return fail("No registered users found. Please contact the administrator.");
      }
      const user = users.find((u) => same(u.name, name) && same(u.memberId, memberId));
      if (!user) return fail("Invalid name or Member ID.");

      const loginTime = new Date().toLocaleString();

      if (user.role === "librarian") {
        setLoggedInAdmin({ adminId: user.memberId, name: user.name, email: user.email || "", role: "librarian", loginTime });
        return { ok: true, message: "Login successful. Redirecting...", role: "admin" };
      }

      setLoggedInUser({ name: user.name, memberId: user.memberId, email: user.email || "", role: "user", loginTime });
      return { ok: true, message: "Login successful. Redirecting...", role: "user" };
    },
    [users, setLoggedInUser, setLoggedInAdmin]
  );

  const loginAdmin = useCallback(
    (adminId, password) => {
      const admin = admins.find((a) => same(a.adminId, adminId));
      if (!admin || admin.password !== password) return fail("Invalid Admin ID or password.");

      setLoggedInAdmin({ adminId: admin.adminId, name: admin.name, email: admin.email, role: "admin", loginTime: new Date().toLocaleString() });
      return { ok: true, message: "Login successful. Redirecting..." };
    },
    [admins, setLoggedInAdmin]
  );

  const registerAdmin = useCallback(
    (data) => {
      if (admins.some((a) => same(a.adminId, data.adminId))) {
        return fail("This Admin ID is already registered.");
      }
      setAdmins((prev) => [...prev, { ...data, createdAt: new Date().toLocaleString() }]);
      return { ok: true, message: "Admin registered successfully." };
    },
    [admins, setAdmins]
  );

  const logoutUser = useCallback(() => setLoggedInUser(null), [setLoggedInUser]);
  const logoutAdmin = useCallback(() => setLoggedInAdmin(null), [setLoggedInAdmin]);

  const value = useMemo(
    () => ({ loggedInUser, loggedInAdmin, loginUser, loginAdmin, registerAdmin, logoutUser, logoutAdmin }),
    [loggedInUser, loggedInAdmin, loginUser, loginAdmin, registerAdmin, logoutUser, logoutAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
