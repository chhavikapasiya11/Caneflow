import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/Farmer.css";

function Farmers() {

    const navigate = useNavigate();

    const [farmers, setFarmers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [loadingId, setLoadingId] = useState(null);

    const loadFarmers = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/farmers");

            setFarmers(response.data.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadFarmers();

    }, []);

    const verifyFarmer = async (farmerId) => {

        try {

            setLoadingId(farmerId);

            const response =
                await api.post(
                    "/queue",
                    {
                        farmerId,
                    }
                );

            alert(
                `Token ${response.data.data.tokenNumber}
Service Date : ${response.data.data.serviceDate}`
            );

            loadFarmers();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to generate token"
            );

        }

        finally {

            setLoadingId(null);

        }

    };

    const filteredFarmers = farmers.filter((farmer) =>

        farmer.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        farmer.phone.includes(search)

    );

    return (

        <div className="farmers-container">

            <div className="header">

                <h1>

                    Farmer Verification

                </h1>

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/mill-dashboard")
                    }
                >

                    Back

                </button>

            </div>

            <input
                type="text"
                className="search-box"
                placeholder="Search by Name or Phone"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <table>

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Phone</th>

                        <th>Registered On</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        loading ?

                        (

                            <tr>

                                <td colSpan="4">

                                    Loading Farmers...

                                </td>

                            </tr>

                        )

                        :

                        filteredFarmers.length === 0 ?

                        (

                            <tr>

                                <td colSpan="4">

                                    No Pending Farmers

                                </td>

                            </tr>

                        )

                        :

                        filteredFarmers.map((farmer) => (

                            <tr
                                key={farmer._id}
                            >

                                <td>

                                    {farmer.name}

                                </td>

                                <td>

                                    {farmer.phone}

                                </td>

                                <td>

                                    {
                                        new Date(
                                            farmer.createdAt
                                        ).toLocaleDateString()
                                    }

                                </td>

                                <td>

                                    <button

                                        className="verify-btn"

                                        disabled={
                                            loadingId === farmer._id
                                        }

                                        onClick={() =>
                                            verifyFarmer(
                                                farmer._id
                                            )
                                        }

                                    >

                                        {

                                            loadingId === farmer._id

                                                ?

                                                "Generating..."

                                                :

                                                "Verify & Generate Token"

                                        }

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Farmers;