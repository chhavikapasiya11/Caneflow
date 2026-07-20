import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/Schedule.css";

function Schedule() {

    const [serviceDate, setServiceDate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const getToday = () => {

        return new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        ).format(new Date());

    };

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

    useEffect(() => {

        if (!message) return;

        const timer = setTimeout(() => {

            setMessage("");

            setMessageType("");

        }, 3000);

        return () => clearTimeout(timer);

    }, [message]);

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

            setMessage("Schedule created successfully.");

            setMessageType("success");

            setServiceDate("");

            setCapacity("");

            loadSchedules();

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Something went wrong."

            );

            setMessageType("error");

        }

    };

    const deleteSchedule = async (id) => {

        if (
            !window.confirm(
                "Delete this schedule?"
            )
        ) {
            return;
        }

        try {

            const response =
                await api.delete(
                    `/schedules/${id}`
                );

            setMessage(response.data.message);

            setMessageType("success");

            loadSchedules();

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Unable to delete schedule."

            );

            setMessageType("error");

        }

    };

    const cleanupOldRecords = async () => {

        if (
            !window.confirm(
                "Delete all schedules before today?"
            )
        ) {
            return;
        }

        try {

            const response =
                await api.delete(
                    "/schedules/cleanup"
                );

            setMessage(response.data.message);

            setMessageType("success");

            loadSchedules();

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Cleanup failed."

            );

            setMessageType("error");

        }

    };

    return (

        <div className="schedule-container">

            <div className="schedule-card">

                <h1>

                    Procurement Schedule

                </h1>

                {

                    message && (

                        <div
                            className={`message ${messageType}`}
                        >

                            {message}

                        </div>

                    )

                }

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

                <button
                    className="cleanup-btn"
                    onClick={cleanupOldRecords}
                >

                    Cleanup Old Records

                </button>

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

                            <th>

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                            (

                                <tr>

                                    <td colSpan="5">

                                        Loading...

                                    </td>

                                </tr>

                            )

                            :

                            schedules.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="5">

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

                                    <td>

                                        {

                                            schedule.serviceDate < getToday() ?

                                            (

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteSchedule(
                                                            schedule._id
                                                        )
                                                    }
                                                >

                                                    Delete

                                                </button>

                                            )

                                            :

                                            (

                                                <span>

                                                    -

                                                </span>

                                            )

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