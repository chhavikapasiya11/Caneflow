import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setError("");
        setSuccess("");

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        const name = formData.name.trim();
        const phone = formData.phone.trim();

        if (
            !name ||
            !phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            return "All fields are required.";
        }


        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }

        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await api.post("/auth/register", {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                role: formData.role,
            });

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">

                <h2>CaneFlow</h2>
                <p>Create your account</p>

                {error && <div className="error-box">{error}</div>}

                {success && (
                    <div className="success-box">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                    />


                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="farmer">Farmer</option>
                        <option value="mill">Mill</option>
                    </select>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="login-link">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;