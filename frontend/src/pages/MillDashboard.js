import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/MillDashboard.css";

function MillDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});

    const loadDashboard = async () => {

        try {

            const response =
                await api.get("/mill-dashboard");

            setDashboard(response.data.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    const nextVehicle = async () => {

        try {

            const response =
                await api.post("/queue-state/next");

            alert(response.data.message);

            loadDashboard();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

     navigate("/login");

    };

    return (

        <div className="dashboard-container">

            <div className="dashboard-card">

                <h1>

                    Mill Dashboard

                </h1>

                <div className="dashboard-info">

                    <p>

                        <strong>Service Date :</strong>

                        {dashboard.serviceDate || "-"}

                    </p>

                    <p>

                        <strong>Capacity :</strong>

                       {dashboard?.capacity || 0}

                    </p>

                    <p>

                        <strong>Allocated :</strong>

                      {dashboard?.allocated || 0}
                    </p>

                    <p>

                        <strong>Current Token :</strong>

                    {dashboard?.currentToken || 0}


                    </p>

                    <p>

                        <strong>Remaining Vehicles :</strong>

                      {dashboard?.remainingVehicles || 0}

                    </p>

                </div>

               <button
    onClick={nextVehicle}
>

    Next Vehicle

</button>

<button
    onClick={() =>
        navigate("/farmers")
    }
>

    Farmer Verification

</button>

<button
    onClick={() =>
        navigate("/schedule")
    }
>

    Procurement Schedule

</button>

<button
    onClick={logout}
>

    Logout

</button>

            </div>

        </div>

    );

}

export default MillDashboard;