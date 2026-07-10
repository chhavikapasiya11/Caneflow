import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MillDashboard from "./pages/MillDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import Schedule from "./pages/Schedule";
import Farmers from "./pages/Farmer";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Default Route */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Mill Routes */}

        <Route
          path="/mill-dashboard"
          element={
            <ProtectedRoute allowedRoles={["mill"]}>
              <MillDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute allowedRoles={["mill"]}>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmers"
          element={
            <ProtectedRoute allowedRoles={["mill"]}>
              <Farmers />
            </ProtectedRoute>
          }
        />

        {/* Farmer Route */}

        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;