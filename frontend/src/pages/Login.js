import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setError("");

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const validate = () => {

        if (!formData.phone || !formData.password) {

            return "Phone and password are required.";

        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(formData.phone)) {

            return "Please enter a valid 10-digit mobile number.";

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

            const response = await api.post(
                "/auth/login",
                {
                    phone: formData.phone.trim(),
                    password: formData.password,
                }
            );

            const { token, user } =
                response.data.data;

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            if (user.role === "mill") {

                navigate("/mill-dashboard");

            }

            else if (user.role === "farmer") {

                navigate("/farmer-dashboard");

            }

            else {

                navigate("/login");

            }

        }

        catch (err) {

            setError(

                err.response?.data?.message ||

                "Invalid phone or password."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>

                    CaneFlow

                </h2>

                <p>

                    Sign in to your account

                </p>

                {

                    error &&

                    <div className="error-box">

                        {error}

                    </div>

                }

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {

                            loading

                                ?

                                "Signing In..."

                                :

                                "Login"

                        }

                    </button>

                </form>

                <p className="register-link">

                    Don't have an account?

                    <Link to="/register">

                        {" "}Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;