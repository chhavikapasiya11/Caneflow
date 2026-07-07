import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // User not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // User role not allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {

        if (user.role === "mill") {
            return <Navigate to="/mill-dashboard" replace />;
        }

        if (user.role === "farmer") {
            return <Navigate to="/farmer-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;