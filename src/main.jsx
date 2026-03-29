import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import HomePage from "./pages/Home/index.jsx";
import LibraryPage from "./pages/Library/index.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminLoginPage from "./pages/Admin/AdminLoginPage.jsx";
import UserLoginPage from "./pages/Auth/LoginPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/library",
        element: <LibraryPage />,
      },
    ],
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/login",
    element: <UserLoginPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
