import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

// Get Clerk key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y29tcGxldGUtaGFyZS02MC5jbGVyay5hY2NvdW50cy5kZXYk";

// Error handling for missing root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure you have a div with id='root' in your HTML.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
