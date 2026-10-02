import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { LibraryProvider } from "./context/LibraryContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/shared.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <LibraryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LibraryProvider>
    </HashRouter>
  </StrictMode>
);
