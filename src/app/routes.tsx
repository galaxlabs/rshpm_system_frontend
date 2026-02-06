// src/app/routes.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AppShell from "@/layout/AppShell";

import LoginPage from "@/modules/rshpm/pages/LoginPage";
import DashboardPage from "@/modules/rshpm/pages/DashboardPage";
import DoctypeListPage from "@/modules/rshpm/pages/DoctypeListPage";
import DoctypeFormPage from "@/modules/rshpm/pages/DoctypeFormPage";
import NotFound from "@/app/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="rshpm" replace />} />

        <Route path="rshpm" element={<DashboardPage />} />
        <Route path="rshpm/:doctype" element={<DoctypeListPage />} />
        <Route path="rshpm/:doctype/new" element={<DoctypeFormPage mode="new" />} />
        <Route path="rshpm/:doctype/:name" element={<DoctypeFormPage mode="edit" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
