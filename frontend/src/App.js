import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MillDashboard from "./pages/MillDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import Schedule from "./pages/Schedule";
import ProtectedRoute from "./components/ProtectedRoute";
import Farmers from "./pages/Farmer";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/mill-dashboard"
          element={<MillDashboard />}
        />

        <Route
          path="/farmer-dashboard"
          element={<FarmerDashboard />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />

     
                <Route
                    path="/farmer-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["farmer"]}>
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/farmers"
    element={<Farmers />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;