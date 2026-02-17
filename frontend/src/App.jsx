import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import IncidentListPage from "./pages/IncidentListPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/incidents" replace />} />
        <Route path="/incidents" element={<IncidentListPage />} />
        <Route path="/incidents/new" element={<CreateIncidentPage />} />
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
      </Route>
    </Routes>
  );
}
