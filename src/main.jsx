import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import HomePage from "./pages/Home/index.jsx";
import LibraryPage from "./pages/Library/index.jsx";
import ExamListPage from "./pages/Exam/index.jsx";
import ExamDetailPage from "./pages/Exam/ExamDetailPage.jsx";
import PracticePage from "./pages/Exam/PracticePage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminLoginPage from "./pages/Admin/AdminLoginPage.jsx";
import UserLoginPage from "./pages/Auth/LoginPage.jsx";
import FlashcardDetailPage from "./pages/detail/FlashCardPageDetail.jsx";
import ProtectedRoute from "./routers/prive.jsx";

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
        element: <ProtectedRoute />,
        children: [
          {
            path: "/library",
            element: <LibraryPage />,
          },
          {
            path: "/exams",
            element: <ExamListPage />,
          },
          {
            path: "/exams/:examId",
            element: <ExamDetailPage />,
          },
        ],
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
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/flashcards/:flashcardId",
        element: <FlashcardDetailPage />,
      },
      {
        path: "/exams/:examId/sections/:sectionId",
        element: <PracticePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
