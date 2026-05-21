import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationFormPage } from "./pages/ApplicationFormPage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResumeVersionsPage } from "./pages/ResumeVersionsPage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "applications", element: <ApplicationsPage /> },
      { path: "applications/new", element: <ApplicationFormPage /> },
      { path: "applications/:id", element: <ApplicationDetailPage /> },
      { path: "applications/:id/edit", element: <ApplicationFormPage /> },
      { path: "resume-versions", element: <ResumeVersionsPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
