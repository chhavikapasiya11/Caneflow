import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/Schedule.css";

function Schedule() {

    const [serviceDate, setServiceDate] = useState("");

    const [capacity, setCapacity] = useState("");

    const [schedules, setSchedules] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadSchedules = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/schedules");

            setSchedules(response.data.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSchedules();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/schedules",
                {
                    serviceDate,
                    capacity,
                }
            );

            alert("Schedule created successfully");

            setServiceDate("");

            setCapacity("");

            loadSchedules();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Something went wrong"

            );

        }

    };

    return (

        <div className="schedule-container">

            <div className="schedule-card">

                <h1>

                    Procurement Schedule

                </h1>

                <form onSubmit={handleSubmit}>

                    <label>

                        Service Date

                    </label>

                    <input

                        type="date"

                        value={serviceDate}

                        onChange={(e) =>

                            setServiceDate(
                                e.target.value
                            )

                        }

                        required

                    />

                    <label>

                        Capacity

                    </label>

                    <input

                        type="number"

                        placeholder="Enter Capacity"

                        value={capacity}

                        onChange={(e) =>

                            setCapacity(
                                e.target.value
                            )

                        }

                        required

                    />

                    <button type="submit">

                        Create Schedule

                    </button>

                </form>

            </div>

            <div className="schedule-list">

                <h2>

                    Existing Schedules

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>

                                Service Date

                            </th>

                            <th>

                                Capacity

                            </th>

                            <th>

                                Allocated

                            </th>

                            <th>

                                Remaining

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                            (

                                <tr>

                                    <td colSpan="4">

                                        Loading...

                                    </td>

                                </tr>

                            )

                            :

                            schedules.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="4">

                                        No Procurement Schedule Found

                                    </td>

                                </tr>

                            )

                            :

                            schedules.map((schedule) => (

                                <tr
                                    key={schedule._id}
                                >

                                    <td>

                                        {schedule.serviceDate}

                                    </td>

                                    <td>

                                        {schedule.capacity}

                                    </td>

                                    <td>

                                        {schedule.allocated}

                                    </td>

                                    <td>

                                        {

                                            schedule.capacity -

                                            schedule.allocated

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Schedule;