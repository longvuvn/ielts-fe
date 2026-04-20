import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error/ErrorPage.jsx";
import HomePage from "./pages/Home/index.jsx";
import LibraryPage from "./pages/Library/index.jsx";
import LibraryDetailPage from "./pages/Library/LibraryDetailPage.jsx";
import ExamListPage from "./pages/Exam/index.jsx";
import ExamDetailPage from "./pages/Exam/ExamDetailPage.jsx";
import PracticePage from "./pages/Exam/PracticePage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminLoginPage from "./pages/Admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/Admin/index.jsx";
import AdminLayout from "./components/layouts/Admin/AdminLayout.jsx";
import LearnerPage from "./pages/Admin/LearnerPage.jsx";
import ExamManagementPage from "./pages/Admin/ExamManagementPage.jsx";
import CrawlerPage from "./pages/Admin/CrawlerPage.jsx";
import TopicPage from "./pages/Admin/TopicPage.jsx";
import UserLoginPage from "./pages/Auth/LoginPage.jsx";
import FlashcardDetailPage from "./pages/detail/FlashCardPageDetail.jsx";
import FlashCardStudyPage from "./pages/detail/FlashCardStudyPage.jsx";
import FlashCardQuizPage from "./pages/detail/FlashCardQuizPage.jsx";
import HistoryPage from "./pages/Learner/HistoryPage.jsx";
import ProfilePage from "./pages/Learner/ProfilePage.jsx";
import ProtectedRoute from "./routers/ProtectedRoute.jsx";
import WrongAnswerPracticePage from "./pages/Exam/WrongAnswerPracticePage.jsx";
import MistakeLabPage from "./pages/Exam/MistakeLabPage.jsx";

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
            path: "/library/:libraryId",
            element: <LibraryDetailPage />,
          },
          {
            path: "/exams",
            element: <ExamListPage />,
          },
          {
            path: "/exams/:examId",
            element: <ExamDetailPage />,
          },
          {
            path: "/history",
            element: <HistoryPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
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
    path: "/admin",
    element: <ProtectedRoute />, // Nên có thêm kiểm tra Role Admin ở đây
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "learners",
            element: <LearnerPage />,
          },
          {
            path: "exams",
            element: <ExamManagementPage />,
          },
          {
            path: "crawler",
            element: <CrawlerPage />,
          },
          {
            path: "topics",
            element: <TopicPage />,
          },
        ],
      },
    ],
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
        path: "/flashcards/:flashcardId/study",
        element: <FlashCardStudyPage />,
      },
      {
        path: "/flashcards/:flashcardId/quiz",
        element: <FlashCardQuizPage />,
      },
      {
        path: "/exams/:examId/sections/:sectionId",
        element: <PracticePage />,
      },
      {
        path: "/practice/wrong-answers",
        element: <MistakeLabPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
